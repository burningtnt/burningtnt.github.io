"use strict";
Object.assign(PythonBuiltin, {
    "webpygame": {
        "name": "webpygame",
        "attr": {
            "platform": {
                "name": "webpygame:platform",
                "attr": {
                    "webpygame:platform.getCurrentPlatform": {
                        "name": "webpygame:platform.getCurrentPlatform",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [0],
                            "method": function () {
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectString("Web.PC:Unknown"));
                            }
                        },
                        "$": ""
                    },
                    "debuggerPause": {
                        "name": "webpygame:platform.debuggerPause",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [0],
                            "method": function () {
                                debugger;
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                            }
                        },
                        "$": ""
                    }
                },
                "$": ""
            },
            "render": {
                "name": "webpygame:render",
                "attr": {
                    "renderText": {
                        "name": "webpygame:render.renderText",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [5],
                            "method": function () {
                                let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                }
                                let size = buffer;
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Tuple) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                }
                                let color = buffer;
                                if (color.value.length != 3) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                }
                                for (let i = 0; i < 3; i++) {
                                    if (color.value[i].type != PyObjectType.Int) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                    }
                                    if (color.value[i].value % 1 !== 0) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                    }
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Tuple) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                }
                                let pos = buffer;
                                if (pos.value.length != 2) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                }
                                for (let i = 0; i < 2; i++) {
                                    if (pos.value[i].type != PyObjectType.Int) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                    }
                                    if (pos.value[i].value % 1 !== 0) {
                                        PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                    }
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.Global) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                    return;
                                }
                                let surface = buffer;
                                let ctx;
                                if (surface.value.name === "pygame:display.screenSurface@instance") {
                                    ctx = AppWorker.getInstance().getContext2D();
                                }
                                else if (surface.value.name === "pygame:Surface@instance") {
                                    ctx = surface.storage;
                                }
                                else {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                    return;
                                }
                                buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (buffer.type != PyObjectType.String) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "webpygame:render.renderText", PyObjectMethods.py_function_call)));
                                }
                                let text = buffer;
                                ctx.font = size.value.toString() + "px sans-serif";
                                ctx.fillStyle = StringFormat("rgb({},{},{})", [
                                    color.value[0].value.toString(),
                                    color.value[1].value.toString(),
                                    color.value[2].value.toString()
                                ]);
                                ctx.textBaseline = "top";
                                ctx.fillText(text.value, pos.value[0].value, pos.value[1].value);
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
    }
});
