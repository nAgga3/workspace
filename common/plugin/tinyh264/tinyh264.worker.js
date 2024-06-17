(function (modules) { // webpackBootstrap
    // The module cache
    var installedModules = {};

    // The require function
    function __webpack_require__(moduleId) {

        // Check if module is in cache
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // Create a new module (and put it into the cache)
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };

        // Execute the module function
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // Flag the module as loaded
        module.l = true;

        // Return the exports of the module
        return module.exports;
    }


    // expose the modules object (__webpack_modules__)
    __webpack_require__.m = modules;

    // expose the module cache
    __webpack_require__.c = installedModules;

    // define getter function for harmony exports
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };

    // define __esModule on exports
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };

    // create a fake namespace object
    // mode & 1: value is a module id, require it
    // mode & 2: merge all properties of value into the ns
    // mode & 4: return value when already ns object
    // mode & 8|1: behave like require
    __webpack_require__.t = function (value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
        return ns;
    };

    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = function (module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    // Object.prototype.hasOwnProperty.call
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

    // __webpack_public_path__
    __webpack_require__.p = "";


    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = 1);
})
    /************************************************************************/
    ([
/* 0 */
/***/ (function (module, exports, __webpack_require__) {

            var Module = function () {
                var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;

                return function (Module) {
                    Module = Module || {};
                    var
                        /** @type {{
                        noImageDecoding: boolean,
                        noAudioDecoding: boolean,
                        canvas: HTMLCanvasElement,
                        dataFileDownloads: Object,
                        preloadResults: Object
                        }}
                        */
                        Module;
                    if (!Module)
                        /** @suppress{checkTypes}*/
                        Module = typeof Module !== 'undefined' ? Module : {};
                    var moduleOverrides = {};
                    var key;

                    for (key in Module) {
                        if (Module.hasOwnProperty(key)) {
                            moduleOverrides[key] = Module[key];
                        }
                    }

                    var arguments_ = [];
                    var thisProgram = "./this.program";

                    var quit_ = function quit_(status, toThrow) {
                        throw toThrow;
                    };

                    var ENVIRONMENT_IS_WEB = false;
                    var ENVIRONMENT_IS_WORKER = true;
                    var scriptDirectory = "";

                    function locateFile(path) {
                        if (Module["locateFile"]) {
                            return Module["locateFile"](path, scriptDirectory);
                        }

                        return scriptDirectory + path;
                    }

                    var read_, readAsync, readBinary, setWindowTitle;

                    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                        if (ENVIRONMENT_IS_WORKER) {
                            scriptDirectory = self.location.href;
                        } else if (document.currentScript) {
                            scriptDirectory = document.currentScript.src;
                        }

                        if (_scriptDir) {
                            scriptDirectory = _scriptDir;
                        }

                        if (scriptDirectory.indexOf("blob:") !== 0) {
                            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
                        } else {
                            scriptDirectory = "";
                        }

                        {
                            /**
                            * @license
                            * Copyright 2019 The Emscripten Authors
                            * SPDX-License-Identifier: MIT
                            */
                            read_ = function shell_read(url) {
                                var xhr = new XMLHttpRequest();
                                xhr.open("GET", url, false);
                                xhr.send(null);
                                return xhr.responseText;
                            };

                            if (ENVIRONMENT_IS_WORKER) {
                                readBinary = function readBinary(url) {
                                    var xhr = new XMLHttpRequest();
                                    xhr.open("GET", url, false);
                                    xhr.responseType = "arraybuffer";
                                    xhr.send(null);
                                    return new Uint8Array(
                                        /** @type{!ArrayBuffer} */
                                        xhr.response);
                                };
                            }

                            readAsync = function readAsync(url, onload, onerror) {
                                var xhr = new XMLHttpRequest();
                                xhr.open("GET", url, true);
                                xhr.responseType = "arraybuffer";

                                xhr.onload = function xhr_onload() {
                                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                                        onload(xhr.response);
                                        return;
                                    }

                                    onerror();
                                };

                                xhr.onerror = onerror;
                                xhr.send(null);
                            };
                        }

                        setWindowTitle = function setWindowTitle(title) {
                            document.title = title;
                        };
                    } else { }

                    var out = Module["print"] || console.log.bind(console);
                    var err = Module["printErr"] || console.warn.bind(console);

                    for (key in moduleOverrides) {
                        if (moduleOverrides.hasOwnProperty(key)) {
                            Module[key] = moduleOverrides[key];
                        }
                    }

                    moduleOverrides = null;
                    if (Module["arguments"]) arguments_ = Module["arguments"];
                    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
                    if (Module["quit"]) quit_ = Module["quit"];
                    var wasmBinary;
                    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
                    var noExitRuntime;
                    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];

                    if (typeof WebAssembly !== "object") {
                        err("no native wasm support detected");
                    }
                    /** @param {number} ptr
                    @param {string} type
                    @param {number|boolean=} noSafe */


                    function getValue(ptr, type, noSafe) {
                        type = type || "i8";
                        if (type.charAt(type.length - 1) === "*") type = "i32";

                        switch (type) {
                            case "i1":
                                return HEAP8[ptr >> 0];

                            case "i8":
                                return HEAP8[ptr >> 0];

                            case "i16":
                                return HEAP16[ptr >> 1];

                            case "i32":
                                return HEAP32[ptr >> 2];

                            case "i64":
                                return HEAP32[ptr >> 2];

                            case "float":
                                return HEAPF32[ptr >> 2];

                            case "double":
                                return HEAPF64[ptr >> 3];

                            default:
                                abort("invalid type for getValue: " + type);
                        }

                        return null;
                    }

                    var wasmMemory;
                    var wasmTable = new WebAssembly.Table({
                        "initial": 1,
                        "maximum": 1 + 0,
                        "element": "anyfunc"
                    });
                    var ABORT = false;
                    var EXITSTATUS = 0;
                    var WASM_PAGE_SIZE = 65536;

                    function alignUp(x, multiple) {
                        if (x % multiple > 0) {
                            x += multiple - x % multiple;
                        }

                        return x;
                    }

                    var
                        /** @type {ArrayBuffer} */
                        buffer,
                        /** @type {Int8Array} */
                        HEAP8,
                        /** @type {Uint8Array} */
                        HEAPU8,
                        /** @type {Int16Array} */
                        HEAP16,
                        /** @type {Uint16Array} */
                        HEAPU16,
                        /** @type {Int32Array} */
                        HEAP32,
                        /** @type {Uint32Array} */
                        HEAPU32,
                        /** @type {Float32Array} */
                        HEAPF32,
                        /** @type {Float64Array} */
                        HEAPF64;

                    function updateGlobalBufferAndViews(buf) {
                        buffer = buf;
                        Module["HEAP8"] = HEAP8 = new Int8Array(buf);
                        Module["HEAP16"] = HEAP16 = new Int16Array(buf);
                        Module["HEAP32"] = HEAP32 = new Int32Array(buf);
                        Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
                        Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
                        Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
                        Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
                        Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
                    }

                    var DYNAMIC_BASE = 5251792,
                        DYNAMICTOP_PTR = 8752;
                    var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;

                    if (Module["wasmMemory"]) {
                        wasmMemory = Module["wasmMemory"];
                    } else {
                        wasmMemory = new WebAssembly.Memory({
                            "initial": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
                            "maximum": 2147483648 / WASM_PAGE_SIZE
                        });
                    }

                    if (wasmMemory) {
                        buffer = wasmMemory.buffer;
                    }

                    INITIAL_INITIAL_MEMORY = buffer.byteLength;
                    updateGlobalBufferAndViews(buffer);
                    HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
                    /**
                    * @license
                    * Copyright 2019 The Emscripten Authors
                    * SPDX-License-Identifier: MIT
                    */

                    function callRuntimeCallbacks(callbacks) {
                        while (callbacks.length > 0) {
                            var callback = callbacks.shift();

                            if (typeof callback == "function") {
                                callback(Module);
                                continue;
                            }

                            var func = callback.func;

                            if (typeof func === "number") {
                                if (callback.arg === undefined) {
                                    Module["dynCall_v"](func);
                                } else {
                                    Module["dynCall_vi"](func, callback.arg);
                                }
                            } else {
                                func(callback.arg === undefined ? null : callback.arg);
                            }
                        }
                    }

                    var __ATPRERUN__ = [];
                    var __ATINIT__ = [];
                    var __ATMAIN__ = [];
                    var __ATPOSTRUN__ = [];
                    var runtimeInitialized = false;

                    function preRun() {
                        if (Module["preRun"]) {
                            if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];

                            while (Module["preRun"].length) {
                                addOnPreRun(Module["preRun"].shift());
                            }
                        }

                        callRuntimeCallbacks(__ATPRERUN__);
                    }

                    function initRuntime() {
                        runtimeInitialized = true;
                        callRuntimeCallbacks(__ATINIT__);
                    }

                    function preMain() {
                        callRuntimeCallbacks(__ATMAIN__);
                    }

                    function postRun() {
                        if (Module["postRun"]) {
                            if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];

                            while (Module["postRun"].length) {
                                addOnPostRun(Module["postRun"].shift());
                            }
                        }

                        callRuntimeCallbacks(__ATPOSTRUN__);
                    }

                    function addOnPreRun(cb) {
                        __ATPRERUN__.unshift(cb);
                    }

                    function addOnPostRun(cb) {
                        __ATPOSTRUN__.unshift(cb);
                    }

                    var runDependencies = 0;
                    var runDependencyWatcher = null;
                    var dependenciesFulfilled = null;

                    function addRunDependency(id) {
                        runDependencies++;

                        if (Module["monitorRunDependencies"]) {
                            Module["monitorRunDependencies"](runDependencies);
                        }
                    }

                    function removeRunDependency(id) {
                        runDependencies--;

                        if (Module["monitorRunDependencies"]) {
                            Module["monitorRunDependencies"](runDependencies);
                        }

                        if (runDependencies == 0) {
                            if (runDependencyWatcher !== null) {
                                clearInterval(runDependencyWatcher);
                                runDependencyWatcher = null;
                            }

                            if (dependenciesFulfilled) {
                                var callback = dependenciesFulfilled;
                                dependenciesFulfilled = null;
                                callback();
                            }
                        }
                    }

                    Module["preloadedImages"] = {};
                    Module["preloadedAudios"] = {};
                    /** @param {string|number=} what */

                    function abort(what) {
                        if (Module["onAbort"]) {
                            Module["onAbort"](what);
                        }

                        what += "";
                        out(what);
                        err(what);
                        ABORT = true;
                        EXITSTATUS = 1;
                        what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
                        throw new WebAssembly.RuntimeError(what);
                    }
                    /**
                    * @license
                    * Copyright 2017 The Emscripten Authors
                    * SPDX-License-Identifier: MIT
                    */


                    function hasPrefix(str, prefix) {
                        return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0;
                    }

                    var dataURIPrefix = "data:application/octet-stream;base64,";

                    function isDataURI(filename) {
                        return hasPrefix(filename, dataURIPrefix);
                    }

                    var wasmBinaryFile = "TinyH264.wasm";

                    if (!isDataURI(wasmBinaryFile)) {
                        wasmBinaryFile = locateFile(wasmBinaryFile);
                    }

                    function getBinary() {
                        try {
                            if (wasmBinary) {
                                return new Uint8Array(wasmBinary);
                            }

                            if (readBinary) {
                                return readBinary(wasmBinaryFile);
                            } else {
                                throw "both async and sync fetching of the wasm failed";
                            }
                        } catch (err) {
                            abort(err);
                        }
                    }

                    function getBinaryPromise() {
                        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
                            return fetch(wasmBinaryFile, {
                                credentials: "same-origin"
                            }).then(function (response) {
                                if (!response["ok"]) {
                                    throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
                                }

                                return response["arrayBuffer"]();
                            }).catch(function () {
                                return getBinary();
                            });
                        }

                        return new Promise(function (resolve, reject) {
                            resolve(getBinary());
                        });
                    }

                    function createWasm() {
                        var info = {
                            "a": asmLibraryArg
                        };
                        /** @param {WebAssembly.Module=} module*/

                        function receiveInstance(instance, module) {
                            var exports = instance.exports;
                            Module["asm"] = exports;
                            removeRunDependency("wasm-instantiate");
                        }

                        addRunDependency("wasm-instantiate");

                        function receiveInstantiatedSource(output) {
                            receiveInstance(output["instance"]);
                        }

                        function instantiateArrayBuffer(receiver) {
                            return getBinaryPromise().then(function (binary) {
                                return WebAssembly.instantiate(binary, info);
                            }).then(receiver, function (reason) {
                                err("failed to asynchronously prepare wasm: " + reason);
                                abort(reason);
                            });
                        }

                        function instantiateAsync() {
                            if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
                                fetch(wasmBinaryFile, {
                                    credentials: "same-origin"
                                }).then(function (response) {
                                    var result = WebAssembly.instantiateStreaming(response, info);
                                    return result.then(receiveInstantiatedSource, function (reason) {
                                        //err("wasm streaming compile failed: " + reason);
                                        //err("falling back to ArrayBuffer instantiation");
                                        instantiateArrayBuffer(receiveInstantiatedSource);
                                    });
                                });
                            } else {
                                return instantiateArrayBuffer(receiveInstantiatedSource);
                            }
                        }

                        if (Module["instantiateWasm"]) {
                            try {
                                var exports = Module["instantiateWasm"](info, receiveInstance);
                                return exports;
                            } catch (e) {
                                err("Module.instantiateWasm callback failed with error: " + e);
                                return false;
                            }
                        }

                        instantiateAsync();
                        return {};
                    }
                    /* global initializers */


                    __ATINIT__.push({
                        func: function func() {
                            ___wasm_call_ctors();
                        }
                    });

                    function _emscripten_memcpy_big(dest, src, num) {
                        HEAPU8.copyWithin(dest, src, src + num);
                    }

                    function _emscripten_get_heap_size() {
                        return HEAPU8.length;
                    }

                    function emscripten_realloc_buffer(size) {
                        try {
                            wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
                            updateGlobalBufferAndViews(wasmMemory.buffer);
                            return 1;
                        }
                        /*success*/
                        catch (e) { }
                    }

                    function _emscripten_resize_heap(requestedSize) {
                        requestedSize = requestedSize >>> 0;

                        var oldSize = _emscripten_get_heap_size();

                        var PAGE_MULTIPLE = 65536;
                        var maxHeapSize = 2147483648;

                        if (requestedSize > maxHeapSize) {
                            return false;
                        }

                        var minHeapSize = 16777216;

                        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
                            var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
                            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
                            var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), PAGE_MULTIPLE));
                            var replacement = emscripten_realloc_buffer(newSize);

                            if (replacement) {
                                return true;
                            }
                        }

                        return false;
                    }

                    var asmLibraryArg = {
                        "a": _emscripten_memcpy_big,
                        "b": _emscripten_resize_heap,
                        "memory": wasmMemory,
                        "table": wasmTable
                    };
                    var asm = createWasm();
                    Module["asm"] = asm;
                    /** @type {function(...*):?} */

                    var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
                        return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["c"]).apply(null, arguments);
                    };
                    /** @type {function(...*):?} */


                    var _h264bsdInit = Module["_h264bsdInit"] = function () {
                        return (_h264bsdInit = Module["_h264bsdInit"] = Module["asm"]["d"]).apply(null, arguments);
                    };
                    /** @type {function(...*):?} */


                    var _malloc = Module["_malloc"] = function () {
                        return (_malloc = Module["_malloc"] = Module["asm"]["e"]).apply(null, arguments);
                    };
                    /** @type {function(...*):?} */


                    var _free = Module["_free"] = function () {
                        return (_free = Module["_free"] = Module["asm"]["f"]).apply(null, arguments);
                    };
                    /** @type {function(...*):?} */


                    var _h264bsdDecode = Module["_h264bsdDecode"] = function () {
                        return (_h264bsdDecode = Module["_h264bsdDecode"] = Module["asm"]["g"]).apply(null, arguments);
                    };
                    /** @type {function(...*):?} */


                    var _h264bsdShutdown = Module["_h264bsdShutdown"] = function () {
                        return (_h264bsdShutdown = Module["_h264bsdShutdown"] = Module["asm"]["h"]).apply(null, arguments);
                    };
                    /** @type {function(...*):?} */


                    var _h264bsdAlloc = Module["_h264bsdAlloc"] = function () {
                        return (_h264bsdAlloc = Module["_h264bsdAlloc"] = Module["asm"]["i"]).apply(null, arguments);
                    };
                    /** @type {function(...*):?} */


                    var _h264bsdFree = Module["_h264bsdFree"] = function () {
                        return (_h264bsdFree = Module["_h264bsdFree"] = Module["asm"]["j"]).apply(null, arguments);
                    };

                    Module["asm"] = asm;
                    Module["getValue"] = getValue;
                    var calledRun;

                    Module["then"] = function (func) {
                        if (calledRun) {
                            func(Module);
                        } else {
                            var old = Module["onRuntimeInitialized"];

                            Module["onRuntimeInitialized"] = function () {
                                if (old) old();
                                func(Module);
                            };
                        }

                        return Module;
                    };

                    dependenciesFulfilled = function runCaller() {
                        if (!calledRun) run();
                        if (!calledRun) dependenciesFulfilled = runCaller;
                    };
                    /** @type {function(Array=)} */


                    function run(args) {
                        args = args || arguments_;

                        if (runDependencies > 0) {
                            return;
                        }

                        preRun();
                        if (runDependencies > 0) return;

                        function doRun() {
                            if (calledRun) return;
                            calledRun = true;
                            Module["calledRun"] = true;
                            if (ABORT) return;
                            initRuntime();
                            preMain();
                            if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                            postRun();
                        }

                        if (Module["setStatus"]) {
                            Module["setStatus"]("Running...");
                            setTimeout(function () {
                                setTimeout(function () {
                                    Module["setStatus"]("");
                                }, 1);
                                doRun();
                            }, 1);
                        } else {
                            doRun();
                        }
                    }

                    Module["run"] = run;

                    if (Module["preInit"]) {
                        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];

                        while (Module["preInit"].length > 0) {
                            Module["preInit"].pop()();
                        }
                    }

                    noExitRuntime = true;
                    run();
                    return Module;
                };
            }();

            module.exports = Module;

            /***/
}),
/* 1 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

            "use strict";
            __webpack_require__.r(__webpack_exports__);

            // CONCATENATED MODULE: ./node_modules/tinyh264/es/TinyH264Decoder.js
            //
            //  Copyright (c) 2013 Sam Leitch. All rights reserved.
            //
            //  Permission is hereby granted, free of charge, to any person obtaining a copy
            //  of this software and associated documentation files (the "Software"), to
            //  deal in the Software without restriction, including without limitation the
            //  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
            //  sell copies of the Software, and to permit persons to whom the Software is
            //  furnished to do so, subject to the following conditions:
            //
            //  The above copyright notice and this permission notice shall be included in
            //  all copies or substantial portions of the Software.
            //
            //  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            //  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            //  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            //  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            //  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
            //  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
            //  IN THE SOFTWARE.
            //

            /**
             * This class wraps the details of the h264bsd library.
             * Module object is an Emscripten module provided globally by TinyH264.js
             *
             * In order to use this class, you first queue encoded data using queueData.
             * Each call to decode() will decode a single encoded element.
             * When decode() returns H264bsdDecoder.PIC_RDY, a picture is ready in the output buffer.
             * You can also use the onPictureReady() function to determine when a picture is ready.
             * The output buffer can be accessed by calling getNextOutputPicture()
             * An output picture may also be decoded using an H264bsdCanvas.
             * When you're done decoding, make sure to call release() to clean up internal buffers.
             */
            var TinyH264Decoder = /*#__PURE__*/function () {
                function TinyH264Decoder(tinyH264Module, onPictureReady) {
                    this.tinyH264Module = tinyH264Module;
                    this.onPictureReady = onPictureReady;
                    this.pStorage = this.tinyH264Module._h264bsdAlloc();
                    this.pWidth = this.tinyH264Module._malloc(4);
                    this.pHeight = this.tinyH264Module._malloc(4);
                    this.pPicture = this.tinyH264Module._malloc(4);
                    this._decBuffer = this.tinyH264Module._malloc(1024 * 1024);

                    this.tinyH264Module._h264bsdInit(this.pStorage, 0);
                }

                var _proto = TinyH264Decoder.prototype;

                _proto.release = function release() {
                    var pStorage = this.pStorage;

                    if (pStorage !== 0) {
                        this.tinyH264Module._h264bsdShutdown(pStorage);

                        this.tinyH264Module._h264bsdFree(pStorage);
                    }

                    this.tinyH264Module._free(this.pWidth);

                    this.tinyH264Module._free(this.pHeight);

                    this.tinyH264Module._free(this.pPicture);

                    this.pStorage = 0;
                    this.pWidth = 0;
                    this.pHeight = 0;
                };

                _proto.decode = function decode(nal, pkt) {
                    if (nal instanceof ArrayBuffer) {
                        nal = new Uint8Array(nal);
                    }

                    this.tinyH264Module.HEAPU8.set(nal, this._decBuffer);

                    var retCode = this.tinyH264Module._h264bsdDecode(this.pStorage, this._decBuffer, nal.byteLength, this.pPicture, this.pWidth, this.pHeight);

                    if (retCode === TinyH264Decoder.PIC_RDY) {
                        var width = this.tinyH264Module.getValue(this.pWidth, 'i32');
                        var height = this.tinyH264Module.getValue(this.pHeight, 'i32');
                        var picPtr = this.tinyH264Module.getValue(this.pPicture, 'i8*');
                        var pic = new Uint8Array(this.tinyH264Module.HEAPU8.subarray(picPtr, picPtr + width * height * 3 / 2));
                        this.onPictureReady(pic, width, height, pkt);
                    }
                };

                return TinyH264Decoder;
            }();

            TinyH264Decoder.RDY = 0;
            TinyH264Decoder.PIC_RDY = 1;
            TinyH264Decoder.HDRS_RDY = 2;
            TinyH264Decoder.ERROR = 3;
            TinyH264Decoder.PARAM_SET_ERROR = 4;
            TinyH264Decoder.MEMALLOC_ERROR = 5;
/* harmony default export */ var es_TinyH264Decoder = TinyH264Decoder;
            // EXTERNAL MODULE: ./node_modules/tinyh264/es/TinyH264.js
            var TinyH264 = __webpack_require__(0);
            var TinyH264_default = /*#__PURE__*/__webpack_require__.n(TinyH264);

// CONCATENATED MODULE: ./node_modules/tinyh264/es/TinyH264.wasm.asset
/* harmony default export */ var TinyH264_wasm_asset = (__webpack_require__.p + "tinyh264.wasm");
            // CONCATENATED MODULE: ./node_modules/tinyh264/es/TinyH264Worker.js



            var assets = {
                'TinyH264.wasm': TinyH264_wasm_asset
            };
            var h264Decoders = {};
            /**
             * @param {*}module
             */

            function loadNativeModule(module) {
                return new Promise(function (resolve) {
                    if (module.calledRun) {
                        resolve();
                    } else {
                        module.onRuntimeInitialized = function () {
                            return resolve();
                        };
                    }
                });
            }

            function init() {
                var tinyH264 = TinyH264_default()({
                    locateFile: function locateFile(path) {
                        return assets[path];
                    }
                });
                return loadNativeModule(tinyH264).then(function () {
                    self.addEventListener('message', function (e) {
                        var message = e.data;
                        var renderStateId = message.renderStateId;
                        var messageType = message.type;
                        var monitorId = message.monitorId;
                        switch (messageType) {
                            case 'decode':
                                {
                                    var decoder = h264Decoders[renderStateId];
                                    if (!decoder) {
                                        decoder = new es_TinyH264Decoder(tinyH264, function (output, width, height, pkt) {
                                            postMessage({
                                                type: 'pictureReady',
                                                width: width,
                                                height: height,
                                                renderStateId: renderStateId,
                                                data: output.buffer,
                                                monitorId: monitorId,
                                                pkt: pkt
                                            }, [output.buffer]);
                                        });
                                        h264Decoders[renderStateId] = decoder;
                                    }

                                    decoder.decode(new Uint8Array(message.data, message.offset, message.length), message.pkt);
                                    break;
                                }

                            case 'release':
                                {
                                    var _decoder = h264Decoders[renderStateId];

                                    if (_decoder) {
                                        _decoder.release();

                                        delete h264Decoders[renderStateId];
                                    }

                                    break;
                                }
                        }
                    });
                    self.postMessage({
                        'type': 'decoderReady'
                    });
                });
            }


            // CONCATENATED MODULE: ./node_modules/tinyh264/es/index.js


            // CONCATENATED MODULE: ./src/H264NALDecoder.worker.js


            init();


            /***/
})
    ]);