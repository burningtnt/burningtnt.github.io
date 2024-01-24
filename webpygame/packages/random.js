"use strict";
PythonPacakgeHelper.definePackage({
    "id": "random",
    "dependencies": [],
    "onRegisterGlobalPyObject": () => {
        return {
            "random": {
                "name": "random",
                "attr": {
                    "random": {
                        "name": "random:random",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [0],
                            "method": function () {
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(Math.random()));
                            }
                        },
                        "$": ""
                    },
                    "randint": {
                        "name": "random:randint",
                        "attr": {},
                        "py_function_call": {
                            "argNum": [2],
                            "method": function () {
                                let PyObject0 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                let PyObject1 = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                if (PyObject0.type != PyObjectType.Int || PyObject1.type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("random", "randint", PyObjectMethods.py_function_call)));
                                }
                                PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(Math.floor(Math.random() * (PyObject0.value - PyObject1.value + 1) + PyObject1.value)));
                            }
                        },
                        "$": ""
                    }
                },
                "$": ""
            },
        };
    }
});
