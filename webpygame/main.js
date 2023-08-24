"use strict";
var StringFormat = function (instance, args) {
    let result = '', formatI = 0;
    for (let i = 0; i < instance.length; i++) {
        if (instance[i] !== '{' && instance[i] !== '}') {
            result = result + instance[i];
        }
        else if (instance[i] === '{') {
            if (i + 1 >= instance.length) {
                throw 'String.format Error';
            }
            else if (instance[i + 1] === '}') {
                if (formatI < args.length) {
                    result = result + args[formatI];
                    formatI++;
                    i++;
                }
                else {
                    throw 'String.format Error';
                }
            }
            else {
                throw 'String.format Error';
            }
        }
        else {
            throw 'String.format Error';
        }
    }
    return result;
};
var RequireNotEmpty = function (instance) {
    if (instance == undefined) {
        throw new TypeError("Instance is undefined.");
    }
    if (instance == null) {
        throw new TypeError("Instance is null.");
    }
    return instance;
};
var MessageType = {
    "M2W": {
        "LifeCycle": {
            "InitMessageChannel": "M2W:LifeCycle.InitMessageChannel"
        },
        "Keyboard": {
            "KeyDown": "M2W:Keyboard.KeyDown",
            "KeyUp": "M2W:Keyboard.KeyUp"
        },
        "Mouse": {
            "MouseDown": "M2W:Mouse.MouseDown",
            "MouseUp": "M2W:Mouse.MouseUp"
        }
    },
    "W2M": {
        "LifeCycle": {
            "RequestInitMessageChannel": "W2M:LifeCycle.RequestSharedMemory",
            "ConnectionOK": "W2M:LifeCycle.ConnectionOK",
            "MessagePumped": "W2M:LifeCycle.MessagePumped",
            "Exit": "W2M:LifeCycle.Exit"
        },
        "Console": {
            "Stdout": "W2M:Console.Stdout",
            "Flush": "W2M:Console.Flush"
        },
        "GUI": {
            "Resize": "W2M:GUI.Resize",
            "SetTitle": "W2M:GUI.SetTitle"
        }
    },
    "STATUS": {
        "MAIN_ACCESS": 0,
        "WORKER_ACCESS": 1
    }
};
class MessageCacheQueue {
    constructor(size) {
        this.cacheArray = [];
        for (let i = 0; i < size; i++) {
            this.cacheArray.push(null);
        }
        this.pointer = 0;
    }
    push(message) {
        if (this.cacheArray[this.pointer] != null) {
            console.error("Drop message.", this.cacheArray[this.pointer]);
        }
        this.cacheArray[this.pointer] = message;
        this.pointer = (this.pointer + 1) % this.cacheArray.length;
    }
    readAll() {
        let res = [];
        for (let i = 0; i < this.cacheArray.length; i++) {
            let j = (this.pointer - i) % this.cacheArray.length;
            if (this.cacheArray[j] != null) {
                res.push(this.cacheArray[j]);
            }
            this.cacheArray[j] = null;
        }
        return res;
    }
}
class ConsoleRenderer {
    constructor(consoleCanvas, size) {
        this.text = "";
        this.size = size;
        this.pen = RequireNotEmpty(consoleCanvas.getContext("2d"));
    }
    pushText(text) {
        this.text += text;
    }
    render() {
        let lines = [""];
        for (let i = 0; i < this.text.length; i++) {
            switch (this.text[i]) {
                case "\n": {
                    lines.push("");
                    break;
                }
                case "\r": {
                    lines[lines.length - 1] = "";
                    break;
                }
                default: {
                    lines[lines.length - 1] += this.text[i];
                }
            }
        }
        this.pen.font = this.size.toString() + "px";
        this.pen.fillStyle = 'black';
        this.pen.textAlign = 'left';
        this.pen.textBaseline = 'top';
        this.pen.fillRect(0, 0, this.pen.canvas.width, this.pen.canvas.height);
        this.pen.fillStyle = 'white';
        for (let i = 0; i < lines.length; i++) {
            this.pen.fillText(lines[i], 0, i * this.size);
        }
    }
}
class App {
    constructor(consoleCanvas, uiCanvas, workerProvider) {
        this.messageCache = new MessageCacheQueue(64);
        this.launched = false;
        this.consoleCanvas = consoleCanvas;
        this.uiCanvas = uiCanvas;
        this.workerProvider = workerProvider;
        this.messagePosterDelegate = null;
        this.consoleRenderer = new ConsoleRenderer(consoleCanvas, 14);
    }
    runtimeOnMessageHandler(message) {
        switch (message.messageType) {
            case MessageType.W2M.LifeCycle.MessagePumped: {
                if (this.messagePosterDelegate !== null) {
                    this.messagePosterDelegate();
                }
                break;
            }
            case MessageType.W2M.LifeCycle.Exit: {
                this.consoleRenderer.render();
                break;
            }
            case MessageType.W2M.Console.Stdout: {
                this.consoleRenderer.pushText(message.messageBody);
                break;
            }
            case MessageType.W2M.Console.Flush: {
                this.consoleRenderer.render();
                break;
            }
            case MessageType.W2M.GUI.Resize: {
                this.uiCanvas.width = message.messageBody[0];
                this.uiCanvas.height = message.messageBody[1];
                break;
            }
        }
    }
    haslaunched() {
        return this.launched;
    }
    launch(onError, showConsole) {
        this.launched = true;
        if (SharedArrayBuffer === null || SharedArrayBuffer === undefined) {
            onError();
            return;
        }
        if (showConsole == false) {
            this.consoleCanvas.style.display = "none";
            this.uiCanvas.requestFullscreen({ "navigationUI": "hide" });
        }
        let sharedBuffer = new SharedArrayBuffer(1027);
        let uint8Array = new Uint8Array(sharedBuffer);
        let textEncoder = new TextEncoder();
        let textEncoderBuffer = new Uint8Array(1024);
        let dataview = new DataView(sharedBuffer);
        let worker = this.workerProvider();
        worker.onmessage = (ev) => {
            if (ev.data.messageType != MessageType.W2M.LifeCycle.RequestInitMessageChannel) {
                onError();
                return;
            }
            Atomics.store(uint8Array, 0, MessageType.STATUS.MAIN_ACCESS);
            if (this.uiCanvas.transferControlToOffscreen == undefined) {
                onError();
                return;
            }
            worker.onmessage = (ev) => {
                if (ev.data.messageType !== MessageType.W2M.LifeCycle.ConnectionOK) {
                    onError();
                    return;
                }
                this.messagePosterDelegate = () => {
                    if (Atomics.load(uint8Array, 0) != MessageType.STATUS.MAIN_ACCESS) {
                        return;
                    }
                    let messages = this.messageCache.readAll();
                    if (messages.length == 0) {
                        return;
                    }
                    for (let i = messages.length; i >= 0; i--) {
                        let jsonString = JSON.stringify(messages.slice(0, i));
                        let encodeResult = textEncoder.encodeInto(jsonString, textEncoderBuffer);
                        if (encodeResult.read != undefined) {
                            if (encodeResult.read !== jsonString.length) {
                                continue;
                            }
                        }
                        if (encodeResult.written != undefined) {
                            dataview.setUint16(1, encodeResult.written, true);
                        }
                        else {
                            textEncoderBuffer.fill(32, encodeResult.written);
                            dataview.setUint16(1, textEncoderBuffer.byteLength, true);
                        }
                        uint8Array.set(textEncoderBuffer, 3);
                        for (let j = i; j < messages.length; j++) {
                            if (messages[j] != null) {
                                this.messageCache.push(messages[j]);
                            }
                        }
                        break;
                    }
                    Atomics.store(uint8Array, 0, MessageType.STATUS.WORKER_ACCESS);
                };
                worker.onmessage = (ev) => {
                    this.runtimeOnMessageHandler(ev.data);
                };
                document.documentElement.addEventListener("keydown", (ev) => {
                    ev.preventDefault();
                    this.postMessage({
                        "messageType": MessageType.M2W.Keyboard.KeyDown,
                        "messageBody": {
                            "ctrlDown": ev.ctrlKey || ev.metaKey,
                            "altDown": ev.altKey,
                            "shiftDown": ev.shiftKey,
                            "key": ev.key
                        }
                    });
                });
                document.documentElement.addEventListener("keyup", (ev) => {
                    ev.preventDefault();
                    this.postMessage({
                        "messageType": MessageType.M2W.Keyboard.KeyUp,
                        "messageBody": {
                            "ctrlDown": ev.ctrlKey || ev.metaKey,
                            "altDown": ev.altKey,
                            "shiftDown": ev.shiftKey,
                            "key": ev.key
                        }
                    });
                });
                this.uiCanvas.addEventListener("mousedown", (ev) => {
                    ev.preventDefault();
                    if (document.fullscreenElement == this.uiCanvas) {
                        this.postMessage({
                            "messageType": MessageType.M2W.Mouse.MouseDown,
                            "messageBody": {
                                "pos": [ev.offsetX / document.documentElement.clientWidth * this.uiCanvas.width, ev.offsetY / document.documentElement.clientHeight * this.uiCanvas.height]
                            }
                        });
                    }
                    else {
                        this.postMessage({
                            "messageType": MessageType.M2W.Mouse.MouseDown,
                            "messageBody": {
                                "pos": [ev.offsetX, ev.offsetY]
                            }
                        });
                    }
                });
                this.uiCanvas.addEventListener("mouseup", (ev) => {
                    ev.preventDefault();
                    if (document.fullscreenElement == this.uiCanvas) {
                        this.postMessage({
                            "messageType": MessageType.M2W.Mouse.MouseUp,
                            "messageBody": {
                                "pos": [ev.offsetX / document.documentElement.clientWidth * this.uiCanvas.width, ev.offsetY / document.documentElement.clientHeight * this.uiCanvas.height]
                            }
                        });
                    }
                    else {
                        this.postMessage({
                            "messageType": MessageType.M2W.Mouse.MouseUp,
                            "messageBody": {
                                "pos": [ev.offsetX, ev.offsetY]
                            }
                        });
                    }
                });
                this.uiCanvas.addEventListener("touchstart", (ev) => {
                    ev.preventDefault();
                    this.postMessage({
                        "messageType": MessageType.M2W.Mouse.MouseDown,
                        "messageBody": {
                            "pos": [ev.touches[0].clientX / document.documentElement.clientWidth * this.uiCanvas.width, ev.touches[0].clientY / document.documentElement.clientHeight * this.uiCanvas.height]
                        }
                    });
                });
                this.uiCanvas.addEventListener("touchend", (ev) => {
                    ev.preventDefault();
                    this.postMessage({
                        "messageType": MessageType.M2W.Mouse.MouseUp,
                        "messageBody": {
                            "pos": [ev.touches[0].clientX / document.documentElement.clientWidth * this.uiCanvas.width, ev.touches[0].clientY / document.documentElement.clientHeight * this.uiCanvas.height]
                        }
                    });
                });
            };
            let offscreenCanvas = this.uiCanvas.transferControlToOffscreen();
            worker.postMessage({
                "messageType": MessageType.M2W.LifeCycle.InitMessageChannel,
                "messageBody": {
                    "sharedBuffer": sharedBuffer,
                    "canvas": offscreenCanvas
                }
            }, [offscreenCanvas]);
        };
    }
    postMessage(message) {
        this.messageCache.push(message);
        if (this.messagePosterDelegate != null) {
            this.messagePosterDelegate();
        }
    }
    getConsoleRenderer() {
        return this.consoleRenderer;
    }
    getConsoleCanvas() {
        return this.consoleCanvas;
    }
    getUICanvas() {
        return this.uiCanvas;
    }
}
var WebPygame = new App(RequireNotEmpty(document.getElementById("consoleCanvas")), RequireNotEmpty(document.getElementById("guiCanvas")), () => new Worker("worker.js"));
document.documentElement.addEventListener("mousedown", () => {
    if (!WebPygame.haslaunched()) {
        WebPygame.launch(() => console.error("ERROR!"), false);
    }
});
