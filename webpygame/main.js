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
    if (instance === undefined) {
        throw new TypeError("Instance is undefined.");
    }
    if (instance === null) {
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
            "SetTitle": "W2M:GUI.SetTitle",
            "RenderBitMap": "W2M:GUI.RenderBitMap"
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
        this.textCache = "";
        this.lines = [""];
        this.index = 0;
        this.size = size;
        this.pen = RequireNotEmpty(consoleCanvas.getContext("2d"));
        this.pen.fillStyle = "black";
        this.pen.fillRect(0, 0, consoleCanvas.width, consoleCanvas.height);
        this.pen.font = this.size.toString() + "px";
        this.pen.textAlign = 'left';
        this.pen.textBaseline = 'top';
        this.pen.fillStyle = 'white';
    }
    pushText(text) {
        this.textCache += text;
    }
    format() {
        if (this.textCache.length == 0) {
            return;
        }
        for (let i = 0; i < this.textCache.length; i++) {
            switch (this.textCache[i]) {
                case "\n": {
                    this.lines.push("");
                    break;
                }
                case "\r": {
                    this.lines[this.lines.length - 1] = "";
                    break;
                }
                default: {
                    this.lines[this.lines.length - 1] += this.textCache[i];
                }
            }
        }
        this.textCache = "";
    }
    render() {
        this.format();
        for (let i = this.index; i < this.lines.length - 1; i++) {
            this.pen.fillText(this.lines[i], 0, i * this.size);
        }
        this.index = this.lines.length - 1;
    }
}
class App {
    constructor(consoleCanvas, uiCanvas, workerProvider, showConsole) {
        this.uiCanvasBitMapRenderer = null;
        this.messageCache = new MessageCacheQueue(64);
        this.launched = false;
        this.consoleCanvas = consoleCanvas;
        this.uiCanvas = uiCanvas;
        this.workerProvider = workerProvider;
        this.messagePosterDelegate = null;
        this.showConsole = showConsole == undefined ? true : showConsole;
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
                if (this.showConsole) {
                    this.consoleRenderer.render();
                }
                break;
            }
            case MessageType.W2M.Console.Stdout: {
                if (this.showConsole) {
                    this.consoleRenderer.pushText(message.messageBody);
                }
                break;
            }
            case MessageType.W2M.Console.Flush: {
                if (this.showConsole) {
                    this.consoleRenderer.render();
                }
                break;
            }
            case MessageType.W2M.GUI.RenderBitMap: {
                if (this.uiCanvasBitMapRenderer != null) {
                    this.uiCanvasBitMapRenderer.transferFromImageBitmap(message.messageBody);
                    message.messageBody.close();
                }
            }
        }
    }
    isLaunched() {
        return this.launched;
    }
    launch() {
        var _a;
        this.launched = true;
        if (SharedArrayBuffer == undefined) {
            return Promise.reject("NO_SHARED_ARRAY_BUFFER");
        }
        if (HTMLCanvasElement.prototype.transferControlToOffscreen == undefined || ((_a = OffscreenCanvasRenderingContext2D === null || OffscreenCanvasRenderingContext2D === void 0 ? void 0 : OffscreenCanvasRenderingContext2D.prototype) === null || _a === void 0 ? void 0 : _a.commit) == undefined) {
            if ((ImageBitmapRenderingContext === null || ImageBitmapRenderingContext === void 0 ? void 0 : ImageBitmapRenderingContext.prototype.transferFromImageBitmap) == undefined) {
                return Promise.reject("NO_COMMIT_API");
            }
        }
        if (navigator.serviceWorker == undefined) {
            return Promise.reject("NO_SERVICE_WORKER");
        }
        if (!this.showConsole) {
            this.consoleCanvas.style.display = "none";
            this.uiCanvas.requestFullscreen({ "navigationUI": "hide" });
        }
        return navigator.serviceWorker.register("serviceworker.js", {
            "scope": "./"
        }).then(() => new Promise((resolve) => {
            let sharedBuffer = new SharedArrayBuffer(1027);
            let uint8Array = new Uint8Array(sharedBuffer);
            let textEncoder = new TextEncoder();
            let textEncoderBuffer = new Uint8Array(1024);
            let dataview = new DataView(sharedBuffer);
            let worker = this.workerProvider();
            worker.onmessage = (ev) => {
                if (ev.data.messageType != MessageType.W2M.LifeCycle.RequestInitMessageChannel) {
                    return;
                }
                this.uiCanvas.width = ev.data.messageBody[0];
                this.uiCanvas.height = ev.data.messageBody[1];
                Atomics.store(uint8Array, 0, MessageType.STATUS.MAIN_ACCESS);
                worker.onmessage = (ev) => {
                    if (ev.data.messageType !== MessageType.W2M.LifeCycle.ConnectionOK) {
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
                        if (document.fullscreenElement == this.uiCanvas) {
                            this.postMessage({
                                "messageType": MessageType.M2W.Mouse.MouseDown,
                                "messageBody": {
                                    "pos": [ev.touches[0].clientX / document.documentElement.clientWidth * this.uiCanvas.width, ev.touches[0].clientY / document.documentElement.clientHeight * this.uiCanvas.height]
                                }
                            });
                        }
                        else {
                            this.postMessage({
                                "messageType": MessageType.M2W.Mouse.MouseDown,
                                "messageBody": {
                                    "pos": [ev.touches[0].clientX, ev.touches[0].clientY]
                                }
                            });
                        }
                    });
                    this.uiCanvas.addEventListener("touchend", (ev) => {
                        ev.preventDefault();
                        this.postMessage({
                            "messageType": MessageType.M2W.Mouse.MouseUp,
                            "messageBody": null
                        });
                    });
                    resolve();
                };
                if (this.uiCanvas.transferControlToOffscreen == undefined || OffscreenCanvasRenderingContext2D.prototype.commit == undefined) {
                    this.uiCanvasBitMapRenderer = this.uiCanvas.getContext("bitmaprenderer");
                    worker.postMessage({
                        "messageType": MessageType.M2W.LifeCycle.InitMessageChannel,
                        "messageBody": {
                            "sharedBuffer": sharedBuffer,
                            "canvas": null
                        }
                    });
                }
                else {
                    let offscreenCanvas = this.uiCanvas.transferControlToOffscreen();
                    worker.postMessage({
                        "messageType": MessageType.M2W.LifeCycle.InitMessageChannel,
                        "messageBody": {
                            "sharedBuffer": sharedBuffer,
                            "canvas": offscreenCanvas
                        }
                    }, [offscreenCanvas]);
                }
            };
        }));
    }
    postMessage(message) {
        this.messageCache.push(message);
        if (this.messagePosterDelegate != null) {
            this.messagePosterDelegate();
        }
    }
}
var WebPygame = new App(RequireNotEmpty(document.getElementById("consoleCanvas")), RequireNotEmpty(document.getElementById("guiCanvas")), () => new Worker("worker.js"), false);
document.documentElement.addEventListener("mousedown", () => {
    if (!WebPygame.isLaunched()) {
        WebPygame.launch().catch((errorType) => alert("Unsupported browser! Error Message: " + errorType));
    }
});
document.documentElement.addEventListener("touchstart", () => {
    if (!WebPygame.isLaunched()) {
        WebPygame.launch().catch((errorType) => alert("Unsupported browser! Error Message: " + errorType));
    }
});
