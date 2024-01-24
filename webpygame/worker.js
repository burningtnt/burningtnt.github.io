"use strict";
const StringFormat = function (instance, args) {
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
const RequireNotEmpty = function (instance) {
    if (instance === undefined) {
        throw new BytecodeRunnerFatalErrorSignal("RequireNotEmpty", "Instance is undefined.");
    }
    if (instance === null) {
        throw new BytecodeRunnerFatalErrorSignal("RequireNotEmpty", "Instance is null.");
    }
    return instance;
};
const GlobalThis = self;
const MessageType = {
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
class AppWorker {
    static instance = null;
    canvas = null;
    canvas2DContext = null;
    messageCache = [];
    constructor() {
    }
    static getInstance() {
        if (AppWorker.instance == null) {
            AppWorker.instance = new AppWorker();
        }
        return AppWorker.instance;
    }
    getCanvas() {
        return RequireNotEmpty(this.canvas);
    }
    getContext2D() {
        return RequireNotEmpty(this.canvas2DContext);
    }
    commitUIDelegate = () => {
    };
    commitUI() {
        this.commitUIDelegate();
    }
    pumpMessagesDelegate = () => {
    };
    pumpMessages() {
        this.pumpMessagesDelegate();
    }
    postMessageDelegate = () => {
    };
    postMessage(message, transfer) {
        this.postMessageDelegate(message, transfer);
    }
    getMessageDelegate = () => null;
    getMessage() {
        return this.getMessageDelegate();
    }
    launch(mainAction, screenSize) {
        const currentAPP = this;
        GlobalThis.onmessage = function (ev) {
            if (ev.data.messageType !== MessageType.M2W.LifeCycle.InitMessageChannel) {
                return;
            }
            if (ev.data.messageBody === null || ev.data.messageBody === undefined) {
                return;
            }
            let messageBody = ev.data.messageBody;
            if (messageBody.canvas == null) {
                currentAPP.canvas = new OffscreenCanvas(screenSize[0], screenSize[1]);
                currentAPP.canvas2DContext = RequireNotEmpty(currentAPP.canvas.getContext("2d"));
                currentAPP.commitUIDelegate = () => {
                    let bitmap = RequireNotEmpty(currentAPP.canvas).transferToImageBitmap();
                    currentAPP.postMessage({
                        "messageType": MessageType.W2M.GUI.RenderBitMap,
                        "messageBody": bitmap
                    }, [bitmap]);
                };
            }
            else {
                currentAPP.canvas = messageBody.canvas;
                currentAPP.canvas2DContext = RequireNotEmpty(currentAPP.canvas.getContext("2d"));
                currentAPP.commitUIDelegate = () => {
                    RequireNotEmpty(currentAPP.canvas2DContext).commit();
                };
            }
            GlobalThis.onmessage = null;
            if (messageBody.sharedBuffer.byteLength != 1027) {
                return;
            }
            let uint8Array = new Uint8Array(messageBody.sharedBuffer);
            let textDecoder = new TextDecoder("utf-8");
            let dataView = new DataView(messageBody.sharedBuffer);
            currentAPP.pumpMessagesDelegate = () => {
                if (Atomics.load(uint8Array, 0) != MessageType.STATUS.WORKER_ACCESS) {
                    return;
                }
                else {
                    let messages = JSON.parse(textDecoder.decode(uint8Array.slice(3, dataView.getUint16(1, true) + 3)));
                    Atomics.store(uint8Array, 0, MessageType.STATUS.MAIN_ACCESS);
                    currentAPP.postMessage({
                        "messageType": MessageType.W2M.LifeCycle.MessagePumped,
                        "messageBody": null
                    });
                    for (let i = 0; i < messages.length; i++) {
                        currentAPP.messageCache.push(messages[i]);
                    }
                }
            };
            currentAPP.postMessageDelegate = (message, transfer) => {
                if (transfer == undefined) {
                    GlobalThis.postMessage(message);
                }
                else {
                    GlobalThis.postMessage(message, transfer);
                }
            };
            currentAPP.getMessageDelegate = () => {
                currentAPP.pumpMessages();
                let message = currentAPP.messageCache.shift();
                if (message == undefined) {
                    return null;
                }
                else {
                    return message;
                }
            };
            currentAPP.postMessage({
                "messageType": MessageType.W2M.LifeCycle.ConnectionOK,
                "messageBody": null
            });
            mainAction();
        };
        GlobalThis.postMessage({
            "messageType": MessageType.W2M.LifeCycle.RequestInitMessageChannel,
            "messageBody": screenSize
        });
    }
    exit(exitCode) {
        this.postMessage({
            "messageType": MessageType.W2M.LifeCycle.Exit,
            "messageBody": exitCode
        });
    }
}
var PyObjectType;
var PythonRuntime;
var PythonConfiguration;
var PythonBuiltin;
var PyObjectMethods;
PyObjectType = {
    'Base': Symbol('PyObject-Base'),
    'StoragePointer': Symbol('PyObjct-Pointer'),
    'Int': Symbol('PyObject-Int'),
    'String': Symbol('PyObject-String'),
    'None': Symbol('PyObject-None'),
    'Bool': Symbol('PyObject-Bool'),
    'Iterator': Symbol('PyObject-Iterator'),
    'Tuple': Symbol('PyObject-Turple'),
    'List': Symbol('PyObject-List'),
    'Global': Symbol('PyObject-Builtin-Function&Package'),
    'Code': Symbol('PyObject-Code'),
    'FunctionObject': Symbol('PyObject-FunctionObject'),
    'Class': Symbol('PyObject-Class'),
    'ClassObject': Symbol('PyObject-ClassObject'),
    'Loop': Symbol('PyBlock-Loop'),
    'Except': Symbol('PyBlock-Exception'),
    'ExceptCaught': Symbol('PyBlock-ExceptionCaught'),
    'FunctionCall': Symbol('PyBlock-FunctionCall'),
    'TypeError': Symbol('PyError-TypeError'),
    'StopIterationError': Symbol('PyError-StopInteration'),
    'ValueError': Symbol('PyError-ValueError'),
    'IndexError': Symbol('PyError-IndexError'),
    'NameError': Symbol('PyError-NameError'),
    'AttributeError': Symbol('PyError-AttributeError'),
    'ZeroDivisionError': Symbol('PyError-ZeroDivisionError')
};
PyObjectMethods = {
    'py_binary_add': Symbol('py_binary_add'),
    'py_binary_subtract': Symbol('py_binary_subtract'),
    'py_binary_multiply': Symbol('py_binary_multiply'),
    'py_binary_power': Symbol('py_binary_power'),
    'py_binary_floor_divide': Symbol('py_binary_floor_divide'),
    'py_binary_true_divide': Symbol('py_binary_true_divide'),
    'py_binary_modulo': Symbol('py_binary_modulo'),
    'py_function_call': Symbol('py_function_call'),
    'py_compare_small': Symbol('py_compare_small'),
    'py_compare_small_equal': Symbol('py_compare_small_equal'),
    'py_compare_equal': Symbol('py_compare_equal'),
    'py_compare_not_equal': Symbol('py_compare_not_equal'),
    'py_compare_big': Symbol('py_compare_big'),
    'py_compare_big_equal': Symbol('py_compare_big_equal'),
    'py_binary_subscr': Symbol('py_binary_subscr'),
    "py_store_subscr": Symbol('py_store_subscr'),
    'py_int': Symbol('py_int'),
    'py_str': Symbol('py_str'),
    'py_repr': Symbol('py_repr'),
    'py_bool': Symbol('py_bool'),
    'py_Iterator_get': Symbol('py_Iterator_get'),
    'py_Iterator_next': Symbol('py_Iterator_next'),
    'py_method_call': Symbol('py_method_call'),
    'py_method_load': Symbol('py_method_load'),
    'py_attr_get': Symbol('py_attr_get'),
    'py_attr_set': Symbol('py_attr_set'),
    'py_internal': Symbol('py_internal')
};
class PyErrorInformation {
    namespace;
    className;
    methodName;
    constructor(namespace, className, methodName) {
        this.namespace = namespace;
        this.className = className;
        this.methodName = methodName;
    }
}
class PyObjectBase {
    type;
    constructor() {
        this.type = PyObjectType.Base;
    }
    py_binary_add(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_binary_add)));
    }
    py_binary_subtract(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_binary_subtract)));
    }
    py_binary_multiply(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_binary_multiply)));
    }
    py_binary_power(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_binary_power)));
    }
    py_binary_floor_divide(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_binary_floor_divide)));
    }
    py_binary_true_divide(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_binary_true_divide)));
    }
    py_binary_modulo(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_binary_modulo)));
    }
    py_function_call(argNum) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_function_call)));
    }
    py_compare_small(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_compare_small)));
    }
    py_compare_small_equal(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_compare_small_equal)));
    }
    py_compare_equal(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_compare_equal)));
    }
    py_compare_not_equal(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_compare_not_equal)));
    }
    py_compare_big(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_compare_big)));
    }
    py_compare_big_equal(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_compare_big_equal)));
    }
    py_binary_subscr(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_binary_subscr)));
    }
    py_store_subscr(PyObject0) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_store_subscr)));
    }
    py_int() {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_int)));
    }
    py_str() {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_str)));
    }
    py_repr() {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_repr)));
    }
    py_bool() {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_bool)));
    }
    py_Iterator_get() {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_Iterator_get)));
    }
    py_Iterator_next() {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_Iterator_next)));
    }
    py_method_call(argNum) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_method_call)));
    }
    py_method_load(argName) {
        this.py_attr_get(argName);
        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
        if (PyObject0.type === PyObjectType.FunctionObject) {
            let PyThis = this;
            PythonRuntime.storage.varStack.push(new PyObjectGlobal({
                "name": "python:object@instance.methodWrapper",
                "attr": {},
                "py_function_call": {
                    "argNum": [PythonConfiguration.codeObjectList[PyObject0.commandCode.commandEnv].argNum - 1],
                    "method": function () {
                        PythonRuntime.storage.varStack.splice(PythonRuntime.storage.varStack.length - PythonConfiguration.codeObjectList[PyObject0.commandCode.commandEnv].argNum + 1, 0, PyThis);
                        PyObject0.py_function_call(PythonConfiguration.codeObjectList[PyObject0.commandCode.commandEnv].argNum);
                    }
                },
                "$": ""
            }));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObject0);
        }
    }
    py_attr_get(value) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_attr_get)));
    }
    py_attr_set(value) {
        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'base', PyObjectMethods.py_attr_set)));
    }
}
class PyObjectStoragePointer extends PyObjectBase {
    value;
    constructor(value) {
        super();
        this.type = PyObjectType.StoragePointer;
        this.value = value;
    }
}
class PyObjectInt extends PyObjectBase {
    value;
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.Int;
    }
    py_binary_add(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(this.value + PyObject0.value));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_add)));
        }
    }
    py_binary_subtract(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(this.value - PyObject0.value));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_subtract)));
        }
    }
    py_binary_multiply(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(this.value * PyObject0.value));
        }
        else if (PyObject0.type === PyObjectType.String) {
            let newString = '';
            for (let i = 0; i < this.value; i++) {
                newString = newString + PyObject0.value;
            }
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString(newString));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_multiply)));
        }
    }
    py_binary_power(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(Math.pow(this.value, PyObject0.value)));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_power)));
        }
    }
    py_binary_floor_divide(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (PyObject0.value == 0) {
                PythonRuntime.storage.pyError.write(new PyObjectZeroDivisionError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_floor_divide)));
            }
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(Math.floor(this.value / PyObject0.value)));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_floor_divide)));
        }
    }
    py_binary_true_divide(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (PyObject0.value == 0) {
                PythonRuntime.storage.pyError.write(new PyObjectZeroDivisionError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_true_divide)));
            }
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(this.value / PyObject0.value));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_true_divide)));
        }
    }
    py_binary_modulo(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(this.value % PyObject0.value));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_binary_modulo)));
        }
    }
    py_compare_small(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (this.value < PyObject0.value) {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
            }
            else {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
            }
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_compare_small)));
        }
    }
    py_compare_small_equal(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (this.value <= PyObject0.value) {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
            }
            else {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
            }
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_compare_small_equal)));
        }
    }
    py_compare_equal(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (this.value === PyObject0.value) {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
            }
            else {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
            }
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
        }
    }
    py_compare_not_equal(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (this.value !== PyObject0.value) {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
            }
            else {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
            }
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
        }
    }
    py_compare_big(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (this.value > PyObject0.value) {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
            }
            else {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
            }
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_compare_big)));
        }
    }
    py_compare_big_equal(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (this.value >= PyObject0.value) {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
            }
            else {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
            }
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'int', PyObjectMethods.py_compare_big_equal)));
        }
    }
    py_int() {
        if (this.value >= 0) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(Math.floor(this.value)));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(-Math.floor(-this.value)));
        }
    }
    py_str() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString(this.value.toString()));
    }
    py_bool() {
        if (this.value === 0) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
        }
    }
    py_repr() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString(this.value.toString()));
    }
}
class PyObjectString extends PyObjectBase {
    value;
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.String;
    }
    py_binary_add(PyObject0) {
        if (PyObject0.type === PyObjectType.String) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString(this.value + PyObject0.value));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'string', PyObjectMethods.py_binary_add)));
        }
    }
    py_binary_multiply(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            let newString = '';
            for (let i = 0; i < PyObject0.value; i++) {
                newString = newString + this.value;
            }
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString(newString));
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'string', PyObjectMethods.py_binary_multiply)));
        }
    }
    py_str() {
        PythonRuntime.storage.varStack.push(this);
    }
    py_bool() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
    }
    py_repr() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString('\'' + this.value + '\''));
    }
}
class PyObjectNone extends PyObjectBase {
    constructor() {
        super();
        this.type = PyObjectType.None;
    }
    py_str() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString('None'));
    }
    py_bool() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
    }
    py_repr() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString('None'));
    }
}
class PyObjectBool extends PyObjectBase {
    value;
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.Bool;
    }
    py_compare_equal(PyObject0) {
        if (PyObject0.type != PyObjectType.Bool) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(this.value === PyObject0.value));
        }
    }
    py_compare_not_equal(PyObject0) {
        if (PyObject0.type != PyObjectType.Bool) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(this.value !== PyObject0.value));
        }
    }
    py_int() {
        if (this.value) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(1));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(0));
        }
    }
    py_str() {
        if (this.value) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString('True'));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString('False'));
        }
    }
    py_bool() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(this.value));
    }
    py_repr() {
        if (this.value) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString('True'));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString('False'));
        }
    }
}
class PyObjectGlobal extends PyObjectBase {
    value;
    attr;
    storage;
    constructor(value, storage) {
        super();
        this.value = value;
        this.attr = {};
        for (let i = 0, keyList = Object.keys(this.value.attr); i < keyList.length; i++) {
            if (typeof this.value.$ === "string") {
                if (this.value.attr[keyList[i]] instanceof PyObjectBase) {
                    this.attr[keyList[i]] = this.value.attr[keyList[i]];
                }
                else {
                    this.attr[keyList[i]] = new PyObjectGlobal(this.value.attr[keyList[i]]);
                }
            }
        }
        this.type = PyObjectType.Global;
        if (storage == undefined) {
            this.storage = undefined;
        }
        else {
            this.storage = storage;
        }
    }
    py_binary_subscr(PyObject0) {
        if (this.value.py_binary_subscr === undefined) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_binary_subscr)));
        }
        else if (this.value.py_binary_subscr.argNum[0] !== -1) {
            let flag = false;
            for (let i = 0; i < this.value.py_binary_subscr.argNum.length; i++) {
                if (this.value.py_binary_subscr.argNum[i] === 1) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_binary_subscr)));
            }
            else {
                this.value.py_binary_subscr.method(1);
            }
        }
        else {
            this.value.py_binary_subscr.method(1);
        }
    }
    py_function_call(argNum) {
        if (this.value.py_function_call === undefined) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_function_call)));
        }
        else if (this.value.py_function_call.argNum[0] !== -1) {
            let flag = false;
            for (let i = 0; i < this.value.py_function_call.argNum.length; i++) {
                if (this.value.py_function_call.argNum[i] === argNum) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_function_call)));
            }
            else {
                this.value.py_function_call.method(argNum);
            }
        }
        else {
            this.value.py_function_call.method(argNum);
        }
    }
    py_method_call(argNum) {
        this.py_function_call(argNum);
    }
    py_method_load(argName) {
        for (let i = 0, keyList = Object.keys(this.attr); i < keyList.length; i++) {
            if (argName === keyList[i]) {
                PythonRuntime.storage.varStack.push(this.attr[argName]);
                return;
            }
        }
        PythonRuntime.storage.pyError.write(new PyObjectAttributeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_method_load)));
    }
    py_Iterator_get() {
        if (this.value.py_Iterator_get === undefined) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_Iterator_get)));
        }
        else {
            this.value.py_Iterator_get.method(0);
        }
    }
    py_Iterator_next() {
        if (this.value.py_Iterator_next === undefined) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_Iterator_next)));
        }
        else {
            this.value.py_Iterator_next.method(0);
        }
    }
    py_repr() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString(StringFormat('<built-in function {}>', [this.value.toString()])));
    }
    py_attr_get(value) {
        for (let i = 0, keyList = Object.keys(this.attr); i < keyList.length; i++) {
            if (value === keyList[i]) {
                PythonRuntime.storage.varStack.push(this.attr[value]);
                return;
            }
        }
        PythonRuntime.storage.pyError.write(new PyObjectAttributeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_attr_get)));
    }
    py_attr_set(value) {
        if (this.value.py_attr_set === undefined) {
            for (let i = 0, keyList = Object.keys(this.attr); i < keyList.length; i++) {
                if (value === keyList[i]) {
                    this.attr[value] = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    return;
                }
            }
            PythonRuntime.storage.pyError.write(new PyObjectAttributeError(new PyErrorInformation('python', 'global', PyObjectMethods.py_attr_get)));
        }
        else {
            this.value.py_attr_set(this.attr, value);
        }
    }
}
class PyObjectTuple extends PyObjectBase {
    value;
    constructor(value) {
        super();
        this.value = [];
        this.type = PyObjectType.Tuple;
        for (let i = 0; i < value; i++) {
            this.value.unshift(RequireNotEmpty(PythonRuntime.storage.varStack.pop()));
        }
    }
    py_binary_subscr(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (PyObject0.value < this.value.length) {
                PythonRuntime.storage.varStack.push(this.value[PyObject0.value]);
            }
            else {
                PythonRuntime.storage.pyError.write(new PyObjectIndexError(new PyErrorInformation('python', 'tuple', PyObjectMethods.py_binary_subscr)));
            }
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'tuple', PyObjectMethods.py_binary_subscr)));
        }
    }
    py_store_subscr(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (PyObject0.value < this.value.length) {
                this.value[PyObject0.value] = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
            }
            else {
                PythonRuntime.storage.pyError.write(new PyObjectIndexError(new PyErrorInformation('python', 'tuple', PyObjectMethods.py_binary_subscr)));
            }
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'tuple', PyObjectMethods.py_binary_subscr)));
        }
    }
    py_Iterator_get() {
        let index = -1;
        PythonRuntime.storage.varStack.push(new PyObjectGlobal({
            'name': 'python:tuple@instance.$iterator_get',
            'attr': {},
            'py_Iterator_next': {
                'argNum': [0],
                'method': () => {
                    index += 1;
                    if (index >= this.value.length) {
                        PythonRuntime.storage.pyError.write(new PyObjectStopIteration(new PyErrorInformation('python', 'tuple@instance.$iterator_get', PyObjectMethods.py_Iterator_next)));
                    }
                    else {
                        PythonRuntime.storage.varStack.push(this.value[index]);
                    }
                }
            },
            "$": ""
        }));
    }
}
class PyObjectList extends PyObjectBase {
    value;
    constructor(value) {
        super();
        this.value = [];
        this.type = PyObjectType.List;
        for (let i = 0; i < value; i++) {
            this.value.unshift(RequireNotEmpty(PythonRuntime.storage.varStack.pop()));
        }
    }
    py_binary_multiply(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            let newList = new PyObjectList(0);
            for (let i = 0; i < PyObject0.value; i++) {
                for (let j = 0; j < this.value.length; j++) {
                    newList.value.push(this.value[j]);
                }
            }
            PythonRuntime.storage.varStack.push(newList);
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'list', PyObjectMethods.py_binary_subscr)));
        }
    }
    py_binary_subscr(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (PyObject0.value >= 0 && PyObject0.value < this.value.length) {
                PythonRuntime.storage.varStack.push(this.value[PyObject0.value]);
            }
            else {
                PythonRuntime.storage.pyError.write(new PyObjectIndexError(new PyErrorInformation('python', 'list', PyObjectMethods.py_binary_subscr)));
            }
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'list', PyObjectMethods.py_binary_subscr)));
        }
    }
    py_store_subscr(PyObject0) {
        if (PyObject0.type === PyObjectType.Int) {
            if (PyObject0.value >= 0 && PyObject0.value < this.value.length) {
                this.value[PyObject0.value] = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
            }
            else {
                PythonRuntime.storage.pyError.write(new PyObjectIndexError(new PyErrorInformation('python', 'list', PyObjectMethods.py_binary_subscr)));
            }
        }
        else {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'list', PyObjectMethods.py_binary_subscr)));
        }
    }
    py_Iterator_get() {
        let index = -1;
        PythonRuntime.storage.varStack.push(new PyObjectGlobal({
            'name': 'python:list@instance.$iterator_get',
            'attr': {},
            'py_Iterator_next': {
                'argNum': [0],
                'method': () => {
                    index += 1;
                    if (index >= this.value.length) {
                        PythonRuntime.storage.pyError.write(new PyObjectStopIteration(new PyErrorInformation('python', 'list@instance.$iterator_get', PyObjectMethods.py_Iterator_next)));
                    }
                    else {
                        PythonRuntime.storage.varStack.push(this.value[index]);
                    }
                }
            },
            "$": ""
        }));
    }
    py_compare_equal(PyObject0) {
        if (PyObject0.type != PyObjectType.List) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
            return;
        }
        if (this.value.length != PyObject0.value.length) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
            return;
        }
        for (let i = 0; i < this.value.length; i++) {
            this.value[i].py_compare_equal(PyObject0.value[i]);
            let res = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
            if (res.type != PyObjectType.Bool) {
                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'list', PyObjectMethods.py_compare_equal)));
            }
            if (!res.value) {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
                return;
            }
        }
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
    }
    py_compare_not_equal(PyObject0) {
        if (PyObject0.type != PyObjectType.List) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
            return;
        }
        if (this.value.length != PyObject0.value.length) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
            return;
        }
        for (let i = 0; i < this.value.length; i++) {
            this.value[i].py_compare_not_equal(PyObject0.value[i]);
            let res = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
            if (res.type != PyObjectType.Bool) {
                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'list', PyObjectMethods.py_compare_equal)));
            }
            if (res.value) {
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(true));
                return;
            }
        }
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
    }
    py_attr_get(argName) {
        switch (argName) {
            case 'append': {
                PythonRuntime.storage.varStack.push(new PyObjectGlobal({
                    'name': 'python:list@instance.append',
                    'attr': {},
                    'py_function_call': {
                        'argNum': [1],
                        'method': () => {
                            this.value.push(RequireNotEmpty(PythonRuntime.storage.varStack.pop()));
                            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                        }
                    },
                    "$": ""
                }));
                break;
            }
            case 'pop': {
                PythonRuntime.storage.varStack.push(new PyObjectGlobal({
                    'name': 'python:list@instance.pop',
                    'attr': {},
                    'py_function_call': {
                        'argNum': [1],
                        'method': () => {
                            let index = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                            if (index.type != PyObjectType.Int) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("python", "list@instance.pop", PyObjectMethods.py_function_call)));
                            }
                            if (index.value % 1 !== 0) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("python", "list@instance.pop", PyObjectMethods.py_function_call)));
                            }
                            if (index.value < -this.value.length || index.value >= this.value.length) {
                                PythonRuntime.storage.pyError.write(new PyObjectIndexError(new PyErrorInformation("python", "list@instance.pop", PyObjectMethods.py_function_call)));
                            }
                            PythonRuntime.storage.varStack.push(RequireNotEmpty(this.value.splice(index.value & this.value.length, 1)[0]));
                        }
                    },
                    "$": ""
                }));
                break;
            }
            default: {
                PythonRuntime.storage.pyError.write(new PyObjectAttributeError(new PyErrorInformation('python', 'list', PyObjectMethods.py_attr_get)));
            }
        }
    }
}
class PyObjectCode extends PyObjectBase {
    commandEnv;
    constructor(value) {
        super();
        this.commandEnv = value;
        this.type = PyObjectType.Code;
    }
}
class PyObjectFunction extends PyObjectBase {
    name;
    commandCode;
    cellVarTuple;
    defaultArgs;
    constructor(name, commandCode, cellVarTuple, defaultArgs) {
        super();
        this.type = PyObjectType.FunctionObject;
        this.name = name;
        this.commandCode = commandCode;
        this.cellVarTuple = cellVarTuple;
        this.defaultArgs = defaultArgs;
    }
    py_function_call(argNum) {
        if (argNum > PythonConfiguration.codeObjectList[this.commandCode.commandEnv].argNum) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'Function', PyObjectMethods.py_function_call)));
        }
        else if (argNum + this.defaultArgs.length < PythonConfiguration.codeObjectList[this.commandCode.commandEnv].argNum) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'Function', PyObjectMethods.py_function_call)));
        }
        PythonRuntime.storage.newStack(this.commandCode.commandEnv);
        for (let i = 0; i < argNum; i++) {
            PythonRuntime.storage.varList[PythonRuntime.storage.stackPointer - 1][argNum - i - 1] = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
        }
        for (let i = argNum; i < this.defaultArgs.length; i++) {
            PythonRuntime.storage.varList[PythonRuntime.storage.stackPointer - 1][argNum] = this.defaultArgs[this.defaultArgs.length - argNum - 1];
        }
        PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 1] = this.cellVarTuple;
        PythonRuntime.storage.varStack.push(new PyBlockFunctionCall());
        PythonRuntime.runCodeObject(0, this.commandCode.commandEnv, 0);
        PythonRuntime.storage.popStack();
    }
}
class PyObjectClass extends PyObjectBase {
    bases;
    name;
    constructorFunction;
    constructor(bases, name, constructorFunction) {
        super();
        this.bases = bases;
        this.name = name;
        this.constructorFunction = constructorFunction;
        this.type = PyObjectType.Class;
    }
    py_function_call(argNum) {
        if (0 !== PythonConfiguration.codeObjectList[this.constructorFunction.commandCode.commandEnv].argNum) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'Function', PyObjectMethods.py_function_call)));
        }
        PythonRuntime.storage.newStack(this.constructorFunction.commandCode.commandEnv);
        PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 1] = this.constructorFunction.cellVarTuple;
        PythonRuntime.storage.varStack.push(new PyBlockFunctionCall());
        let nameFieldIndex = PythonConfiguration.codeObjectList[this.constructorFunction.commandCode.commandEnv].globalList.indexOf("__name__");
        if (nameFieldIndex !== -1) {
            PythonRuntime.storage.globalVarList[PythonRuntime.storage.stackPointer - 1][nameFieldIndex] = this.name;
        }
        PythonRuntime.runCodeObject(0, this.constructorFunction.commandCode.commandEnv, 0);
        let member = new Map();
        for (let i = 0; i < PythonConfiguration.codeObjectList[this.constructorFunction.commandCode.commandEnv].globalList.length; i++) {
            member.set(PythonConfiguration.codeObjectList[this.constructorFunction.commandCode.commandEnv].globalList[i], PythonRuntime.storage.globalVarList[PythonRuntime.storage.stackPointer - 1][i]);
        }
        let classObject = new PyObjectClassObject(this, member);
        PythonRuntime.storage.popStack();
        if (RequireNotEmpty(PythonRuntime.storage.varStack.pop()).type != PyObjectType.None) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'Function', PyObjectMethods.py_function_call)));
        }
        let initMethod = classObject.member.get("__init__");
        if (initMethod === null || initMethod === undefined) {
            PythonRuntime.storage.varStack.push(classObject);
        }
        else {
            PythonRuntime.storage.varStack.splice(PythonRuntime.storage.varStack.length - argNum, 0, classObject);
            initMethod.py_function_call(argNum + 1);
            if (RequireNotEmpty(PythonRuntime.storage.varStack.pop()).type != PyObjectType.None) {
                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'Function', PyObjectMethods.py_function_call)));
            }
            PythonRuntime.storage.varStack.push(classObject);
        }
    }
}
class PyObjectClassObject extends PyObjectBase {
    proto;
    member;
    constructor(proto, member) {
        super();
        this.type = PyObjectType.ClassObject;
        this.member = member;
        this.proto = proto;
    }
    py_compare_equal(PyObject0) {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(this === PyObject0));
    }
    py_compare_not_equal(PyObject0) {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(this !== PyObject0));
    }
    py_attr_get(value) {
        let PyObject0 = this.member.get(value);
        if (PyObject0 === null || PyObject0 === undefined) {
            PythonRuntime.storage.pyError.write(new PyObjectAttributeError(new PyErrorInformation('python', 'classObject', PyObjectMethods.py_attr_get)));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObject0);
        }
    }
    py_attr_set(value) {
        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
        this.member.set(value, PyObject0);
    }
}
class PyBlockLoop extends PyObjectBase {
    breakCommandIndex;
    constructor(breakCommandIndex) {
        super();
        this.type = PyObjectType.Loop;
        this.breakCommandIndex = breakCommandIndex;
    }
}
class PyBlockExcept extends PyObjectBase {
    exceptBlockOpIndex;
    constructor(value) {
        super();
        this.exceptBlockOpIndex = value;
        this.type = PyObjectType.Except;
    }
}
class PyBlockExceptCaught extends PyObjectBase {
    constructor() {
        super();
        this.type = PyObjectType.ExceptCaught;
    }
}
class PyBlockFunctionCall extends PyObjectBase {
    constructor() {
        super();
        this.type = PyObjectType.FunctionCall;
    }
}
class PyObjectErrorBase extends PyObjectBase {
    value;
    constructor() {
        super();
        this.value = new PyErrorInformation("python", "errorbase", PyObjectMethods.py_internal);
    }
}
class PyObjectTypeError extends PyObjectErrorBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.TypeError;
    }
    py_repr() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString('<class \'TypeError\'>'));
    }
}
class PyObjectStopIteration extends PyObjectErrorBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.StopIterationError;
    }
}
class PyObjectValueError extends PyObjectErrorBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.ValueError;
    }
}
class PyObjectIndexError extends PyObjectErrorBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.IndexError;
    }
}
class PyObjectNameError extends PyObjectErrorBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.NameError;
    }
}
class PyObjectAttributeError extends PyObjectErrorBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.AttributeError;
    }
}
class PyObjectZeroDivisionError extends PyObjectErrorBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.ZeroDivisionError;
    }
}
var PyObjectFactory = {
    "constructPyObjectInt": (function () {
        let cache = [];
        for (let i = -128; i < 128; i++) {
            cache.push(new PyObjectInt(i));
        }
        return (value) => {
            if (value >= -128 && value < 128 && value % 1 === 0) {
                return cache[value + 128];
            }
            else {
                return new PyObjectInt(value);
            }
        };
    })(),
    "constructPyObjectString": (function () {
        return (value) => new PyObjectString(value);
    })(),
    "constructPyObjectCode": (function () {
        let cache = new Map();
        return (commandEnv) => {
            if (!cache.has(commandEnv)) {
                cache.set(commandEnv, new PyObjectCode(commandEnv));
            }
            return RequireNotEmpty(cache.get(commandEnv));
        };
    })(),
    "constructPyObjectBool": (function () {
        let trueCache = new PyObjectBool(true);
        let falseCache = new PyObjectBool(false);
        return (value) => {
            if (value) {
                return trueCache;
            }
            else {
                return falseCache;
            }
        };
    })(),
    "constructPyObjectNone": (function () {
        let cache = new PyObjectNone();
        return () => cache;
    })(),
    "constructPyObjectGlobal": (function () {
        let cache = new Map();
        return (path) => {
            if (cache.has(path)) {
                return cache.get(path);
            }
            if (!(path in PythonBuiltin)) {
                return null;
            }
            let value;
            if (PythonBuiltin[path] instanceof PyObjectBase) {
                value = PythonBuiltin[path];
            }
            else {
                value = new PyObjectGlobal(PythonBuiltin[path]);
            }
            cache.set(path, value);
            return value;
        };
    })()
};
PythonBuiltin = {
    'str': {
        'name': 'python:str',
        'attr': {},
        'py_function_call': {
            'argNum': [1],
            'method': function () {
                let PyObject0 = PythonRuntime.storage.varStack.pop();
                RequireNotEmpty(PyObject0).py_str();
            }
        },
        "$": ""
    },
    'bool': {
        'name': 'python:bool',
        'attr': {},
        'py_function_call': {
            'argNum': [1],
            'method': function () {
                let PyObject0 = PythonRuntime.storage.varStack.pop();
                RequireNotEmpty(PyObject0).py_bool();
            }
        },
        "$": ""
    },
    'int': {
        'name': 'python:int',
        'attr': {},
        'py_function_call': {
            'argNum': [1],
            'method': function () {
                let PyObject0 = PythonRuntime.storage.varStack.pop();
                RequireNotEmpty(PyObject0).py_int();
            }
        },
        "$": ""
    },
    "abs": {
        "name": "python:abs",
        "attr": {},
        "py_function_call": {
            "argNum": [1],
            "method": function () {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (PyObject0.type !== PyObjectType.Int) {
                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'abs', PyObjectMethods.py_function_call)));
                }
                else {
                    if (PyObject0.value > 0) {
                        PythonRuntime.storage.varStack.push(PyObject0);
                    }
                    else {
                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(-PyObject0.value));
                    }
                }
            }
        },
        "$": ""
    },
    'print': {
        'name': 'python:print',
        'attr': {},
        'py_function_call': {
            'argNum': [-1],
            'method': function (argNum) {
                let result = '';
                for (let i = 0; i < argNum; i++) {
                    RequireNotEmpty(PythonRuntime.storage.varStack[PythonRuntime.storage.varStack.length - argNum + i]).py_str();
                    result = result + PythonRuntime.storage.varStack.pop().value + ' ';
                }
                for (let i = 0; i < argNum; i++) {
                    PythonRuntime.storage.varStack.pop();
                }
                AppWorker.getInstance().postMessage({
                    "messageType": MessageType.W2M.Console.Stdout,
                    "messageBody": result.slice(0, result.length - 1) + '\n'
                });
                AppWorker.getInstance().postMessage({
                    "messageType": MessageType.W2M.Console.Flush,
                    "messageBody": null
                });
                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
            }
        },
        "$": "",
    },
    'range': {
        'name': 'python:range',
        'attr': {},
        'py_function_call': {
            'argNum': [1, 2, 3],
            'method': function (argNum) {
                let start, end, step;
                if (argNum === 1) {
                    start = 0;
                    let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (buffer.type !== PyObjectType.Int) {
                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'range', PyObjectMethods.py_function_call)));
                        return;
                    }
                    end = buffer.value;
                    step = 1;
                }
                else if (argNum === 2) {
                    let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (buffer.type !== PyObjectType.Int) {
                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'range', PyObjectMethods.py_function_call)));
                        return;
                    }
                    end = buffer.value;
                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (buffer.type !== PyObjectType.Int) {
                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'range', PyObjectMethods.py_function_call)));
                        return;
                    }
                    start = buffer.value;
                    step = 1;
                }
                else if (argNum === 3) {
                    let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (buffer.type !== PyObjectType.Int) {
                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'range', PyObjectMethods.py_function_call)));
                        return;
                    }
                    step = buffer.value;
                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (buffer.type !== PyObjectType.Int) {
                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'range', PyObjectMethods.py_function_call)));
                        return;
                    }
                    end = buffer.value;
                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (buffer.type !== PyObjectType.Int) {
                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'range', PyObjectMethods.py_function_call)));
                        return;
                    }
                    start = buffer.value;
                    if (start === 0) {
                        PythonRuntime.storage.pyError.write(new PyObjectValueError(new PyErrorInformation('python', 'range', PyObjectMethods.py_function_call)));
                        return;
                    }
                }
                else {
                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'range', PyObjectMethods.py_function_call)));
                    return;
                }
                PythonRuntime.storage.varStack.push(new PyObjectGlobal({
                    'name': 'python:range@instance',
                    'attr': {},
                    'py_Iterator_get': {
                        'argNum': [0],
                        'method': function () {
                            PythonRuntime.storage.varStack.push(new PyObjectGlobal({
                                'name': 'python:range@instance.range_iterator@instance',
                                'attr': {},
                                'py_Iterator_next': {
                                    'argNum': [0],
                                    'method': function () {
                                        if (step > 0) {
                                            if (start >= end) {
                                                PythonRuntime.storage.pyError.write(new PyObjectStopIteration(new PyErrorInformation("python", "range@instance.range_iterator@instance", PyObjectMethods.py_Iterator_next)));
                                            }
                                        }
                                        else {
                                            if (start <= end) {
                                                PythonRuntime.storage.pyError.write(new PyObjectStopIteration(new PyErrorInformation("python", "range@instance.range_iterator@instance", PyObjectMethods.py_Iterator_next)));
                                            }
                                        }
                                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(start));
                                        start += step;
                                    }
                                },
                                "$": ""
                            }));
                        }
                    },
                    "$": ""
                }));
            }
        },
        "$": ""
    },
    'len': {
        'name': 'python:len',
        'attr': {},
        'py_function_call': {
            'argNum': [1],
            'method': function () {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (PyObject0.type !== PyObjectType.List) {
                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'len', PyObjectMethods.py_function_call)));
                }
                else {
                    let PyObject1 = PyObjectFactory.constructPyObjectInt(PyObject0.value.length);
                    PythonRuntime.storage.varStack.push(PyObject1);
                }
            }
        },
        "$": ""
    },
    'object': {
        'name': 'python:object',
        'attr': {},
        'py_function_call': {
            'argNum': [0],
            'method': function () {
                PythonRuntime.storage.varStack.push(new PyObjectBase());
            }
        },
        "$": ""
    },
    'builtins:__build_class__': {
        'name': 'builtins:__build_class__',
        'attr': {},
        'py_function_call': {
            'argNum': [3],
            'method': function () {
                let PyObject0;
                let classBase = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let classname;
                PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (PyObject0.type === PyObjectType.String) {
                    classname = PyObject0;
                }
                else {
                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'builtins:__build_class__', PyObjectMethods.py_function_call)));
                    return;
                }
                let classConsturctor;
                PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (PyObject0.type === PyObjectType.FunctionObject) {
                    classConsturctor = PyObject0;
                }
                else {
                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'builtins:__build_class__', PyObjectMethods.py_function_call)));
                    return;
                }
                let PyObject4 = new PyObjectClass(classBase, classname, classConsturctor);
                PythonRuntime.storage.varStack.push(PyObject4);
            }
        },
        "$": ""
    }
};
var PythonPacakgeHelper = (() => {
    let loadedPackages = new Map();
    let loadPackage = function (packageID) {
        let value = loadedPackages.get(packageID);
        if (value instanceof Promise) {
            return value;
        }
        else if (value !== undefined) {
            return new Promise((resolve, _reject) => resolve(undefined));
        }
        let promise = (async () => await fetch(StringFormat("packages/{}.js", [packageID])))()
            .then(response => response.blob())
            .then(blob => {
            let url = URL.createObjectURL(blob);
            try {
                GlobalThis.importScripts(url);
            }
            catch (e) {
                try {
                    URL.revokeObjectURL(url);
                }
                catch (ignored) {
                }
                throw e;
            }
            if (loadedPackages.get(packageID) instanceof Promise) {
                throw new BytecodeRunnerFatalErrorSignal("PythonPackageHelper.loadPackage", StringFormat("Package {} is loaded but it defines nothing.", [packageID]));
            }
        });
        loadedPackages.set(packageID, promise);
        return promise;
    };
    return {
        "definePackage": function (pkg) {
            if (!loadedPackages.has(pkg.id)) {
                throw new BytecodeRunnerFatalErrorSignal("PythonPackageHelper.loadPackage", StringFormat("Package {} is defined before it's loaded.", [pkg.id]));
            }
            loadedPackages.set(pkg.id, pkg);
            this.loadPackages(pkg.dependencies);
        },
        "loadPackages": function (packages) {
            for (let i = 0; i < packages.length; i++) {
                loadPackage(packages[i]);
            }
        },
        "park": async function () {
            loop: while (true) {
                let iterator = loadedPackages.values();
                let item;
                while (true) {
                    item = iterator.next();
                    if (item.done) {
                        break loop;
                    }
                    if (item.value instanceof Promise) {
                        await item.value;
                        break;
                    }
                }
            }
            let iterator = loadedPackages.values();
            while (true) {
                let item = iterator.next();
                if (item.done) {
                    break;
                }
                if (item.value instanceof Promise) {
                    throw new BytecodeRunnerFatalErrorSignal("PythonPackageHelper.loadPackage", "Some packages were defined but not loaded.");
                }
                Object.assign(PythonBuiltin, item.value.onRegisterGlobalPyObject());
            }
        }
    };
})();
class AbstractBytecodeRunnerResult {
}
class BytecodeRunnerNextResult extends AbstractBytecodeRunnerResult {
}
var BytecodeRunnerNextResultInstance = new BytecodeRunnerNextResult();
class BytecodeRunnerJumpResult extends AbstractBytecodeRunnerResult {
    commandIndex;
    constructor(commandIndex) {
        super();
        this.commandIndex = commandIndex;
    }
}
class BytecodeRunnerReturnResult extends AbstractBytecodeRunnerResult {
    returnValue;
    constructor(returnValue) {
        super();
        this.returnValue = returnValue;
    }
}
class BytecodeRunnerExtendArgResult extends AbstractBytecodeRunnerResult {
    extendedArg;
    constructor(extendedArg) {
        super();
        this.extendedArg = extendedArg;
    }
}
class AbstractBytecodeRunnerSignal {
}
class BytecodeRunnerExitSignal extends AbstractBytecodeRunnerSignal {
    exitCode;
    constructor(exitCode) {
        super();
        this.exitCode = exitCode;
    }
}
class BytecodeRunnerFatalErrorSignal extends AbstractBytecodeRunnerSignal {
    place;
    msg;
    constructor(place, msg) {
        super();
        this.place = place;
        this.msg = msg;
    }
}
class BytecodeRunnerPyErrorSignal extends AbstractBytecodeRunnerSignal {
}
var BytecodeRunnerPyErrorSignalInstance = new BytecodeRunnerPyErrorSignal();
PythonRuntime = {
    'storage': {
        'varStack': [],
        'varList': [],
        'globalVarList': [],
        'cellVarList': [],
        'pyError': {
            'write': function (PyObject0) {
                PythonRuntime.storage.pyError.value = PyObject0;
                if (PyObject0.type != PyObjectType.StopIterationError) {
                    debugger;
                }
                throw BytecodeRunnerPyErrorSignalInstance;
            },
            'value': undefined
        },
        'MAX_STACK_TIME': 20,
        'stackPointer': 0,
        'newStack': function (commandEnv) {
            if (PythonRuntime.storage.stackPointer >= PythonRuntime.storage.MAX_STACK_TIME) {
                throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Storage.newStack", "Maximum recursion depth exceeded.");
            }
            let newVarList = [];
            for (let i = 0; i < PythonConfiguration.codeObjectList[commandEnv].varList.length; i++) {
                newVarList.push(null);
            }
            PythonRuntime.storage.varList.push(newVarList);
            let newCellVarList = [];
            for (let i = 0; i < PythonConfiguration.codeObjectList[commandEnv].cellVarList.length; i++) {
                newCellVarList.push(new PyObjectStoragePointer(null));
            }
            PythonRuntime.storage.cellVarList.push(newCellVarList);
            let newGlobalVarList = [];
            for (let i = 0; i < PythonConfiguration.codeObjectList[commandEnv].globalList.length; i++) {
                newGlobalVarList.push(null);
            }
            PythonRuntime.storage.globalVarList.push(newGlobalVarList);
            PythonRuntime.storage.stackPointer += 1;
        },
        'popStack': function () {
            PythonRuntime.storage.stackPointer -= 1;
            PythonRuntime.storage.varList.pop();
            PythonRuntime.storage.cellVarList.pop();
            PythonRuntime.storage.globalVarList.pop();
        }
    },
    'runBytecode': function (commandIndex, commandEnv, commandName, commandArg) {
        switch (commandName) {
            case 1: {
                PythonRuntime.storage.varStack.pop();
                return BytecodeRunnerNextResultInstance;
            }
            case 2: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PythonRuntime.storage.varStack.push(PyObject0);
                PythonRuntime.storage.varStack.push(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 3: {
                let first = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let second = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let third = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PythonRuntime.storage.varStack.push(first);
                PythonRuntime.storage.varStack.push(third);
                PythonRuntime.storage.varStack.push(second);
                return BytecodeRunnerNextResultInstance;
            }
            case 4: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack[PythonRuntime.storage.varStack.length - 1]);
                PythonRuntime.storage.varStack.push(PyObject0);
                return BytecodeRunnerNextResultInstance;
            }
            case 11: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_multiply(PyObjectFactory.constructPyObjectInt(-1));
                return BytecodeRunnerNextResultInstance;
            }
            case 19: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_power(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 20: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_multiply(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 22: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_modulo(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 55:
            case 23: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_add(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 56:
            case 24: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_subtract(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 57:
            case 25: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_subscr(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 28:
            case 26: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_floor_divide(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 29:
            case 27: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_true_divide(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 60: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_store_subscr(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
            case 68: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_Iterator_get();
                return BytecodeRunnerNextResultInstance;
            }
            case 71: {
                let PyObject0 = RequireNotEmpty(PyObjectFactory.constructPyObjectGlobal("builtins:__build_class__"));
                PythonRuntime.storage.varStack.push(PyObject0);
                return BytecodeRunnerNextResultInstance;
            }
            case 80: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (PyObject0.type === PyObjectType.Loop) {
                    return new BytecodeRunnerJumpResult(PyObject0.breakCommandIndex);
                }
                else {
                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.PopBlock", "Cannot return outside a loop.");
                }
            }
            case 83: {
                if (PythonRuntime.storage.stackPointer === 1) {
                    return new BytecodeRunnerReturnResult(RequireNotEmpty(PythonRuntime.storage.varStack.pop()));
                }
                else {
                    let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    let PyObject1 = undefined;
                    while (true) {
                        PyObject1 = PythonRuntime.storage.varStack.pop();
                        if (PyObject1 === undefined || PyObject1 === null) {
                            throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.ReturnValue", "Cannot find any PyBlockFunctionCall.");
                        }
                        if (PyObject1.type === PyObjectType.FunctionCall) {
                            return new BytecodeRunnerReturnResult(PyObject0);
                        }
                    }
                }
            }
            case 87: {
                while (true) {
                    if (PythonRuntime.storage.varStack.length === 0) {
                        throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.PopBlock", "Cannot find any PyBlock.");
                    }
                    let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (PyObject0.type === PyObjectType.Except || PyObject0.type === PyObjectType.ExceptCaught ||
                        PyObject0.type === PyObjectType.FunctionCall || PyObject0.type == PyObjectType.Loop) {
                        break;
                    }
                }
                return BytecodeRunnerNextResultInstance;
            }
            case 89: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (PyObject0.type != PyObjectType.ExceptCaught) {
                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.ReturnValue", "Cannot find any PyObjectExceptCaught.");
                }
                return BytecodeRunnerNextResultInstance;
            }
            case 90: {
                PythonRuntime.storage.globalVarList[PythonRuntime.storage.stackPointer - 1][commandArg] = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                return BytecodeRunnerNextResultInstance;
            }
            case 92: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_Iterator_get();
                PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let intergerTime = 0;
                while (true) {
                    try {
                        PyObject0.py_Iterator_next();
                    }
                    catch (error) {
                        if (!(error instanceof BytecodeRunnerPyErrorSignal)) {
                            throw error;
                        }
                    }
                    if (PythonRuntime.storage.pyError.value === undefined) {
                        intergerTime += 1;
                    }
                    else {
                        if (PythonRuntime.storage.pyError.value instanceof PyObjectStopIteration) {
                            PythonRuntime.storage.pyError.value = undefined;
                        }
                        break;
                    }
                }
                let local_UNPACK_SEQUENCE_intergerArray = Array(intergerTime);
                for (let i = 0; i < intergerTime; i++) {
                    local_UNPACK_SEQUENCE_intergerArray[i] = PythonRuntime.storage.varStack.pop();
                }
                for (let i = 0; i < intergerTime; i++) {
                    PythonRuntime.storage.varStack.push(local_UNPACK_SEQUENCE_intergerArray.shift());
                }
                return BytecodeRunnerNextResultInstance;
            }
            case 93: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack[PythonRuntime.storage.varStack.length - 1]);
                try {
                    PyObject0.py_Iterator_next();
                }
                catch (error) {
                    if (!(error instanceof BytecodeRunnerPyErrorSignal)) {
                        throw error;
                    }
                }
                if (PythonRuntime.storage.pyError.value === undefined) {
                    return BytecodeRunnerNextResultInstance;
                }
                else if (PythonRuntime.storage.pyError.value.type === PyObjectType.StopIterationError) {
                    PythonRuntime.storage.pyError.value = undefined;
                    return new BytecodeRunnerJumpResult(commandIndex + commandArg + 2);
                }
                return BytecodeRunnerNextResultInstance;
            }
            case 95: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_attr_set(PythonConfiguration.codeObjectList[commandEnv].globalList[commandArg]);
                return BytecodeRunnerNextResultInstance;
            }
            case 100: {
                PythonRuntime.storage.varStack.push(PythonConfiguration.codeObjectList[commandEnv].constList[commandArg]);
                return BytecodeRunnerNextResultInstance;
            }
            case 101: {
                let PyObject0 = PythonRuntime.storage.globalVarList[PythonRuntime.storage.stackPointer - 1][commandArg];
                if (PyObject0 === undefined || PyObject0 === null) {
                    let globalObjectName = PythonConfiguration.codeObjectList[commandEnv].globalList[commandArg];
                    let value = PyObjectFactory.constructPyObjectGlobal(globalObjectName);
                    if (value == null) {
                        PythonRuntime.storage.pyError.write(new PyObjectNameError(new PyErrorInformation('python', '$pvm$.ByteCodeInterpreter.LOAD_NAME', PyObjectMethods.py_internal)));
                    }
                    else {
                        PythonRuntime.storage.varStack.push(value);
                    }
                    return BytecodeRunnerNextResultInstance;
                }
                else {
                    PythonRuntime.storage.varStack.push(PyObject0);
                }
                return BytecodeRunnerNextResultInstance;
            }
            case 102: {
                let PyObject0 = new PyObjectTuple(commandArg);
                PythonRuntime.storage.varStack.push(PyObject0);
                return BytecodeRunnerNextResultInstance;
            }
            case 103: {
                let PyObject0 = new PyObjectList(commandArg);
                PythonRuntime.storage.varStack.push(PyObject0);
                return BytecodeRunnerNextResultInstance;
            }
            case 106: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_attr_get(PythonConfiguration.codeObjectList[commandEnv].globalList[commandArg]);
                return BytecodeRunnerNextResultInstance;
            }
            case 107: {
                switch (commandArg) {
                    case 0: {
                        let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        PyObject0.py_compare_small(PyObject1);
                        return BytecodeRunnerNextResultInstance;
                    }
                    case 1: {
                        let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        PyObject0.py_compare_small_equal(PyObject1);
                        return BytecodeRunnerNextResultInstance;
                    }
                    case 2: {
                        let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        PyObject0.py_compare_equal(PyObject1);
                        return BytecodeRunnerNextResultInstance;
                    }
                    case 3: {
                        let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        PyObject0.py_compare_not_equal(PyObject1);
                        return BytecodeRunnerNextResultInstance;
                    }
                    case 4: {
                        let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        PyObject0.py_compare_big(PyObject1);
                        return BytecodeRunnerNextResultInstance;
                    }
                    case 5: {
                        let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        PyObject0.py_compare_big_equal(PyObject1);
                        return BytecodeRunnerNextResultInstance;
                    }
                    case 10: {
                        throw 'TODO';
                        return BytecodeRunnerNextResultInstance;
                    }
                    default: {
                        throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.CompareOP", "Unknown CompareOP type.");
                    }
                }
            }
            case 108: {
                RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let globalObjectName = PythonConfiguration.codeObjectList[commandEnv].globalList[commandArg];
                let value = PyObjectFactory.constructPyObjectGlobal(globalObjectName);
                if (value == null) {
                    PythonRuntime.storage.pyError.write(new PyObjectNameError(new PyErrorInformation('python', '$pvm$.ByteCodeInterpreter.IMPORT_NAME', PyObjectMethods.py_internal)));
                }
                else {
                    PythonRuntime.storage.varStack.push(value);
                }
                return BytecodeRunnerNextResultInstance;
            }
            case 110: {
                return new BytecodeRunnerJumpResult(commandIndex + commandArg + 2);
            }
            case 113: {
                return new BytecodeRunnerJumpResult(commandArg);
            }
            case 114: {
                RequireNotEmpty(PythonRuntime.storage.varStack.pop()).py_bool();
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (!PyObject0.value) {
                    return new BytecodeRunnerJumpResult(commandArg);
                }
                else {
                    return BytecodeRunnerNextResultInstance;
                }
            }
            case 115: {
                RequireNotEmpty(PythonRuntime.storage.varStack.pop()).py_bool();
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (PyObject0.value) {
                    return new BytecodeRunnerJumpResult(commandArg);
                }
                else {
                    return BytecodeRunnerNextResultInstance;
                }
            }
            case 116: {
                let globalObjectName = PythonConfiguration.codeObjectList[commandEnv].globalList[commandArg];
                let globalVariableIndex = PythonConfiguration.codeObjectList[0].globalList.indexOf(globalObjectName);
                if (globalVariableIndex !== -1) {
                    if (PythonRuntime.storage.globalVarList[0][globalVariableIndex] != null) {
                        PythonRuntime.storage.varStack.push(PythonRuntime.storage.globalVarList[0][globalVariableIndex]);
                        return BytecodeRunnerNextResultInstance;
                    }
                }
                let PyObject0 = PythonRuntime.storage.varList[0][commandArg];
                if (PyObject0 !== undefined && PyObject0 !== null) {
                    PythonRuntime.storage.varStack.push(PyObject0);
                    return BytecodeRunnerNextResultInstance;
                }
                let value = PyObjectFactory.constructPyObjectGlobal(globalObjectName);
                if (value != null) {
                    PythonRuntime.storage.varStack.push(value);
                    return BytecodeRunnerNextResultInstance;
                }
                PythonRuntime.storage.pyError.write(new PyObjectNameError(new PyErrorInformation('python', '$pvm$.ByteCodeInterpreter.LOAD_GLOBAL', PyObjectMethods.py_internal)));
                return new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.LOAD_GLOBAL", "Unreachable code!");
            }
            case 120: {
                PythonRuntime.storage.varStack.push(new PyBlockLoop(commandIndex + commandArg + 2));
                return BytecodeRunnerNextResultInstance;
            }
            case 121: {
                PythonRuntime.storage.varStack.push(new PyBlockExcept(commandIndex + commandArg + 2));
                return BytecodeRunnerNextResultInstance;
            }
            case 124: {
                let PyObject0 = PythonRuntime.storage.varList[PythonRuntime.storage.stackPointer - 1][commandArg];
                if (PyObject0 === undefined || PyObject0 === null) {
                    PythonRuntime.storage.pyError.write(new PyObjectNameError(new PyErrorInformation('python', '$pvm$.ByteCodeInterpreter.LOAD_FAST', PyObjectMethods.py_internal)));
                }
                else {
                    PythonRuntime.storage.varStack.push(PyObject0);
                }
                return BytecodeRunnerNextResultInstance;
            }
            case 125: {
                PythonRuntime.storage.varList[PythonRuntime.storage.stackPointer - 1][commandArg] = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                return BytecodeRunnerNextResultInstance;
            }
            case 131: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.splice(PythonRuntime.storage.varStack.length - commandArg - 1, 1)[0]);
                PyObject0.py_function_call(commandArg);
                return BytecodeRunnerNextResultInstance;
            }
            case 132: {
                let cache;
                let functionName;
                cache = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (cache.type === PyObjectType.String) {
                    functionName = cache;
                }
                else {
                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.MakeFunction.FunctionName", "Function's name should be an instance of PyObjectString.");
                }
                let functionCode;
                cache = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (cache.type === PyObjectType.Code) {
                    functionCode = cache;
                }
                else {
                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.MakeFunction.FunctionCodeIndex", "Function's code index should be an instance of PyObjectCode");
                }
                let functionFreeVariables;
                if ((commandArg & 0x08) === 0x08) {
                    cache = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (cache.type === PyObjectType.Tuple) {
                        functionFreeVariables = cache;
                        for (let i = 0; i < functionFreeVariables.value.length; i++) {
                            if (functionFreeVariables.value[i].type != PyObjectType.StoragePointer) {
                                throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.MakeFunction.FunctionDefaultArgs", "Function's default args should be an instance of PyObjectTuple which contains several PyObjectStoragePointer.");
                            }
                        }
                    }
                    else {
                        throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.MakeFunction.FunctionFreeVariables", "Function's free variables should be an instance of PyObjectTuple");
                    }
                }
                else {
                    functionFreeVariables = new PyObjectTuple(0);
                }
                if ((commandArg & 0x04) === 0x04) {
                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.MakeFunction.FunctionAnnotation", "Function's parameters annotations is unsupported yet.");
                }
                if ((commandArg & 0x02) === 0x02) {
                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.MakeFunction.FunctionKeywordArgs", "Function's keyword-only parameters is unsupported yet.");
                }
                let functionDefaultArgs;
                if ((commandArg & 0x01) === 0x01) {
                    cache = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                    if (cache.type === PyObjectType.Tuple) {
                        functionDefaultArgs = cache;
                    }
                    else {
                        throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.MakeFunction.FunctionDefaultArgs", "Function's default args should be an instance of tuple.");
                    }
                }
                else {
                    functionDefaultArgs = new PyObjectTuple(0);
                }
                let PyObject9 = new PyObjectFunction(functionName, functionCode, functionFreeVariables.value, functionDefaultArgs.value);
                PythonRuntime.storage.varStack.push(PyObject9);
                return BytecodeRunnerNextResultInstance;
            }
            case 135: {
                PythonRuntime.storage.varStack.push(RequireNotEmpty(RequireNotEmpty(PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 2])[commandArg]));
                return BytecodeRunnerNextResultInstance;
            }
            case 136: {
                let cellVars = PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 1][commandArg];
                if (cellVars == null) {
                    PythonRuntime.storage.pyError.write(new PyObjectNameError(new PyErrorInformation("python", "$BytecodeRunner$.Runner.LoadDeref", PyObjectMethods.py_internal)));
                }
                PythonRuntime.storage.varStack.push(RequireNotEmpty(cellVars).value);
                return BytecodeRunnerNextResultInstance;
            }
            case 137: {
                RequireNotEmpty(PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 1][commandArg]).value = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                return BytecodeRunnerNextResultInstance;
            }
            case 138: {
                PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 1][commandArg] = null;
                return BytecodeRunnerNextResultInstance;
            }
            case 144: {
                return new BytecodeRunnerExtendArgResult(commandArg & 0xFF);
            }
            case 160: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_method_load(PythonConfiguration.codeObjectList[commandEnv].globalList[commandArg]);
                return BytecodeRunnerNextResultInstance;
            }
            case 161: {
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.splice(PythonRuntime.storage.varStack.length - commandArg - 1, 1)[0]);
                PyObject0.py_method_call(commandArg);
                return BytecodeRunnerNextResultInstance;
            }
            default: {
                throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Runner.UnknownBytecode", StringFormat("Unknown bytecode {} with arg {}.", [commandName.toString(), commandArg.toString()]));
            }
        }
    },
    "runCodeObject": function (commandIndex, commandEnv, extendedArg) {
        while (commandIndex >= 0 && commandIndex < PythonConfiguration.codeObjectList[commandEnv].opList.length) {
            AppWorker.getInstance().pumpMessages();
            let commandName = PythonConfiguration.codeObjectList[commandEnv].opList[commandIndex];
            let commandArg = (extendedArg << 8) | PythonConfiguration.codeObjectList[commandEnv].opList[commandIndex + 1];
            try {
                let result = PythonRuntime.runBytecode(commandIndex, commandEnv, commandName, commandArg);
                if (result instanceof BytecodeRunnerNextResult) {
                    extendedArg = 0;
                    commandIndex += 2;
                }
                else if (result instanceof BytecodeRunnerJumpResult) {
                    extendedArg = 0;
                    commandIndex = result.commandIndex;
                }
                else if (result instanceof BytecodeRunnerExtendArgResult) {
                    extendedArg = (extendedArg << 8) | result.extendedArg;
                    commandIndex += 2;
                }
                else if (result instanceof BytecodeRunnerReturnResult) {
                    PythonRuntime.storage.varStack.push(result.returnValue);
                    return;
                }
                else {
                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.ResultProcessor", "Unknown BytecodeRunnerResult type.");
                }
            }
            catch (error) {
                if (!(error instanceof AbstractBytecodeRunnerSignal) || error instanceof BytecodeRunnerFatalErrorSignal) {
                    throw error;
                }
                else if (error instanceof BytecodeRunnerPyErrorSignal) {
                    for (let i = 0; i < PythonRuntime.storage.varStack.length; i++) {
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        if (PyObject0.type === PyObjectType.Except) {
                            PythonRuntime.storage.varStack.push(new PyBlockExceptCaught());
                            for (let j = 0; j < 3; j++) {
                                PythonRuntime.storage.varStack.push(RequireNotEmpty(PythonRuntime.storage.pyError.value));
                            }
                            PythonRuntime.storage.pyError.value = undefined;
                            commandIndex = PyObject0.exceptBlockOpIndex;
                            break;
                        }
                        else if (PyObject0.type === PyObjectType.FunctionCall) {
                            PythonRuntime.storage.popStack();
                            throw error;
                        }
                    }
                    if (PythonRuntime.storage.pyError.value !== undefined) {
                        throw error;
                    }
                }
                else {
                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.SignalProcessor", "Unknown BytecodeRunnerSignal type.");
                }
            }
        }
    }
};
(async () => {
    PythonConfiguration = await (await fetch("configuration.json")).json();
})().then(async () => {
    await new Promise((resolve, reject) => {
        AppWorker.getInstance().launch(() => {
            (async () => {
                PythonPacakgeHelper.loadPackages(PythonConfiguration.requiredPackages);
                await PythonPacakgeHelper.park();
            })().then(() => {
                PythonRuntime.storage.newStack(0);
                for (let codeObjectIndex = 0; codeObjectIndex < PythonConfiguration.codeObjectList.length; codeObjectIndex++) {
                    for (let constIndex = 0; constIndex < PythonConfiguration.codeObjectList[codeObjectIndex].constList.length; constIndex++) {
                        let constValue = PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex].value;
                        switch (PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex].type) {
                            case 'Number': {
                                if (typeof constValue !== "number") {
                                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.Number.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof constValue, constIndex.toString(), codeObjectIndex.toString()]));
                                }
                                PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectInt(constValue);
                                break;
                            }
                            case 'String': {
                                if (typeof constValue !== "string") {
                                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.String.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof constValue, constIndex.toString(), codeObjectIndex.toString()]));
                                }
                                PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectString(constValue);
                                break;
                            }
                            case 'Bool': {
                                if (typeof constValue !== "number") {
                                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.Bool.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof constValue, constIndex.toString(), codeObjectIndex.toString()]));
                                }
                                PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectBool(constValue === 1);
                                break;
                            }
                            case 'None': {
                                PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectNone();
                                break;
                            }
                            case 'Code': {
                                if (typeof constValue !== "number") {
                                    throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.Code.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof constValue, constIndex.toString(), codeObjectIndex.toString()]));
                                }
                                PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectCode(constValue);
                                break;
                            }
                            case 'Tuple': {
                                let decoder = function (_list) {
                                    if (typeof (_list) == 'number') {
                                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(_list));
                                    }
                                    else if (Array.isArray(_list)) {
                                        for (let i = 0; i < _list.length; i++) {
                                            decoder(_list[i]);
                                        }
                                        PythonRuntime.storage.varStack.push(new PyObjectTuple(_list.length));
                                    }
                                    else {
                                        throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.Tuple.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof _list, constIndex.toString(), codeObjectIndex.toString()]));
                                    }
                                };
                                decoder(PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex].value);
                                PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex] = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                break;
                            }
                            default: {
                                throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.UnknownType", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof PythonConfiguration.codeObjectList[codeObjectIndex].constList[constIndex].type, constIndex.toString(), codeObjectIndex.toString()]));
                            }
                        }
                    }
                }
                let startTime = performance.now();
                try {
                    PythonRuntime.runCodeObject(0, 0, 0);
                }
                catch (error) {
                    if (!(error instanceof BytecodeRunnerPyErrorSignal)) {
                        throw error;
                    }
                    let pyError = RequireNotEmpty(PythonRuntime.storage.pyError.value).value;
                    let pyErrorType;
                    let pyErrorProto = RequireNotEmpty(PythonRuntime.storage.pyError.value).__proto__;
                    if (typeof pyErrorProto?.constructor?.name != "string") {
                        pyErrorType = "UNKNOWN";
                    }
                    else {
                        pyErrorType = pyErrorProto.constructor.name;
                    }
                    AppWorker.getInstance().postMessage({
                        "messageType": MessageType.W2M.Console.Stdout,
                        "messageBody": StringFormat("An uncaught python exception encountered.\n" +
                            "{}: In {}:{}#{}\n", [pyErrorType, pyError.namespace, pyError.className, pyError.methodName.description == undefined ? "UNKNOWN" : pyError.methodName.description])
                    });
                }
                let time = performance.now() - startTime;
                let returnValue = PythonRuntime.storage.varStack.pop();
                let exitCode;
                if (returnValue == null || returnValue.type == PyObjectType.None) {
                    exitCode = 0;
                }
                else if (returnValue.type == PyObjectType.Int) {
                    exitCode = returnValue.value;
                }
                else {
                    exitCode = 0;
                }
                AppWorker.getInstance().postMessage({
                    "messageType": MessageType.W2M.Console.Stdout,
                    "messageBody": StringFormat("[Finished in {} ms with code {}]", [time.toString(), exitCode.toString()])
                });
                AppWorker.getInstance().exit(exitCode);
                resolve(exitCode);
            }).catch(error => {
                console.error(error);
                let place, msg;
                if (error instanceof BytecodeRunnerFatalErrorSignal) {
                    place = error.place;
                    msg = error.msg;
                }
                else {
                    place = "UNKNOWN";
                    try {
                        msg = JSON.stringify(error);
                    }
                    catch (ignore) {
                        msg = "NULL";
                    }
                }
                AppWorker.getInstance().postMessage({
                    "messageType": MessageType.W2M.Console.Stdout,
                    "messageBody": StringFormat("# An fatal error encountered. WebPython Virtual Machine will shut down forcely.\n" +
                        "# [{}]: {}\n" +
                        "# Please check your usage of webpygame.unsafe package, and consider reporting this bug to the developers of WebPygame.", [place, msg])
                });
                AppWorker.getInstance().exit(1);
                reject(error);
            });
        }, PythonConfiguration.screenSize);
    });
});
