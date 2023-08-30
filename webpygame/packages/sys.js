"use strict";
Object.assign(PythonBuiltin, {
    "sys": {
        "name": "sys",
        "attr": {
            "exit": {
                "name": "sys:exit",
                "attr": {},
                "py_function_call": {
                    "argNum": [0, 1],
                    "method": function (argNum) {
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
});
