// =============================================================================================================================
// Copyright 2023, CybeleSoft
// CYBELESOFT
// 20230630.1
// info@cybelesoft.com
// =============================================================================================================================
// -- Required:
// -- helper.js
// -- thinfinity.components.js
// *****************************************************************************************************************************
// THINFINITY.Camera CLASS ****************************************************************************************************
// *****************************************************************************************************************************

(function () {
    (function Camera() {
        // -- PRIVATE VARIABLES ************************************************************************************************
        var _encoder = null;
        var _initialized = false;
        var _starting = false;
        var _mustStop = false;
        var _running = false;
        var _mediaStream = null;
        var _currentFormat = null;
        var _framesToDrop = 0;
        var _name = new constructorName().name;
        let _THIN = null;
        const _defaultCaptureWidth = 800;
        const _defaultCaptureHeight = 600;
        const _defaultCaptureFps = 24;

        const _desiredCodecs = [
            {codec: "avc1.640034", supported: false},  // AVC High Level 5.2
            {codec: "avc1.640834", supported: false},  // AVC High Progressive Level 5.2
            {codec: "avc1.4d4034", supported: false},  // AVC Constrained Main Level 5.2
            {codec: "avc1.4d0034", supported: false},  // AVC Main Level 5.2
            {codec: "avc1.424034", supported: false},  // AVC Constrained Baseline Level 5.2
            {codec: "avc1.420034", supported: false}   // AVC Baseline Level 5.2
        ];

        const encoderCallbacks = {
            output: (chunk, metadata) => {
                if (_running) {
                    let buffer = new Uint8Array(chunk.byteLength);
                    chunk.copyTo(buffer);
                    _THIN.wsSend(null, 3, buffer);
                }
            },
            error: (e) => {
                helper.console.warning("VideoEncoder: "+e.message);
            }
        };

        // -- END PRIVATE VARIABLES ********************************************************************************************
        // -- PRIVATE METHODS **************************************************************************************************
        function initialize() {
            _componentRef = new Thinfinity.Component({
                events: {
                    'ready': onComponentReady,
                    'destroy': onComponentsDisposed
                }
            });
            for (var c of _desiredCodecs) {
                testCodecConfig(c);
            }
        }
        function constructorName() {
            return { name: this.constructor.caller.name.toUpperCase() };
        }
        function testCodecConfig(codec) {
            let encoderConfig = {
                codec: codec.codec,
                width: _defaultCaptureWidth,
                height: _defaultCaptureHeight,
                framerate: _defaultCaptureFps,
                hardwareAcceleration: 'prefer-software',
                avc: {format: "annexb"}
            }
            if (window.VideoEncoder) {
                VideoEncoder.isConfigSupported(encoderConfig).then(support => {
                    helper.console.log("VideoEncoder "+codec.codec+" supported: "+support.supported);
                    codec.supported = support.supported;
                })
                .catch(error => {
                    helper.console.warning("VideoEncoder isConfigSupported", error);
                })
            } else {
                helper.console.warning('VideoEncoder is not supported in this environment.');
            }
        }
        function initializeCamera() {
            var codecString = "";
            for (var c of _desiredCodecs) {
                if (c.supported) {
                    codecString = c.codec;
                    break;
                }
            }
            if (codecString == "") {
                logError("Camera redirection: no supported codec available");
                return;
            }
            helper.console.log("Camera redirection: selected codec: "+codecString);
            _starting = true;
            let encoderConfig = {
                codec: codecString,
                width: _currentFormat.width,
                height: _currentFormat.height,
                //bitrate: 4000*1000,
                framerate: _currentFormat.fps,
                hardwareAcceleration: 'prefer-software',    // Ver. Con "prefer-software" se ve mejor en el host que con "no-preference" o "prefer-hardware"
                avc: {format: "annexb"}
            };
            let constraints = { video: { width: _currentFormat.width, height: _currentFormat.height, frameRate: { ideal: _currentFormat.fps } } };
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                helper.console.log("Camera: mediaStream open");
                _mediaStream = stream;
                if (_mustStop) {
                    helper.console.log("Camera: must stop");
                    closeMediaStream();
                    _initialized = false;
                    return;
                }
                _starting = false;
                _running = true;
                _encoder = new VideoEncoder(encoderCallbacks);
                _encoder.configure(encoderConfig);

                const track = stream.getVideoTracks()[0];
                const media_processor = new MediaStreamTrackProcessor(track);
                const reader = media_processor.readable.getReader();
                var frameCount = 0;
                var frameId = 0;

                function getAndSendFrame() {
                    reader.read().then(result => {
                        if (result.done) return;
                        let frame = result.value;
                        if (_framesToDrop > 0) {
                            _framesToDrop--;
                            helper.console.log("Camera frame dropped ("+_framesToDrop+" drops pending)");
                        }
                        else {
                            const keyFrame = frameCount % (_currentFormat.fps*2) == 0;
                            frameId++;
                            //helper.console.log("Camera frame "+frameId, keyFrame/*, frame*/);
                            if (_running) _encoder.encode(frame, { keyFrame });
                        }
                        frame.close();
                        frameCount++;
                        if (_running) getAndSendFrame();
                    });
                }
                getAndSendFrame();
            });
            _initialized = true;
        }
        function closeMediaStream() {
            if (_mediaStream) {
                helper.console.log("Camera: close tracks");
                const tracks = _mediaStream.getTracks();
                if (tracks) {
                    for (var t of tracks) {
                        t.stop();
                    }
                }
                _mediaStream = null;
            }
        }

        function openCamera() {
            helper.console.log("Camera: openCamera");
            _THIN.wsSend("cmd=camera&action=settings&format="+JSON.stringify(_currentFormat));
        }
        function startCamera() {
            helper.console.log("Camera: startCamera");
            _mustStop = false;
            if (!_initialized)
                initializeCamera();
            else {
                if (!_starting) _running = true;
            }
        }
        function stopCamera() {
            helper.console.log("Camera: stopCamera");
            _running = false;
            if (_starting) {
                _mustStop = true;
            }
            else {
                closeMediaStream();
                _encoder = null;
                _initialized = false;
            }
        }
        function closeCamera() {
            helper.console.log("Camera: closeCamera");
            stopCamera();
        }
        function dropFrames(count) {
            _framesToDrop += count;
        }
        function getReady() {
            if (_THIN) _THIN.wsSend("cmd=camera&action=notify&status=ready");
        }

        function onComponentReady(ev) {
            // -- SOMETIMES TOOLBAR IS NOT DEFINED (ONLY IN REFRESH)
            _componentRef.getObjectConfig(_name).then(cfg => {
                if (cfg) {
                    if (cfg?.settings?.format) {
                        _currentFormat = {
                            width: cfg.settings.format.width,
                            height: cfg.settings.format.height,
                            fps: cfg.settings.format.fps
                        };
                    } else {
                        _currentFormat = {
                            width: _defaultCaptureWidth,
                            height: _defaultCaptureHeight,
                            fps: _defaultCaptureFps
                        };
                    }
                    _componentRef.getAsyncRegisteredObject("SCRAPER").then(comp => {
                        if (comp) {
                            if (comp.owner) {
                                _THIN = comp.owner;
                                if (!_THIN.isShadowSession) {
                                    comp.on("cameraOpen", openCamera);
                                    comp.on("cameraStart", startCamera);
                                    comp.on("cameraStop", stopCamera);
                                    comp.on("cameraClose", closeCamera);
                                    comp.on("dropFrames", dropFrames);
                                    comp.on("cameraGetReady", getReady);
                                    getReady();
                                } else helper.console.log("Cannot initialize camera component, is a shadow session or camera feature is disabled", arguments);
                            } else helper.console.log("THIN object is null or undefined ", arguments);
                        }
                    }).catch(() => { helper.console.warn("Cannot initialize camera component", arguments); });
                }
            }).catch(e => { });
        }
        function onComponentsDisposed() {
            closeCamera();
        }
        initialize();
    })();
})();