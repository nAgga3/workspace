// =============================================================================================================================
// Copyright 2021, CybeleSoft
// CYBELESOFT
// 20210511.1
// info@cybelesoft.com
// =============================================================================================================================
// -- Required:
// -- imaadpcm.js
// -- helper.js
// -- input.audio.processor.worklet.js
// -- thinfinity.components.js
// *****************************************************************************************************************************
// THINFINITY.Microphone CLASS ****************************************************************************************************
// *****************************************************************************************************************************

(function () {
    (function Microphone() {
        // -- PRIVATE VARIABLES ************************************************************************************************
        var _audioContext = null;
        var _initialized = false;
        var _outSampleRate = 44100,
            _numChannels = 2,
            _minNoiseThreshold = 0.0025,
            _recFormatPCM = true;
        var _imaadPCMPath = null;
        var _workletPath = null;
        var _THIN = null;
        var _name = new constructorName().name;
        // -- END PRIVATE VARIABLES ********************************************************************************************
        // -- PRIVATE METHODS **************************************************************************************************
        function initialize() {
            _componentRef = new Thinfinity.Component({
                events: {
                    'ready': onComponentReady,
                    'destroy': onComponentsDisposed
                }
            });
        }
        function constructorName() {
            return { name: this.constructor.caller.name.toUpperCase() };
        }
        function loadJS(url) {
            return new Promise((resolve, reject) => {
                try {
                    // -- TW-156 - Resources must be loaded from the broker.
                    if (typeof url === "string" && url.length > 0) helper.dom.loadScript(url, resolve, reject);
                    else reject({ 'error': -1, 'message': 'URL is not valid' });
                } catch (err) {
                    reject(err);
                }
            });
        }
        function initializeMicrophone() {
            // -- Remove reference to external object.
            _audioContext = new AudioContext();
            _audioContext.audioWorklet.addModule(_workletPath).then(
                function () {
                    const recorder = new AudioWorkletNode(_audioContext, 'recorder-worklet');
                    var objConfig = { 'sampleRate': _audioContext.sampleRate, 'channelCount': recorder.channelCount, 'outputSampleRate': _outSampleRate, 'channels': _numChannels, 'noiseThreshold': _minNoiseThreshold, 'PCMFormat': _recFormatPCM };
                    _recordSampleRate = _audioContext.sampleRate;
                    if (!_recFormatPCM) {
                        if (imaadpcm_cretor) _imaadpcm = new imaadpcm_cretor();
                        else throw new Error("Cannot initialize IMAADPCM, please add the reference.");
                    }
                    recorder.port.postMessage(objConfig);
                    helper.console.log("Mic Initialized - " + JSON.stringify(objConfig), arguments);
                    buffSliceCount = Math.ceil(512 * _recordSampleRate / _outSampleRate);
                    recorder.port.onmessage = (event) => {
                        // Handling data from the processor
                        //if (!_THIN.isMicOpen) return;
                        if (event.data) {
                            if (!_recFormatPCM) event.data = this._imaadpcm.encodeBlockDataView(event.data);
                            _THIN.wsSend(null, 1, new Uint8Array(event.data));
                        }
                    };
                    let constraints = { audio: true, noiseSuppression: true };
                    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                        const microphone = _audioContext.createMediaStreamSource(stream);
                        microphone.connect(recorder);
                    });
                }, function (err) {
                }
            );
            _initialized = true;
        }
        function openMicrophone() {
            // -- A user agent may disallow this initial transition, and to allow it only when the AudioContext's relevant global object has sticky activation.
            // -- In other words, must have a valid "user" gesture.
            if (!_initialized || _audioContext.state === "closed") initializeMicrophone();
            else  if (_audioContext.state !== "running") _audioContext.resume().then(() => { helper.console.log("Mic was successfully open"); }).catch(e => { helper.console.warning("Cannot resume sound input", arguments); });
		}
        function closeMicrophone() {
            if (_audioContext.state === "running") {
                // -- This context is currently suspended (context time is not proceeding, audio hardware may be powered down/released)
                _audioContext.suspend();
                _audioContext.close();
                _initialized = false;
            }
		}

        function onComponentReady(ev) {
            // -- SOMETIMES TOOLBAR IS NOT DEFINED (ONLY IN REFRESH)
            _componentRef.getObjectConfig(_name).then(cfg => {
                if (cfg && cfg.files) {
                    cfg.files.forEach(item => {
                        if (item.isConstructor) {
                            if (item.required) item.required.forEach(file => { if (file.name.toUpperCase() === "PCM") _imaadPCMPath = file.url; });
                        } else if (item.name.toUpperCase() === "WORKLET") _workletPath = item.url;
                    });
                    let next = () => {
                        _componentRef.getAsyncRegisteredObject("SCRAPER").then(comp => {
                            if (comp && comp.owner) {
                                _THIN = comp.owner;
                                if (!_THIN.rcParams.isShadowSession && _THIN.rdParams.sound.enabled) {
                                    if (typeof _THIN.rdParams.microphoneNoiseThreshold != "undefined") _minNoiseThreshold = _THIN.rdParams.microphoneNoiseThreshold;
                                    comp.on("audioInputOpen", openMicrophone);
                                    comp.on("audioInputClose", closeMicrophone);
                                }
                            } else helper.console.log("THIN object is null or undefined ", arguments);
                        }).catch(() => { helper.console.warn("Cannot initialize microphone component", arguments); });
                    };
                    if (_imaadPCMPath) loadJS(_imaadPCMPath).then(next).catch(e => { });
                    else next();
                }
            }).catch(e => { });
        }

        function onComponentsDisposed() {
            if (_audioContext) {
                if (_audioContext.state !== "closed")
                    _audioContext.close();
                _audioContext = null;
            }
        }
        initialize();
    })();
})();