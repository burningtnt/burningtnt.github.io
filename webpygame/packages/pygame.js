"use strict";
let KEY_CODES = {
    "QUIT": PyObjectFactory.constructPyObjectInt(256),
    "KEYDOWN": PyObjectFactory.constructPyObjectInt(768),
    "KEYUP": PyObjectFactory.constructPyObjectInt(769),
    "K_RETURN": PyObjectFactory.constructPyObjectInt(13),
    "K_LEFT": PyObjectFactory.constructPyObjectInt(1073741904),
    "K_RIGHT": PyObjectFactory.constructPyObjectInt(1073741903),
    "K_UP": PyObjectFactory.constructPyObjectInt(1073741906),
    "K_DOWN": PyObjectFactory.constructPyObjectInt(1073741905),
    "MOUSEBUTTONDOWN": PyObjectFactory.constructPyObjectInt(1025),
    "MOUSEBUTTONUP": PyObjectFactory.constructPyObjectInt(1026),
};
let BROWSER_KEY_CODES = {
    "ArrowUp": 1073741906,
    "ArrowDown": 1073741905,
    "ArrowLeft": 1073741904,
    "ArrowRight": 1073741903,
    "Enter": 13
};
let constructSurface = function (ctx) {
    return new PyObjectGlobal({
        "name": "pygame:Surface@instance",
        "attr": {
            "set_colorkey": {
                "name": "pygame:Surface@instance.set_colorkey",
                "attr": {},
                "py_function_call": {
                    "argNum": [1],
                    "method": function () {
                        let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        if (buffer.type != PyObjectType.Tuple) {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                        }
                        let pos = buffer;
                        if (pos.value.length != 3) {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                        }
                        for (let i = 0; i < 3; i++) {
                            if (pos.value[i].type != PyObjectType.Int) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'display.screenSurface@instance.blit', PyObjectMethods.py_function_call)));
                            }
                        }
                        let r = Math.floor(pos.value[0].value);
                        let g = Math.floor(pos.value[1].value);
                        let b = Math.floor(pos.value[2].value);
                        let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                        let data = imageData.data;
                        for (let i = 0; i < data.length; i += 4) {
                            if (data[i] === r && data[i + 1] === g && data[i + 2] === b) {
                                data[i + 3] = 0;
                            }
                            else {
                                data[i + 3] = 255;
                            }
                        }
                        ctx.putImageData(imageData, 0, 0);
                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                    }
                },
                "$": ""
            },
            "blit": {
                "name": "pygame:Surface@instance.blit",
                "attr": {},
                "py_function_call": {
                    "argNum": [2, 3],
                    "method": function (argNum) {
                        let buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        let sourceRect = null;
                        if (argNum == 3) {
                            if (buffer.type != PyObjectType.Tuple) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.blit', PyObjectMethods.py_function_call)));
                            }
                            sourceRect = buffer;
                            if (sourceRect.value.length != 4) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.blit', PyObjectMethods.py_function_call)));
                            }
                            for (let i = 0; i < 4; i++) {
                                if (sourceRect.value[i].type != PyObjectType.Int) {
                                    PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.blit', PyObjectMethods.py_function_call)));
                                }
                                sourceRect.value[i] = PyObjectFactory.constructPyObjectInt(Math.floor(sourceRect.value[i].value));
                            }
                            buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        }
                        if (buffer.type != PyObjectType.Tuple) {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.blit', PyObjectMethods.py_function_call)));
                        }
                        let pos = buffer;
                        if (pos.value.length != 2) {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.blit', PyObjectMethods.py_function_call)));
                        }
                        for (let i = 0; i < 2; i++) {
                            if (pos.value[i].type != PyObjectType.Int) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.blit', PyObjectMethods.py_function_call)));
                            }
                            pos.value[i] = PyObjectFactory.constructPyObjectInt(Math.floor(pos.value[i].value));
                        }
                        buffer = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                        if (buffer.type != PyObjectType.Global) {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.blit', PyObjectMethods.py_function_call)));
                            return;
                        }
                        let surface = buffer;
                        let ctx2;
                        if (surface.value.name === "pygame:Surface@instance") {
                            ctx2 = surface.storage;
                        }
                        else {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.blit', PyObjectMethods.py_function_call)));
                            return;
                        }
                        if (argNum == 3) {
                            ctx.drawImage(ctx2.canvas, sourceRect.value[0].value, sourceRect.value[1].value, sourceRect.value[2].value, sourceRect.value[3].value, pos.value[0].value, pos.value[1].value, sourceRect.value[2].value, sourceRect.value[3].value);
                        }
                        else {
                            ctx.drawImage(ctx2.canvas, pos.value[0].value, pos.value[1].value);
                        }
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
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.fill', PyObjectMethods.py_function_call)));
                        }
                        if (PyObject0.value.length != 3) {
                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.fill', PyObjectMethods.py_function_call)));
                        }
                        for (let i = 0; i < 3; i++) {
                            if (PyObject0.value[i].type != PyObjectType.Int) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.fill', PyObjectMethods.py_function_call)));
                            }
                            if (PyObject0.value[i].value % 1 !== 0) {
                                PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'Surface@instance.fill', PyObjectMethods.py_function_call)));
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
    }, ctx);
};
PythonPacakgeHelper.definePackage({
    "id": "pygame",
    "dependencies": [],
    "onRegisterGlobalPyObject": () => {
        return {
            'pygame': {
                'name': 'pygame',
                'attr': {
                    ...KEY_CODES,
                    'init': {
                        'name': 'pygame:init',
                        'attr': {},
                        'py_function_call': {
                            'argNum': [0],
                            'attr': {},
                            'method': function () {
                                let PyObject0 = new PyObjectTuple(0);
                                PyObject0.value = [PyObjectFactory.constructPyObjectInt(0), PyObjectFactory.constructPyObjectInt(0)];
                                PythonRuntime.storage.varStack.push(PyObject0);
                            }
                        },
                        "$": ""
                    },
                    "image": {
                        "name": "pygame:image",
                        "attr": {
                            "load": {
                                "name": "pygame:image.load",
                                "attr": {},
                                "py_function_call": {
                                    "argNum": [1],
                                    "method": function () {
                                        let path = RequireNotEmpty(PythonRuntime.storage.varStack.pop());
                                        if (path.type != PyObjectType.String) {
                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation("pygame", "pygame:image.load", PyObjectMethods.py_function_call)));
                                        }
                                        let request = new XMLHttpRequest();
                                        request.responseType = "arraybuffer";
                                        request.open("GET", "resources/" + path.value + "?mode=image.pixel_array", false);
                                        request.send();
                                        let buffer = new Uint8ClampedArray(request.response);
                                        for (let i = 7; i < buffer.length; i += 4) {
                                            buffer[i] = 255;
                                        }
                                        let image = new ImageData(buffer.slice(4), (buffer[0] << 24) + (buffer[1] << 16) + (buffer[2] << 8) + buffer[3]);
                                        let ctx = RequireNotEmpty(new OffscreenCanvas(image.width, image.height).getContext("2d"));
                                        ctx.putImageData(image, 0, 0);
                                        PythonRuntime.storage.varStack.push(constructSurface(ctx));
                                    }
                                },
                                "$": ""
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
                                                            AppWorker.getInstance().getContext2D().font = font.storage.toString() + "px sans-serif";
                                                            let ctx = RequireNotEmpty(new OffscreenCanvas(AppWorker.getInstance().getContext2D().measureText(text.value).width, font.storage).getContext("2d"));
                                                            ctx.fillStyle = StringFormat("rgb({},{},{})", [
                                                                color.value[0].value.toString(),
                                                                color.value[1].value.toString(),
                                                                color.value[2].value.toString()
                                                            ]);
                                                            ctx.textBaseline = 'top';
                                                            ctx.font = font.storage.toString() + "px sans-serif";
                                                            ctx.fillText(text.value, 0, 0);
                                                            PythonRuntime.storage.varStack.push(constructSurface(ctx));
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
                                        if (AppWorker.getInstance().getCanvas().width != PyObject0.value[0].value) {
                                            PythonRuntime.storage.pyError.write(new PyObjectValueError(new PyErrorInformation('pygame', 'display.set_mode', PyObjectMethods.py_function_call)));
                                        }
                                        if (AppWorker.getInstance().getCanvas().height != PyObject0.value[1].value) {
                                            PythonRuntime.storage.pyError.write(new PyObjectValueError(new PyErrorInformation('pygame', 'display.set_mode', PyObjectMethods.py_function_call)));
                                        }
                                        PythonRuntime.storage.varStack.push(constructSurface(AppWorker.getInstance().getContext2D()));
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
                                        AppWorker.getInstance().postMessage({
                                            'messageType': MessageType.W2M.GUI.SetTitle,
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
                                    "method": () => {
                                        AppWorker.getInstance().commitUI();
                                        performance.mark("WebPygame Renderer Commit Action");
                                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectNone());
                                    }
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
                                        if (surface.value.name === "pygame:Surface@instance") {
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
                                        if (surface.value.name === "pygame:Surface@instance") {
                                            ctx = surface.storage;
                                        }
                                        else {
                                            PythonRuntime.storage.pyError.write(new PyObjectTypeError(new PyErrorInformation('pygame', 'draw.lined', PyObjectMethods.py_function_call)));
                                            return;
                                        }
                                        ctx.beginPath();
                                        if (points.value.length > 0) {
                                            AppWorker.getInstance().getContext2D().moveTo(Math.floor(points.value[0].value[0].value), Math.floor(points.value[0].value[1].value));
                                            for (let i = 1; i < points.value.length; i++) {
                                                AppWorker.getInstance().getContext2D().lineTo(Math.floor(points.value[i].value[0].value), Math.floor(points.value[i].value[1].value));
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
                                        if (surface.value.name === "pygame:Surface@instance") {
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
                                        PythonRuntime.storage.varStack.push(PyObjectFactory.constructPyObjectInt(performance.now()));
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
                                        let lastTickTime = performance.now();
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
                                                            let currentTime = performance.now();
                                                            if (currentTime - lastTickTime > 1000 / PyObject0.value) {
                                                                AppWorker.getInstance().postMessage({
                                                                    "messageType": MessageType.W2M.Console.Stdout,
                                                                    "messageBody": StringFormat("WebPygame renderer cann't keep up! The current frame cost {}ms to render ({}FPS), which is longer than the maximum render time {}ms.\n", [Math.floor(currentTime - lastTickTime).toString(), (Math.floor(10000 / (currentTime - lastTickTime)) / 10).toString(), Math.floor(1000 / PyObject0.value).toString()])
                                                                });
                                                                AppWorker.getInstance().postMessage({
                                                                    "messageType": MessageType.W2M.Console.Flush,
                                                                    "messageBody": null
                                                                });
                                                            }
                                                            else {
                                                                AppWorker.getInstance().pumpMessages();
                                                                currentTime = performance.now();
                                                                while (currentTime - lastTickTime < 1000 / PyObject0.value) {
                                                                    currentTime = performance.now();
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
                                            event = AppWorker.getInstance().getMessage();
                                            if (event == null) {
                                                break;
                                            }
                                            switch (event.messageType) {
                                                case MessageType.M2W.Keyboard.KeyDown: {
                                                    let key = BROWSER_KEY_CODES[event.messageBody.key];
                                                    if (key !== undefined) {
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
                                                case MessageType.M2W.Keyboard.KeyUp: {
                                                    let key = BROWSER_KEY_CODES[event.messageBody.key];
                                                    if (key !== undefined) {
                                                        events.value.push(new PyObjectGlobal({
                                                            "name": "pygame:event.KeyUpEvent@instance",
                                                            "attr": {
                                                                "type": KEY_CODES.KEYUP,
                                                                "key": PyObjectFactory.constructPyObjectInt(key)
                                                            },
                                                            "$": ""
                                                        }));
                                                    }
                                                    break;
                                                }
                                                case MessageType.M2W.Mouse.MouseDown: {
                                                    let pos = new PyObjectTuple(0);
                                                    let pos0 = event.messageBody.pos;
                                                    pos.value = [
                                                        PyObjectFactory.constructPyObjectInt(pos0[0]),
                                                        PyObjectFactory.constructPyObjectInt(pos0[1])
                                                    ];
                                                    events.value.push(new PyObjectGlobal({
                                                        "name": "pygame:event.MouseDownEvent@instance",
                                                        "attr": {
                                                            "type": KEY_CODES.MOUSEBUTTONDOWN,
                                                            "pos": pos
                                                        },
                                                        "$": ""
                                                    }));
                                                    break;
                                                }
                                                case MessageType.M2W.Mouse.MouseUp: {
                                                    events.value.push(new PyObjectGlobal({
                                                        "name": "pygame:event.MouseDownEvent@instance",
                                                        "attr": {
                                                            "type": KEY_CODES.MOUSEBUTTONUP,
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
            }
        };
    }
});
