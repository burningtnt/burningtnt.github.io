"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        throw new BytecodeRunnerFatalErrorSignal("RequireNotEmpty", "Instance is undefined.");
    }
    if (instance == null) {
        throw new BytecodeRunnerFatalErrorSignal("RequireNotEmpty", "Instance is null.");
    }
    return instance;
};
const GlobalThis = self;
var PyObjectType;
var WorkerMessageChannel = {
    "MessageType": {
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
                "SetTitle": "W2M:GUI.SetTitle"
            }
        },
        "STATUS": {
            "MAIN_ACCESS": 0,
            "WORKER_ACCESS": 1
        }
    },
    'internal': {
        "canvas": undefined,
        "pen": undefined,
        "messageCache": []
    },
    "run": (action) => {
        GlobalThis.onmessage = function (ev) {
            if (ev.data.messageType !== WorkerMessageChannel.MessageType.M2W.LifeCycle.InitMessageChannel) {
                return;
            }
            if (ev.data.messageBody === null || ev.data.messageBody === undefined) {
                return;
            }
            let messageBody = ev.data.messageBody;
            WorkerMessageChannel.internal.canvas = messageBody.canvas;
            WorkerMessageChannel.internal.pen = RequireNotEmpty(messageBody.canvas.getContext("2d"));
            GlobalThis.onmessage = null;
            if (messageBody.sharedBuffer.byteLength != 1027) {
                return;
            }
            let uint8Array = new Uint8Array(messageBody.sharedBuffer);
            let textDecoder = new TextDecoder("utf-8");
            let dataView = new DataView(messageBody.sharedBuffer);
            WorkerMessageChannel.pumpMessages = () => {
                if (Atomics.load(uint8Array, 0) != WorkerMessageChannel.MessageType.STATUS.WORKER_ACCESS) {
                    return;
                }
                else {
                    let messages = JSON.parse(textDecoder.decode(uint8Array.slice(3, dataView.getUint16(1, true) + 3)));
                    Atomics.store(uint8Array, 0, WorkerMessageChannel.MessageType.STATUS.MAIN_ACCESS);
                    WorkerMessageChannel.postMessage({
                        "messageType": WorkerMessageChannel.MessageType.W2M.LifeCycle.MessagePumped,
                        "messageBody": null
                    });
                    for (let i = 0; i < messages.length; i++) {
                        WorkerMessageChannel.internal.messageCache.push(messages[i]);
                    }
                }
            };
            WorkerMessageChannel.getMessage = () => {
                WorkerMessageChannel.pumpMessages();
                let message = WorkerMessageChannel.internal.messageCache.shift();
                if (message == undefined) {
                    return null;
                }
                else {
                    return message;
                }
            };
            WorkerMessageChannel.postMessage({
                "messageType": WorkerMessageChannel.MessageType.W2M.LifeCycle.ConnectionOK,
                "messageBody": null
            });
            action((exitCode) => {
                WorkerMessageChannel.postMessage({
                    "messageType": WorkerMessageChannel.MessageType.W2M.LifeCycle.Exit,
                    "messageBody": exitCode
                });
            });
        };
        WorkerMessageChannel.postMessage({
            "messageType": WorkerMessageChannel.MessageType.W2M.LifeCycle.RequestInitMessageChannel,
            "messageBody": null
        });
    },
    "postMessage": (message) => {
        GlobalThis.postMessage(message);
    },
    "pumpMessages": () => null,
    "getMessage": () => {
        return null;
    }
};
var PythonRuntime;
var PythonBytecode;
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
    constructor(namespace, className, methodName) {
        this.namespace = namespace;
        this.className = className;
        this.methodName = methodName;
    }
}
class PyObjectBase {
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
                    "argNum": [PythonBytecode.codeObjectList[PyObject0.commandCode.commandEnv].arg - 1],
                    "method": function () {
                        PythonRuntime.storage.varStack.splice(PythonRuntime.storage.varStack.length - PythonBytecode.codeObjectList[PyObject0.commandCode.commandEnv].arg + 1, 0, PyThis);
                        PyObject0.py_function_call(PythonBytecode.codeObjectList[PyObject0.commandCode.commandEnv].arg);
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
    constructor(getter, setter) {
        super();
        this.type = PyObjectType.StoragePointer;
        this.getter = getter;
        this.setter = setter;
    }
    get() {
        let value = this.getter();
        if (value == null || value == undefined) {
            PythonRuntime.storage.pyError.write(new PyObjectNameError(new PyErrorInformation("python", "pointer", PyObjectMethods.py_internal)));
        }
        return value;
    }
    set(PyObject0) {
        this.setter(PyObject0);
    }
}
class PyObjectInt extends PyObjectBase {
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
            PythonRuntime.storage.varStack.push(new PyObjectString(newString));
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
        PythonRuntime.storage.varStack.push(new PyObjectString(this.value.toString()));
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
        PythonRuntime.storage.varStack.push(new PyObjectString(this.value.toString()));
    }
}
class PyObjectString extends PyObjectBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = PyObjectType.String;
    }
    py_binary_add(PyObject0) {
        if (PyObject0.type === PyObjectType.String) {
            PythonRuntime.storage.varStack.push(new PyObjectString(this.value + PyObject0.value));
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
            PythonRuntime.storage.varStack.push(new PyObjectString(newString));
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
        PythonRuntime.storage.varStack.push(new PyObjectString('\'' + this.value + '\''));
    }
}
class PyObjectNone extends PyObjectBase {
    constructor() {
        super();
        this.type = PyObjectType.None;
    }
    py_str() {
        PythonRuntime.storage.varStack.push(new PyObjectString('None'));
    }
    py_bool() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(false));
    }
    py_repr() {
        PythonRuntime.storage.varStack.push(new PyObjectString('None'));
    }
}
class PyObjectBool extends PyObjectBase {
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
        if (this.value === true) {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(1));
        }
        else {
            PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(0));
        }
    }
    py_str() {
        if (this.value === true) {
            PythonRuntime.storage.varStack.push(new PyObjectString('True'));
        }
        else {
            PythonRuntime.storage.varStack.push(new PyObjectString('False'));
        }
    }
    py_bool() {
        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(this.value));
    }
    py_repr() {
        if (this.value === true) {
            PythonRuntime.storage.varStack.push(new PyObjectString('True'));
        }
        else {
            PythonRuntime.storage.varStack.push(new PyObjectString('False'));
        }
    }
}
class PyObjectGlobal extends PyObjectBase {
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
            if (flag === false) {
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
            if (flag === false) {
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
        PythonRuntime.storage.varStack.push(new PyObjectString(StringFormat('<built-in function {}>', [this.value.toString()])));
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
            default: {
                PythonRuntime.storage.pyError.write(new PyObjectAttributeError(new PyErrorInformation('python', 'list', PyObjectMethods.py_attr_get)));
            }
        }
    }
}
class PyObjectCode extends PyObjectBase {
    constructor(value) {
        super();
        this.commandEnv = value;
        this.type = PyObjectType.Code;
    }
}
class PyObjectFunction extends PyObjectBase {
    constructor(name, commandCode, cellVarTuple, defaultArgs) {
        super();
        this.type = PyObjectType.FunctionObject;
        this.name = name;
        this.commandCode = commandCode;
        this.cellVarTuple = cellVarTuple;
        this.defaultArgs = defaultArgs;
    }
    py_function_call(argNum) {
        if (argNum > PythonBytecode.codeObjectList[this.commandCode.commandEnv].arg) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'Function', PyObjectMethods.py_function_call)));
        }
        else if (argNum + this.defaultArgs.length < PythonBytecode.codeObjectList[this.commandCode.commandEnv].arg) {
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
    constructor(bases, name, constructorFunction) {
        super();
        this.bases = bases;
        this.name = name;
        this.constructorFunction = constructorFunction;
        this.type = PyObjectType.Class;
    }
    py_function_call(argNum) {
        if (0 !== PythonBytecode.codeObjectList[this.constructorFunction.commandCode.commandEnv].arg) {
            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('python', 'Function', PyObjectMethods.py_function_call)));
        }
        PythonRuntime.storage.newStack(this.constructorFunction.commandCode.commandEnv);
        PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 1] = this.constructorFunction.cellVarTuple;
        PythonRuntime.storage.varStack.push(new PyBlockFunctionCall());
        let nameFieldIndex = PythonBytecode.codeObjectList[this.constructorFunction.commandCode.commandEnv].globalList.indexOf("__name__");
        if (nameFieldIndex !== -1) {
            PythonRuntime.storage.globalVarList[PythonRuntime.storage.stackPointer - 1][nameFieldIndex] = this.name;
        }
        PythonRuntime.runCodeObject(0, this.constructorFunction.commandCode.commandEnv, 0);
        let member = new Map();
        for (let i = 0; i < PythonBytecode.codeObjectList[this.constructorFunction.commandCode.commandEnv].globalList.length; i++) {
            member.set(PythonBytecode.codeObjectList[this.constructorFunction.commandCode.commandEnv].globalList[i], PythonRuntime.storage.globalVarList[PythonRuntime.storage.stackPointer - 1][i]);
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
    constructor(breakCommandIndex) {
        super();
        this.type = PyObjectType.Loop;
        this.breakCommandIndex = breakCommandIndex;
    }
}
class PyBlockExcept extends PyObjectBase {
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
        PythonRuntime.storage.varStack.push(new PyObjectString('<class \'TypeError\'>'));
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
        return (value, commitCache) => new PyObjectString(value);
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
            if (value === true) {
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
                WorkerMessageChannel.postMessage({
                    "messageType": WorkerMessageChannel.MessageType.W2M.Console.Stdout,
                    "messageBody": result.slice(0, result.length - 1) + '\n'
                });
                WorkerMessageChannel.postMessage({
                    "messageType": WorkerMessageChannel.MessageType.W2M.Console.Flush,
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
    'webpygame': {
        'name': 'webpygame',
        'attr': {
            'jsCalc': {
                'name': 'webpygame:jsCalc',
                'attr': {},
                'py_function_call': {
                    'argNum': [1],
                    'method': function () {
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        if (PyObject0.type !== PyObjectType.String) {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('webpygame', 'webpygame:jsCalc', PyObjectMethods.py_function_call)));
                        }
                        else {
                            let result = eval('(function() {return (' + PyObject0.value + ')})()');
                            if (!Number.isFinite(result)) {
                                PythonRuntime.storage.pyError.write(new PyObjectZeroDivisionError(new PyErrorInformation('webpygame', 'webpygame:jsCalc', PyObjectMethods.py_function_call)));
                            }
                            else {
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(result));
                            }
                        }
                    }
                },
                "$": ""
            },
            'platform': {
                'name': 'webpygame:platform',
                'attr': {
                    'webpygame:platform.getCurrentPlatform': {
                        'name': 'webpygame:platform.getCurrentPlatform',
                        'attr': {},
                        'py_function_call': {
                            'argNum': [0],
                            'method': function () {
                                PythonRuntime.storage.varStack.push(new PyObjectString('Web.PC:Unknown'));
                            }
                        },
                        "$": ""
                    },
                    'debuggerPause': {
                        'name': 'webpygame:platform.debuggerPause',
                        'attr': {},
                        'py_function_call': {
                            'argNum': [0],
                            'method': function () {
                                debugger;
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                            }
                        },
                        "$": ""
                    }
                },
                "$": ""
            }
        },
        "$": ""
    },
    'pygame': {
        'name': 'pygame',
        'attr': {
            "QUIT": PyObjectFactory.constructPyObjectInt(256),
            "KEYDOWN": PyObjectFactory.constructPyObjectInt(768),
            "KEYUP": PyObjectFactory.constructPyObjectInt(769),
            "K_LEFT": PyObjectFactory.constructPyObjectInt(1073741904),
            "K_RIGHT": PyObjectFactory.constructPyObjectInt(1073741903),
            "K_UP": PyObjectFactory.constructPyObjectInt(1073741906),
            "K_DOWN": PyObjectFactory.constructPyObjectInt(1073741905),
            "MOUSEBUTTONDOWN": PyObjectFactory.constructPyObjectInt(1025),
            "MOUSEBUTTONUP": PyObjectFactory.constructPyObjectInt(1026),
            'init': {
                'name': 'pygame:init',
                'attr': {},
                'py_function_call': {
                    'argNum': [0],
                    'attr': {},
                    'method': function () {
                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(0));
                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(0));
                        let PyObject0 = new PyObjectTuple(2);
                        PythonRuntime.storage.varStack.push(PyObject0);
                    }
                },
                "$": ""
            },
            "font": {
                "name": "pygame:font",
                "attr": {
                    "Font": {
                        "name": "pygame:font.Font",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [2],
                            "attr": {},
                            "method": function () {
                                let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'font.Font', PyObjectMethods.py_function_call)));
                                }
                                let fontSize = buffer;
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.None) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'font.Font', PyObjectMethods.py_function_call)));
                                }
                                let font = new PyObjectGlobal({
                                    "name": "pygame:font.Font@instance",
                                    "attr": {
                                        "render": {
                                            "name": "pygame:font.Font@instance.render",
                                            "attr": {},
                                            "py_function_call": {
                                                "argNum": [3],
                                                "method": function () {
                                                    let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Tuple) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'font.Font@instance.render', PyObjectMethods.py_function_call)));
                                                    }
                                                    let color = buffer;
                                                    if (color.value.length != 3) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'font.Font@instance.render', PyObjectMethods.py_function_call)));
                                                    }
                                                    for (let i = 0; i < 3; i++) {
                                                        if (color.value[i].type != PyObjectType.Int) {
                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'font.Font@instance.render', PyObjectMethods.py_function_call)));
                                                        }
                                                        if (color.value[i].value % 1 !== 0) {
                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'font.Font@instance.render', PyObjectMethods.py_function_call)));
                                                        }
                                                    }
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Bool) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'font.Font@instance.render', PyObjectMethods.py_function_call)));
                                                    }
                                                    let antialias = buffer;
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.String) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'font.Font@instance.render', PyObjectMethods.py_function_call)));
                                                    }
                                                    let text = buffer;
                                                    RequireNotEmpty(WorkerMessageChannel.internal.pen).font = font.storage.toString() + "px";
                                                    let ctx = RequireNotEmpty(new OffscreenCanvas(RequireNotEmpty(WorkerMessageChannel.internal.pen).measureText(text.value).width, font.storage).getContext("2d"));
                                                    ctx.fillStyle = StringFormat("rgb({},{},{})", [
                                                        color.value[0].value.toString(),
                                                        color.value[1].value.toString(),
                                                        color.value[2].value.toString()
                                                    ]);
                                                    ctx.textBaseline = 'top';
                                                    ctx.fillText(text.value, 0, 0);
                                                    PythonRuntime.storage.varStack.push(new PyObjectGlobal({
                                                        "name": "pygame:Surface@instance",
                                                        "attr": {
                                                            "blit": {
                                                                "name": "pygame:display.screenSurface@instance.blit",
                                                                "attr": {},
                                                                "py_function_call": {
                                                                    "argNum": [2],
                                                                    "method": function () {
                                                                        let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                                        if (buffer.type != PyObjectType.Tuple) {
                                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                                        }
                                                                        let pos = buffer;
                                                                        if (pos.value.length != 2) {
                                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                                        }
                                                                        for (let i = 0; i < 2; i++) {
                                                                            if (pos.value[i].type != PyObjectType.Int) {
                                                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                                            }
                                                                            pos.value[i] = PyObjectFactory.constructPyObjectInt(Math.floor(pos.value[i].value));
                                                                        }
                                                                        buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                                        if (buffer.type != PyObjectType.Global) {
                                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                                            return;
                                                                        }
                                                                        let surface = buffer;
                                                                        let ctx2;
                                                                        if (surface.value.name === "pygame:display.screenSurface@instance") {
                                                                            ctx2 = RequireNotEmpty(WorkerMessageChannel.internal.pen);
                                                                        }
                                                                        else if (surface.value.name === "pygame:Surface@instance") {
                                                                            ctx2 = surface.storage;
                                                                        }
                                                                        else {
                                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                                            return;
                                                                        }
                                                                        ctx.drawImage(ctx2.canvas, pos.value[0].value, pos.value[1].value);
                                                                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                                                                    }
                                                                },
                                                                "$": ""
                                                            },
                                                            "fill": {
                                                                "name": "pygame:Surface@instance.fill",
                                                                "attr": {},
                                                                "py_function_call": {
                                                                    "argNum": [1],
                                                                    "method": function () {
                                                                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                                        if (PyObject0.type != PyObjectType.Tuple) {
                                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.globalSurface@instance.fill', PyObjectMethods.py_function_call)));
                                                                        }
                                                                        if (PyObject0.value.length != 3) {
                                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.globalSurface@instance.fill', PyObjectMethods.py_function_call)));
                                                                        }
                                                                        for (let i = 0; i < 3; i++) {
                                                                            if (PyObject0.value[i].type != PyObjectType.Int) {
                                                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.globalSurface@instance.fill', PyObjectMethods.py_function_call)));
                                                                            }
                                                                            if (PyObject0.value[i].value % 1 !== 0) {
                                                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.globalSurface@instance.fill', PyObjectMethods.py_function_call)));
                                                                            }
                                                                        }
                                                                        ctx.fillStyle = StringFormat("rgb({},{},{})", [
                                                                            PyObject0.value[0].value.toString(),
                                                                            PyObject0.value[1].value.toString(),
                                                                            PyObject0.value[2].value.toString()
                                                                        ]);
                                                                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                                                                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                                                                    }
                                                                },
                                                                "$": ""
                                                            }
                                                        },
                                                        "$": ""
                                                    }, ctx));
                                                }
                                            },
                                            "$": ""
                                        }
                                    },
                                    "$": ""
                                }, fontSize.value);
                                PythonRuntime.storage.varStack.push(font);
                            }
                        },
                        "$": ""
                    }
                },
                "$": ""
            },
            "Rect": {
                "name": "pygame:Rect",
                "attr": {},
                "py_function_call": {
                    "argNum": [1],
                    "method": function () {
                        let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        if (buffer.type == PyObjectType.Global && buffer.value.name === "pygame:Rect@instance") {
                            let rectA = buffer;
                            rectA.py_attr_get("x");
                            rectA.py_attr_get("y");
                            rectA.py_attr_get("w");
                            rectA.py_attr_get("h");
                            PythonRuntime.storage.varStack.push(new PyObjectTuple(4));
                            this.method(1);
                        }
                        else if (buffer.type == PyObjectType.Tuple || buffer.type == PyObjectType.List) {
                            let rect = buffer;
                            if (rect.value.length != 4) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect', PyObjectMethods.py_function_call)));
                            }
                            for (let i = 0; i < 4; i++) {
                                if (rect.value[i].type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect', PyObjectMethods.py_function_call)));
                                }
                                rect.value[i] = PyObjectFactory.constructPyObjectInt(Math.floor(rect.value[i].value));
                            }
                            let rectA = new PyObjectGlobal({
                                "name": "pygame:Rect@instance",
                                "attr": {
                                    "x": rect.value[0],
                                    "y": rect.value[1],
                                    "w": rect.value[2],
                                    "h": rect.value[3],
                                    "left": rect.value[0],
                                    "top": rect.value[1],
                                    "right": PyObjectFactory.constructPyObjectInt(rect.value[0].value + rect.value[2].value),
                                    "bottom": PyObjectFactory.constructPyObjectInt(rect.value[1].value + rect.value[3].value),
                                    "colliderect": {
                                        "name": "pygame:Rect@instance.colliderect",
                                        "attr": {},
                                        "py_function_call": {
                                            "argNum": [1],
                                            "method": function () {
                                                let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                if (buffer.type === PyObjectType.Global && buffer.value.name === "pygame:Rect@instance") {
                                                    let rectB = buffer;
                                                    rectB.py_attr_get("x");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let rbX = buffer.value;
                                                    rectB.py_attr_get("y");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let rbY = buffer.value;
                                                    rectB.py_attr_get("w");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let rbW = buffer.value;
                                                    rectB.py_attr_get("h");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let rbH = buffer.value;
                                                    rectA.py_attr_get("x");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let raX = buffer.value;
                                                    rectA.py_attr_get("y");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let raY = buffer.value;
                                                    rectA.py_attr_get("w");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let raW = buffer.value;
                                                    rectA.py_attr_get("h");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let raH = buffer.value;
                                                    PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(raX < rbX + rbW && raX + raW > rbX && raY < rbY + rbH && raY + raH > rbY));
                                                }
                                                else if (buffer.type === PyObjectType.Tuple || buffer.type === PyObjectType.List) {
                                                    if (buffer.value.length != 4) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    for (let i = 0; i < 4; i++) {
                                                        if (buffer.value[i].type !== PyObjectType.Int) {
                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                        }
                                                    }
                                                    let rbX = Math.floor(buffer.value[0].value);
                                                    let rbY = Math.floor(buffer.value[1].value);
                                                    let rbW = Math.floor(buffer.value[2].value);
                                                    let rbH = Math.floor(buffer.value[3].value);
                                                    rectA.py_attr_get("x");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let raX = buffer.value;
                                                    rectA.py_attr_get("y");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let raY = buffer.value;
                                                    rectA.py_attr_get("w");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let raW = buffer.value;
                                                    rectA.py_attr_get("h");
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                    }
                                                    let raH = buffer.value;
                                                    PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectBool(raX < rbX + rbW && raX + raW > rbX && raY < rbY + rbH && raY + raH > rbY));
                                                }
                                                else {
                                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.colliderect', PyObjectMethods.py_function_call)));
                                                }
                                            }
                                        },
                                        "$": ""
                                    },
                                    "collidelist": {
                                        "name": "pygame:Rect@instance.collidelist",
                                        "attr": {},
                                        "py_function_call": {
                                            "argNum": [1],
                                            "method": function () {
                                                let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                if (buffer.type != PyObjectType.Tuple && buffer.type != PyObjectType.List) {
                                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.collidelist', PyObjectMethods.py_function_call)));
                                                }
                                                let rects = buffer;
                                                for (let i = 0; i < rects.value.length; i++) {
                                                    PythonRuntime.storage.varStack.push(rects.value[i]);
                                                    rectA.py_attr_get("colliderect");
                                                    RequireNotEmpty(PythonRuntime.storage.varStack.pop()).py_function_call(1);
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type !== PyObjectType.Bool) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.collidelist', PyObjectMethods.py_function_call)));
                                                    }
                                                    if (buffer.value) {
                                                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(i));
                                                        return;
                                                    }
                                                }
                                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(-1));
                                            }
                                        },
                                        "$": ""
                                    }
                                },
                                "py_attr_set": (attr, key) => {
                                    let value = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                    switch (key) {
                                        case "x":
                                        case "left": {
                                            if (value.type != PyObjectType.Int) {
                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.py_attr_set', PyObjectMethods.py_attr_set)));
                                            }
                                            attr.x = value;
                                            attr.left = value;
                                            attr.right = PyObjectFactory.constructPyObjectInt(value.value + attr.w.value);
                                            break;
                                        }
                                        case "y":
                                        case "top": {
                                            if (value.type != PyObjectType.Int) {
                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.py_attr_set', PyObjectMethods.py_attr_set)));
                                            }
                                            attr.y = value;
                                            attr.top = value;
                                            attr.bottom = PyObjectFactory.constructPyObjectInt(value.value + attr.h.value);
                                            break;
                                        }
                                        case "w": {
                                            if (value.type != PyObjectType.Int) {
                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.py_attr_set', PyObjectMethods.py_attr_set)));
                                            }
                                            attr.w = value;
                                            attr.right = PyObjectFactory.constructPyObjectInt(attr.x.value + value.value);
                                            break;
                                        }
                                        case "h": {
                                            if (value.type != PyObjectType.Int) {
                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.py_attr_set', PyObjectMethods.py_attr_set)));
                                            }
                                            attr.h = value;
                                            attr.bottom = PyObjectFactory.constructPyObjectInt(attr.y.value + value.value);
                                            break;
                                        }
                                        case "right": {
                                            if (value.type != PyObjectType.Int) {
                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.py_attr_set', PyObjectMethods.py_attr_set)));
                                            }
                                            attr.right = value;
                                            attr.x = PyObjectFactory.constructPyObjectInt(value.value - attr.w.value);
                                            break;
                                        }
                                        case "bottom": {
                                            if (value.type != PyObjectType.Int) {
                                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.py_attr_set', PyObjectMethods.py_attr_set)));
                                            }
                                            attr.bottom = value;
                                            attr.y = PyObjectFactory.constructPyObjectInt(value.value - attr.h.value);
                                            break;
                                        }
                                        default: {
                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect@instance.py_attr_set', PyObjectMethods.py_attr_set)));
                                        }
                                    }
                                },
                                "$": ""
                            });
                            PythonRuntime.storage.varStack.push(rectA);
                        }
                        else {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Rect', PyObjectMethods.py_function_call)));
                        }
                    }
                },
                "$": ""
            },
            'display': {
                'name': 'pygame:display',
                'attr': {
                    'set_mode': {
                        'name': 'pygame:display.set_mode',
                        'attr': {},
                        'py_function_call': {
                            'argNum': [1],
                            'method': function () {
                                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (PyObject0.type !== PyObjectType.Tuple || PyObject0.value.length !== 2) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.set_mode', PyObjectMethods.py_function_call)));
                                }
                                if (PyObject0.value[0].type !== PyObjectType.Int || PyObject0.value[0].value <= 0 || PyObject0.value[0].value % 1 !== 0) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.set_mode', PyObjectMethods.py_function_call)));
                                }
                                if (PyObject0.value[1].type !== PyObjectType.Int || PyObject0.value[1].value <= 0 || PyObject0.value[1].value % 1 !== 0) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.set_mode', PyObjectMethods.py_function_call)));
                                }
                                if (RequireNotEmpty(WorkerMessageChannel.internal.canvas).width != PyObject0.value[0].value) {
                                    PythonRuntime.storage.pyError.write(new PyObjectValueError(new PyErrorInformation('pygame', 'display.set_mode', PyObjectMethods.py_function_call)));
                                }
                                if (RequireNotEmpty(WorkerMessageChannel.internal.canvas).height != PyObject0.value[1].value) {
                                    PythonRuntime.storage.pyError.write(new PyObjectValueError(new PyErrorInformation('pygame', 'display.set_mode', PyObjectMethods.py_function_call)));
                                }
                                PythonRuntime.storage.varStack.push(new PyObjectGlobal({
                                    "name": "pygame:display.screenSurface@instance",
                                    "attr": {
                                        "blit": {
                                            "name": "pygame:display.screenSurface@instance.blit",
                                            "attr": {},
                                            "py_function_call": {
                                                "argNum": [2],
                                                "method": function () {
                                                    let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Tuple) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                    }
                                                    let pos = buffer;
                                                    if (pos.value.length != 2) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                    }
                                                    for (let i = 0; i < 2; i++) {
                                                        if (pos.value[i].type != PyObjectType.Int) {
                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                        }
                                                        pos.value[i] = PyObjectFactory.constructPyObjectInt(Math.floor(pos.value[i].value));
                                                    }
                                                    buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (buffer.type != PyObjectType.Global) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                        return;
                                                    }
                                                    let surface = buffer;
                                                    let ctx;
                                                    if (surface.value.name === "pygame:display.screenSurface@instance") {
                                                        ctx = RequireNotEmpty(WorkerMessageChannel.internal.pen);
                                                    }
                                                    else if (surface.value.name === "pygame:Surface@instance") {
                                                        ctx = surface.storage;
                                                    }
                                                    else {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                                                        return;
                                                    }
                                                    RequireNotEmpty(WorkerMessageChannel.internal.pen).drawImage(ctx.canvas, pos.value[0].value, pos.value[1].value);
                                                    PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                                                }
                                            },
                                            "$": ""
                                        },
                                        "fill": {
                                            "name": "pygame:display.screenSurface@instance.fill",
                                            "attr": {},
                                            "py_function_call": {
                                                "argNum": [1],
                                                "method": function () {
                                                    let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (PyObject0.type != PyObjectType.Tuple) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.globalSurface@instance.fill', PyObjectMethods.py_function_call)));
                                                    }
                                                    if (PyObject0.value.length != 3) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.globalSurface@instance.fill', PyObjectMethods.py_function_call)));
                                                    }
                                                    for (let i = 0; i < 3; i++) {
                                                        if (PyObject0.value[i].type != PyObjectType.Int) {
                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.globalSurface@instance.fill', PyObjectMethods.py_function_call)));
                                                        }
                                                        if (PyObject0.value[i].value % 1 !== 0) {
                                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.globalSurface@instance.fill', PyObjectMethods.py_function_call)));
                                                        }
                                                    }
                                                    RequireNotEmpty(WorkerMessageChannel.internal.pen).fillStyle = StringFormat("rgb({},{},{})", [
                                                        PyObject0.value[0].value.toString(),
                                                        PyObject0.value[1].value.toString(),
                                                        PyObject0.value[2].value.toString()
                                                    ]);
                                                    RequireNotEmpty(WorkerMessageChannel.internal.pen).fillRect(0, 0, RequireNotEmpty(WorkerMessageChannel.internal.canvas).width, RequireNotEmpty(WorkerMessageChannel.internal.canvas).height);
                                                    PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                                                }
                                            },
                                            "$": ""
                                        }
                                    },
                                    "$": ""
                                }));
                            }
                        },
                        "$": ""
                    },
                    'set_caption': {
                        'name': 'pygame:display.set_caption',
                        'attr': {},
                        'py_function_call': {
                            'argNum': [1],
                            'method': function () {
                                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (PyObject0.type !== PyObjectType.String) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.set_caption', PyObjectMethods.py_function_call)));
                                }
                                WorkerMessageChannel.postMessage({
                                    'messageType': WorkerMessageChannel.MessageType.W2M.GUI.SetTitle,
                                    'messageBody': PyObject0.value
                                });
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                            }
                        },
                        "$": ""
                    },
                    "update": {
                        "name": "pygame:diplay.update",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [0],
                            "method": (function () {
                                let firstTime = false;
                                return () => {
                                    let commitFunction = RequireNotEmpty(WorkerMessageChannel.internal.pen).commit;
                                    if (commitFunction == undefined) {
                                        if (firstTime) {
                                            WorkerMessageChannel.postMessage({
                                                "messageType": WorkerMessageChannel.MessageType.W2M.Console.Stdout,
                                                "messageBody": "WebPygame Renderer can't commit the OffscreenCanvas.\n"
                                            });
                                            WorkerMessageChannel.postMessage({
                                                "messageType": WorkerMessageChannel.MessageType.W2M.Console.Flush,
                                                "messageBody": null
                                            });
                                            firstTime = true;
                                        }
                                    }
                                    else {
                                        RequireNotEmpty(WorkerMessageChannel.internal.pen).commit();
                                    }
                                    PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                                };
                            })()
                        },
                        "$": ""
                    }
                },
                "$": ""
            },
            "draw": {
                "name": "pygame:draw",
                "attr": {
                    "line": {
                        "name": "pygame:draw.line",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [5],
                            "method": function () {
                                let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                let width = buffer;
                                if (width.value % 1 !== 0) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Tuple) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                let endPos = buffer;
                                if (endPos.value.length != 2) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                for (let i = 0; i < 2; i++) {
                                    if (endPos.value[i].type != PyObjectType.Int) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                    }
                                    endPos.value[i] = PyObjectFactory.constructPyObjectInt(Math.floor(endPos.value[i].value));
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Tuple) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                let startPos = buffer;
                                if (startPos.value.length != 2) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                for (let i = 0; i < 2; i++) {
                                    if (startPos.value[i].type != PyObjectType.Int) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                    }
                                    startPos.value[i] = PyObjectFactory.constructPyObjectInt(Math.floor(startPos.value[i].value));
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Tuple) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                let color = buffer;
                                if (color.value.length != 3) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                for (let i = 0; i < 3; i++) {
                                    if (color.value[i].type != PyObjectType.Int) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                    }
                                    if (color.value[i].value % 1 !== 0) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                    }
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Global) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                }
                                let surface = buffer;
                                let ctx;
                                if (surface.value.name === "pygame:display.screenSurface@instance") {
                                    ctx = RequireNotEmpty(WorkerMessageChannel.internal.pen);
                                }
                                else if (surface.value.name === "pygame:Surface@instance") {
                                    ctx = surface.storage;
                                }
                                else {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.line', PyObjectMethods.py_function_call)));
                                    return;
                                }
                                ctx.beginPath();
                                ctx.moveTo(startPos.value[0].value, startPos.value[1].value);
                                ctx.lineTo(endPos.value[0].value, endPos.value[1].value);
                                ctx.closePath();
                                ctx.strokeStyle = StringFormat("rgb({},{},{})", [
                                    color.value[0].value.toString(),
                                    color.value[1].value.toString(),
                                    color.value[2].value.toString()
                                ]);
                                ctx.stroke();
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                            }
                        },
                        "$": ""
                    },
                    "lines": {
                        "name": "pygame:draw.lines",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [5],
                            "method": function () {
                                let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lines', PyObjectMethods.py_function_call)));
                                }
                                let width = buffer;
                                if (width.value % 1 !== 0) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lines', PyObjectMethods.py_function_call)));
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Tuple) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lines', PyObjectMethods.py_function_call)));
                                }
                                let points = buffer;
                                for (let i = 0; i < points.value.length; i++) {
                                    if (points.value[i].type != PyObjectType.Tuple) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lines', PyObjectMethods.py_function_call)));
                                    }
                                    if (points.value[i].value.length != 2) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lines', PyObjectMethods.py_function_call)));
                                    }
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Bool) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lines', PyObjectMethods.py_function_call)));
                                }
                                let closed = buffer;
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Tuple) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lined', PyObjectMethods.py_function_call)));
                                }
                                let color = buffer;
                                if (color.value.length != 3) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lined', PyObjectMethods.py_function_call)));
                                }
                                for (let i = 0; i < 3; i++) {
                                    if (color.value[i].type != PyObjectType.Int) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lined', PyObjectMethods.py_function_call)));
                                    }
                                    if (color.value[i].value % 1 !== 0) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lined', PyObjectMethods.py_function_call)));
                                    }
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Global) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lined', PyObjectMethods.py_function_call)));
                                }
                                let surface = buffer;
                                let ctx;
                                if (surface.value.name === "pygame:display.screenSurface@instance") {
                                    ctx = RequireNotEmpty(WorkerMessageChannel.internal.pen);
                                }
                                else if (surface.value.name === "pygame:Surface@instance") {
                                    ctx = surface.storage;
                                }
                                else {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lined', PyObjectMethods.py_function_call)));
                                    return;
                                }
                                ctx.beginPath();
                                if (points.value.length > 0) {
                                    RequireNotEmpty(WorkerMessageChannel.internal.pen).moveTo(Math.floor(points.value[0].value[0].value), Math.floor(points.value[0].value[1].value));
                                    for (let i = 1; i < points.value.length; i++) {
                                        RequireNotEmpty(WorkerMessageChannel.internal.pen).lineTo(Math.floor(points.value[i].value[0].value), Math.floor(points.value[i].value[1].value));
                                    }
                                }
                                ctx.closePath();
                                ctx.strokeStyle = StringFormat("rgb({},{},{})", [
                                    color.value[0].value.toString(),
                                    color.value[1].value.toString(),
                                    color.value[2].value.toString()
                                ]);
                                ctx.stroke();
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                            }
                        },
                        "$": ""
                    },
                    "rect": {
                        "name": "pygame:draw.rect",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [4],
                            "method": function () {
                                let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                let width = buffer;
                                if (width.value % 1 !== 0) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Global || buffer.value.name !== "pygame:Rect@instance") {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                let rect = buffer;
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Tuple) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                let color = buffer;
                                if (color.value.length != 3) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                for (let i = 0; i < 3; i++) {
                                    if (color.value[i].type != PyObjectType.Int) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                    }
                                    if (color.value[i].value % 1 !== 0) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                    }
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Global) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                let surface = buffer;
                                rect.py_attr_get("x");
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                let rX = buffer.value;
                                rect.py_attr_get("y");
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                let rY = buffer.value;
                                rect.py_attr_get("w");
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                let rW = buffer.value;
                                rect.py_attr_get("h");
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                }
                                let rH = buffer.value;
                                let ctx;
                                if (surface.value.name === "pygame:display.screenSurface@instance") {
                                    ctx = RequireNotEmpty(WorkerMessageChannel.internal.pen);
                                }
                                else if (surface.value.name === "pygame:Surface@instance") {
                                    ctx = surface.storage;
                                }
                                else {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.rect', PyObjectMethods.py_function_call)));
                                    return;
                                }
                                ctx.beginPath();
                                ctx.moveTo(rX, rY);
                                ctx.lineTo(rX + rW, rY);
                                ctx.lineTo(rX + rW, rY + rH);
                                ctx.lineTo(rX, rY + rH);
                                ctx.closePath();
                                ctx.fillStyle = StringFormat("rgb({},{},{})", [
                                    color.value[0].value.toString(),
                                    color.value[1].value.toString(),
                                    color.value[2].value.toString()
                                ]);
                                ctx.fill();
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                            }
                        },
                        "$": ""
                    }
                },
                "$": ""
            },
            "time": {
                "name": "pygame:time",
                "attr": {
                    "get_ticks": {
                        "name": "pygame:time.get_ticks",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [0],
                            "method": function () {
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(new Date().getTime()));
                            }
                        },
                        "$": ""
                    },
                    "Clock": {
                        "name": "pygame:time.Clock",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [0],
                            "method": function () {
                                let lastTickTime = new Date();
                                PythonRuntime.storage.varStack.push(new PyObjectGlobal({
                                    "name": "pygame.time.Clock@instance",
                                    "attr": {
                                        "tick": {
                                            "name": "pygame.time.Clock@instance.tick",
                                            "attr": {},
                                            "py_function_call": {
                                                "argNum": [1],
                                                "method": function () {
                                                    let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                                    if (PyObject0.type != PyObjectType.Int) {
                                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'time.Clock@instance.tick', PyObjectMethods.py_function_call)));
                                                    }
                                                    let currentTime = new Date();
                                                    if (currentTime.getTime() - lastTickTime.getTime() > 1000 / PyObject0.value) {
                                                        WorkerMessageChannel.postMessage({
                                                            "messageType": WorkerMessageChannel.MessageType.W2M.Console.Stdout,
                                                            "messageBody": StringFormat("WebPygame renderer cann't keep up! The current frame cost {}ms to render ({}FPS), which is longer than the maximum render time {}ms.\n", [Math.floor(currentTime.getTime() - lastTickTime.getTime()).toString(), (Math.floor(10000 / (currentTime.getTime() - lastTickTime.getTime())) / 10).toString(), Math.floor(1000 / PyObject0.value).toString()])
                                                        });
                                                        WorkerMessageChannel.postMessage({
                                                            "messageType": WorkerMessageChannel.MessageType.W2M.Console.Flush,
                                                            "messageBody": null
                                                        });
                                                    }
                                                    else {
                                                        WorkerMessageChannel.pumpMessages();
                                                        currentTime = new Date();
                                                        while (currentTime.getTime() - lastTickTime.getTime() < 1000 / PyObject0.value) {
                                                            currentTime = new Date();
                                                        }
                                                    }
                                                    lastTickTime = currentTime;
                                                    PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                                                }
                                            },
                                            "$": ""
                                        }
                                    },
                                    "$": ""
                                }));
                            }
                        },
                        "$": "",
                    }
                },
                "$": "",
            },
            "event": {
                "name": "pygame:event",
                "attr": {
                    "get": {
                        "name": "pygame:event.get",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [0],
                            "method": function () {
                                let events = new PyObjectList(0);
                                let event;
                                while (true) {
                                    event = WorkerMessageChannel.getMessage();
                                    if (event == null) {
                                        break;
                                    }
                                    switch (event.messageType) {
                                        case WorkerMessageChannel.MessageType.M2W.Keyboard.KeyDown: {
                                            let key = -1;
                                            switch (event.messageBody.key) {
                                                case "ArrowUp": {
                                                    key = 1073741906;
                                                    break;
                                                }
                                                case "ArrowDown": {
                                                    key = 1073741905;
                                                    break;
                                                }
                                                case "ArrowLeft": {
                                                    key = 1073741904;
                                                    break;
                                                }
                                                case "ArrowRight": {
                                                    key = 1073741903;
                                                    break;
                                                }
                                            }
                                            if (key != -1) {
                                                events.value.push(new PyObjectGlobal({
                                                    "name": "pygame:event.KeyDownEvent@instance",
                                                    "attr": {
                                                        "type": PyObjectFactory.constructPyObjectInt(768),
                                                        "key": PyObjectFactory.constructPyObjectInt(key)
                                                    },
                                                    "$": ""
                                                }));
                                            }
                                            break;
                                        }
                                        case WorkerMessageChannel.MessageType.M2W.Keyboard.KeyUp: {
                                            let key = -1;
                                            switch (event.messageBody.key) {
                                                case "ArrowUp": {
                                                    key = 1073741906;
                                                    break;
                                                }
                                                case "ArrowDown": {
                                                    key = 1073741905;
                                                    break;
                                                }
                                                case "ArrowLeft": {
                                                    key = 1073741904;
                                                    break;
                                                }
                                                case "ArrowRight": {
                                                    key = 1073741903;
                                                    break;
                                                }
                                            }
                                            if (key != -1) {
                                                events.value.push(new PyObjectGlobal({
                                                    "name": "pygame:event.KeyDownEvent@instance",
                                                    "attr": {
                                                        "type": PyObjectFactory.constructPyObjectInt(769),
                                                        "key": PyObjectFactory.constructPyObjectInt(key)
                                                    },
                                                    "$": ""
                                                }));
                                            }
                                            break;
                                        }
                                        case WorkerMessageChannel.MessageType.M2W.Mouse.MouseDown: {
                                            let pos = new PyObjectTuple(0);
                                            pos.value.push(PyObjectFactory.constructPyObjectInt(event.messageBody.pos[0]));
                                            pos.value.push(PyObjectFactory.constructPyObjectInt(event.messageBody.pos[1]));
                                            events.value.push(new PyObjectGlobal({
                                                "name": "pygame:event.MouseDownEvent@instance",
                                                "attr": {
                                                    "type": PyObjectFactory.constructPyObjectInt(1025),
                                                    "pos": pos
                                                },
                                                "$": ""
                                            }));
                                            break;
                                        }
                                        case WorkerMessageChannel.MessageType.M2W.Mouse.MouseUp: {
                                            events.value.push(new PyObjectGlobal({
                                                "name": "pygame:event.MouseDownEvent@instance",
                                                "attr": {
                                                    "type": PyObjectFactory.constructPyObjectInt(1026),
                                                },
                                                "$": ""
                                            }));
                                            break;
                                        }
                                    }
                                }
                                PythonRuntime.storage.varStack.push(events);
                            }
                        },
                        "$": ""
                    }
                },
                "$": ""
            }
        },
        "$": ""
    },
    'sys': {
        'name': 'sys',
        'attr': {
            'exit': {
                'name': 'sys:exit',
                'attr': {},
                'py_function_call': {
                    'argNum': [0, 1],
                    'method': function (argNum) {
                        let PyObject0 = PyObjectFactory.constructPyObjectNone();
                        if (argNum === 1) {
                            PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        }
                        while (true) {
                            debugger;
                        }
                    }
                },
                "$": ""
            }
        },
        "$": ""
    },
    'random': {
        'name': 'random',
        'attr': {
            'random': {
                'name': 'random:random',
                'attr': {},
                'py_function_call': {
                    'argNum': [0],
                    'method': function () {
                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(Math.random()));
                    }
                },
                "$": ""
            },
            'randint': {
                'name': 'random:randint',
                'attr': {},
                'py_function_call': {
                    'argNum': [2],
                    'method': function () {
                        let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        if (PyObject0.type != PyObjectType.Int || PyObject1.type != PyObjectType.Int) {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('random', 'randint', PyObjectMethods.py_function_call)));
                        }
                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(Math.floor(Math.random() * (PyObject0.value - PyObject1.value + 1) + PyObject1.value)));
                    }
                },
                "$": ""
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
class AbstractBytecodeRunnerResult {
}
class BytecodeRunnerNextResult extends AbstractBytecodeRunnerResult {
}
var BytecodeRunnerNextResultInstance = new BytecodeRunnerNextResult();
class BytecodeRunnerJumpResult extends AbstractBytecodeRunnerResult {
    constructor(commandIndex) {
        super();
        this.commandIndex = commandIndex;
    }
}
class BytecodeRunnerReturnResult extends AbstractBytecodeRunnerResult {
    constructor(returnValue) {
        super();
        this.returnValue = returnValue;
    }
}
class BytecodeRunnerExtendArgResult extends AbstractBytecodeRunnerResult {
    constructor(extendedArg) {
        super();
        this.extendedArg = extendedArg;
    }
}
class AbstractBytecodeRunnerSignal {
}
class BytecodeRunnerExitSIgnal extends AbstractBytecodeRunnerSignal {
    constructor(exitCode) {
        super();
        this.exitCode = exitCode;
    }
}
class BytecodeRunnerFatalErrorSignal extends AbstractBytecodeRunnerSignal {
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
            for (let i = 0; i < PythonBytecode.codeObjectList[commandEnv].varList.length; i++) {
                newVarList.push(null);
            }
            PythonRuntime.storage.varList.push(newVarList);
            let newCellVarList = [];
            for (let i = 0; i < PythonBytecode.codeObjectList[commandEnv].cellVarList.length; i++) {
                let PyObject0;
                newCellVarList.push(new PyObjectStoragePointer(() => {
                    return PyObject0;
                }, (PyObject1) => {
                    PyObject0 = PyObject1;
                }));
            }
            PythonRuntime.storage.cellVarList.push(newCellVarList);
            let newGlobalVarList = [];
            for (let i = 0; i < PythonBytecode.codeObjectList[commandEnv].globalList.length; i++) {
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
            case 24: {
                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                PyObject0.py_binary_subtract(PyObject1);
                return BytecodeRunnerNextResultInstance;
            }
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
                PyObject0.py_attr_set(PythonBytecode.codeObjectList[commandEnv].globalList[commandArg]);
                return BytecodeRunnerNextResultInstance;
            }
            case 100: {
                PythonRuntime.storage.varStack.push(PythonBytecode.codeObjectList[commandEnv].constList[commandArg]);
                return BytecodeRunnerNextResultInstance;
            }
            case 101: {
                let PyObject0 = PythonRuntime.storage.globalVarList[PythonRuntime.storage.stackPointer - 1][commandArg];
                if (PyObject0 === undefined || PyObject0 === null) {
                    let globalObjectName = PythonBytecode.codeObjectList[commandEnv].globalList[commandArg];
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
                PyObject0.py_attr_get(PythonBytecode.codeObjectList[commandEnv].globalList[commandArg]);
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
                let globalObjectName = PythonBytecode.codeObjectList[commandEnv].globalList[commandArg];
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
                if (PyObject0.value === false) {
                    return new BytecodeRunnerJumpResult(commandArg);
                }
                else {
                    return BytecodeRunnerNextResultInstance;
                }
            }
            case 115: {
                RequireNotEmpty(PythonRuntime.storage.varStack.pop()).py_bool();
                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                if (PyObject0.value === true) {
                    return new BytecodeRunnerJumpResult(commandArg);
                }
                else {
                    return BytecodeRunnerNextResultInstance;
                }
            }
            case 116: {
                let globalObjectName = PythonBytecode.codeObjectList[commandEnv].globalList[commandArg];
                let globalVariableIndex = PythonBytecode.codeObjectList[0].globalList.indexOf(globalObjectName);
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
                        ;
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
                let cellVarStack = PythonRuntime.storage.stackPointer - 1;
                let cellVarPointer = commandArg;
                PythonRuntime.storage.varStack.push(new PyObjectStoragePointer(() => {
                    let stack = PythonRuntime.storage.cellVarList[cellVarStack];
                    if (stack == undefined || stack == null) {
                        return null;
                    }
                    return RequireNotEmpty(stack[cellVarPointer]).get();
                }, (PyObject0) => {
                    let stack = PythonRuntime.storage.cellVarList[cellVarStack];
                    if (stack == undefined || stack == null) {
                        return;
                    }
                    RequireNotEmpty(stack[cellVarPointer]).set(PyObject0);
                }));
                return BytecodeRunnerNextResultInstance;
            }
            case 136: {
                let cellVars = PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 1][commandArg];
                if (cellVars == null) {
                    PythonRuntime.storage.pyError.write(new PyObjectNameError(new PyErrorInformation("python", "$BytecodeRunner$.Runner.LoadDeref", PyObjectMethods.py_internal)));
                }
                PythonRuntime.storage.varStack.push(RequireNotEmpty(cellVars).get());
                return BytecodeRunnerNextResultInstance;
            }
            case 137: {
                RequireNotEmpty(PythonRuntime.storage.cellVarList[PythonRuntime.storage.stackPointer - 1][commandArg]).set(RequireNotEmpty(PythonRuntime.storage.varStack.pop()));
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
                PyObject0.py_method_load(PythonBytecode.codeObjectList[commandEnv].globalList[commandArg]);
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
        while (commandIndex >= 0 && commandIndex < PythonBytecode.codeObjectList[commandEnv].opList.length) {
            WorkerMessageChannel.pumpMessages();
            let commandName = PythonBytecode.codeObjectList[commandEnv].opList[commandIndex];
            let commandArg = (extendedArg << 8) | PythonBytecode.codeObjectList[commandEnv].opList[commandIndex + 1];
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
                if (!(error instanceof AbstractBytecodeRunnerSignal)) {
                    throw error;
                }
                else if (error instanceof BytecodeRunnerFatalErrorSignal) {
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
WorkerMessageChannel.run((exitCallback) => {
    (() => __awaiter(this, void 0, void 0, function* () {
        PythonBytecode = yield (yield fetch("bytecode.json")).json();
    }))().then(() => {
        PythonRuntime.storage.newStack(0);
        for (let codeObjectIndex = 0; codeObjectIndex < PythonBytecode.codeObjectList.length; codeObjectIndex++) {
            for (let constIndex = 0; constIndex < PythonBytecode.codeObjectList[codeObjectIndex].constList.length; constIndex++) {
                let constValue = PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex].value;
                switch (PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex].type) {
                    case 'Number': {
                        if (typeof constValue !== "number") {
                            throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.Number.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof constValue, constIndex.toString(), codeObjectIndex.toString()]));
                        }
                        PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectInt(constValue);
                        break;
                    }
                    case 'String': {
                        if (typeof constValue !== "string") {
                            throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.String.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof constValue, constIndex.toString(), codeObjectIndex.toString()]));
                        }
                        PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex] = new PyObjectString(constValue);
                        break;
                    }
                    case 'Bool': {
                        if (typeof constValue !== "number") {
                            throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.Bool.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof constValue, constIndex.toString(), codeObjectIndex.toString()]));
                        }
                        PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectBool(constValue === 1);
                        break;
                    }
                    case 'None': {
                        PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectNone();
                        break;
                    }
                    case 'Code': {
                        if (typeof constValue !== "number") {
                            throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.Code.IllegalData", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof constValue, constIndex.toString(), codeObjectIndex.toString()]));
                        }
                        PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex] = PyObjectFactory.constructPyObjectCode(constValue);
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
                        decoder(PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex].value);
                        PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex] = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        break;
                    }
                    default: {
                        throw new BytecodeRunnerFatalErrorSignal("BytecodeRunner.Constants.UnknownType", StringFormat("Unknown data type {} in constant #{} in code #{}.", [typeof PythonBytecode.codeObjectList[codeObjectIndex].constList[constIndex].type, constIndex.toString(), codeObjectIndex.toString()]));
                    }
                }
            }
        }
        let startTime = new Date();
        let success = false;
        try {
            PythonRuntime.runCodeObject(0, 0, 0);
            success = true;
        }
        catch (error) {
            if (error instanceof BytecodeRunnerPyErrorSignal) {
                let time = new Date().getTime() - startTime.getTime();
                let pyError = RequireNotEmpty(PythonRuntime.storage.pyError.value).value;
                let pyErrorType;
                let pyErrorProto = RequireNotEmpty(PythonRuntime.storage.pyError.value).__proto__;
                if (pyErrorProto == null || pyErrorProto == undefined ||
                    pyErrorProto.constructor == null || pyErrorProto.constructor == undefined ||
                    typeof pyErrorProto.constructor.name != "string") {
                    pyErrorType = "UNKNOWN";
                }
                else {
                    pyErrorType = pyErrorProto.constructor.name;
                }
                WorkerMessageChannel.postMessage({
                    "messageType": WorkerMessageChannel.MessageType.W2M.Console.Stdout,
                    "messageBody": StringFormat("An uncaught python exception encountered.\n" +
                        "{}: In {}:{}#{}\n" +
                        "[Finished in {} ms with code 0]", [pyErrorType, pyError.namespace, pyError.className, pyError.methodName.description == undefined ? "UNKNOWN" : pyError.methodName.description, time.toString()])
                });
                exitCallback(1);
            }
            else {
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
                WorkerMessageChannel.postMessage({
                    "messageType": WorkerMessageChannel.MessageType.W2M.Console.Stdout,
                    "messageBody": StringFormat("# An fatal error encountered. Python Virtual Machine will shut down forcely.\n" +
                        "# [{}]: {}\n" +
                        "# Please report this bug to the developer.", [place, msg])
                });
                exitCallback(1);
            }
        }
        if (success == true) {
            let time = new Date().getTime() - startTime.getTime();
            let returnValue = PythonRuntime.storage.varStack.pop();
            if (returnValue == null || returnValue == undefined || returnValue.type == PyObjectType.None) {
                WorkerMessageChannel.postMessage({
                    "messageType": WorkerMessageChannel.MessageType.W2M.Console.Stdout,
                    "messageBody": StringFormat("[Finished in {} ms with code 0]", [time.toString()])
                });
                exitCallback(0);
            }
            else if (returnValue.type == PyObjectType.Int) {
                WorkerMessageChannel.postMessage({
                    "messageType": WorkerMessageChannel.MessageType.W2M.Console.Stdout,
                    "messageBody": StringFormat("[Finished in {} ms with code {}]", [time.toString(), returnValue.value.toString()])
                });
                exitCallback(returnValue.value);
            }
            else {
                WorkerMessageChannel.postMessage({
                    "messageType": WorkerMessageChannel.MessageType.W2M.Console.Stdout,
                    "messageBody": StringFormat("[Finished in {} ms with code 1]", [time.toString()])
                });
                exitCallback(0);
            }
        }
    });
});
