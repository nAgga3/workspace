// =========================================================================================================================
// Copyright 2014, CybeleSoft
// CYBELESOFT
// 20140618.1
// info@cybelesoft.com
// =========================================================================================================================

// *************************************************************************************************************************
// AgentInfo Class *********************************************************************************************************
// *************************************************************************************************************************
function AgentInfo() {
    // -- PRIVATE VARIABLES *********************************************************************************************
    var p = {};
    var asyncCallbacks = {};
    var apaSupported = false;
    // -- IN01767 - Cannot access to WAN (Do not use workers if is not necessary);
    var _self = this;
    var _surface = {
        isTouchable: undefined,
        key: "__#thinfinity.touch.data__",
        callbacks: []
    };
    // -- END PRIVATE VARIABLES ****************************************************************************************
    // -- PRIVATE METHODS **********************************************************************************************
    function initialize() {
        p = getBrowserInfo();

        if (this.__proto__ == null) {
            if (Object.getPrototypeOf)
                this.__proto__ = Object.getPrototypeOf(this);
            else
                this.__proto__ = this.constructor.prototype;
        }

        this.__proto__.getAgentKey = function () {
            var result;
            if (p['isIOS']) {
                result = "IOS_";
            } else if (p['isAndroid']) {
                result = "ANDROID_";
            } else if (p['isPlaybook']) {
                result = "PLAYBOOK_";
            } else if (p['isHPTablet']) {
                result = "WEBOS_";
            } else if (p['isChromeOS']) {
                result = "CHROMEOS_";
            } else if (p['isMac']) {
                result = "MAC_";
            } else if (p['isSymbian']) {
                result = "SYMBIAN_";
            } else {
                result = "PC_";
            }

            if (p['isFirefox']) {
                result += "FIREFOX";
            } else if (p['isOpera']) {
                result += "OPERA";
            } else if (p['isSafari']) {
                result += "SAFARI";
            } else if (p['isChrome']) {
                result += "CHROME";
            } else if (p['isMSIE']) {
                result += "MSIE";
            } else if (p['isTrident']) {
                result += "TRIDENT";
            } else if (p['isNokiaBrowser']) {
                result += "NOKIA";
            } else if (p['isChromium']) {
                result += "CHROMIUM";
            }
            return result;
        }

        this.__proto__.browserFromAgent = function (agentStr) {
            var result;
            var params = getBrowserInfo(agentStr);

            if (params['isFirefox']) {
                result = "Mozilla Firefox";
            } else if (params['isOpera']) {
                result = "Opera";
            } else if (params['isSafari']) {
                result = "Safari";
            } else if (params['isChrome']) {
                result = "Google Chrome";
            } else if (params['isMSIE']) {
                result = "MS Internet Explorer";
            } else if (params['isNokiaBrowser']) {
                result = "Nokia Browser";
            } else if (params['isTrident']) {
                result = "Trident (MSIE >= 11, like Gecko)";
            } else if (params['isChromium']) {
                result = "CHROMIUM";
            }
            result += " on ";
            if (params['isIOS']) {
                result += "iOS" + (iosVersion == 7) ? " 7" : "";
            } else if (params['isAndroid']) {
                result += "Android";
            } else if (params['isPlaybook']) {
                result += "BlackBerry Playbook";
            } else if (params['isChromeOS']) {
                result += "Chrome OS";
            } else if (params['isHPTablet']) {
                result += "Web OS";
            } else if (params['isMac']) {
                result += "Mac";
            } else if (params['isSymbian']) {
                result += "Symbian";
            } else {
                result += "PC";
            }
            return result;
        }
        getInitizationData();
        touchableDetection();
        // -- Shows status information.
        // -- TK-683 - Older browsers does not support CustomEvent, with dispatchEvent cannot pass 'detail'.
        try {
            window.dispatchEvent(new CustomEvent('addStatusAPIVariables', {
                "detail": [
                    { 'name': 'supportH264', 'title': 'Support H264', 'get': function () { return p.h264; }, 'index': 100 },
                    { 'name': 'isMobile', 'title': 'Mobile', 'get': function () { return p.isMobile }, 'index': 110 },
                    { 'name': 'isTouch', 'title': 'Touch', 'get': function () { return p.isTouch; }, 'index': 120 },
                    {
                        'name': 'browserInfo', 'title': 'Browser', 'get': function () {
                            var binfo = [];
                            if (p.isWindows) binfo.push('Windows'); else if (p.isMac) binfo.push('Mac');
                            if (p.isChrome) binfo.push('Chrome: ' + p.chromeVersion);
                            else if (p.isOpera) binfo.push('Opera');
                            else if (p.isSafari) binfo.push('Safari');
                            else if (p.isSafari) binfo.push('Safari');
                            else if (p.isMSIE) binfo.push('IE ' + p.msieVersion);
                            else if (p.isFirefox) binfo.push('Firefox');
                            binfo = binfo.join(', ');
                            return binfo;
                        }, 'index': 130
                    }
                ]
            }));
        } catch (error) {

        }
        // -- TK-683 - Older browsers does not support CustomEvent, with dispatchEvent cannot pass 'detail'.
    }
    (function autoplayAudioSupported(callback) {
        if (isFirefox()) callback(false);
        else {
            var audioFile = "data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
            var audioElem = document.createElement("audio");
            audioElem.muted = true;
            audioElem.preload = 'auto';
            audioElem.src = audioFile;
            var startPlayPromise = audioElem.play();

            if (!!startPlayPromise) {
                startPlayPromise.then(function () {
                    audioElem = null;
                    callback(true);
                }).catch(function (error) {
                    audioElem = null;
                    callback(false);
                });
            } else callback(false);
        }
    })((response) => { apaSupported = response; });
    function touchableDetection() {
        if (window.sessionStorage) {
            let tempData = sessionStorage.getItem(_surface.key);
            if (tempData) {
                try {
                    tempData = JSON.parse(tempData);
                    if (tempData.hasOwnProperty("isTouchable")) _surface.isTouchable = tempData.isTouchable;
                } catch (error) {

                }
            }
            if (_surface.isTouchable || p.isTouch) p.isTouch = true;
            else if (!p.isMobile) {
                var waitForTouchDevice = function () {
                    return new Promise((resolve) => {
                        var _touchDetection = function (e) {
                            if (e?.sourceCapabilities?.firesTouchEvents === true) {
                                p.isTouch = true;
                                window.sessionStorage.setItem(_surface.key, JSON.stringify({ isTouchable: true }));
                                window.removeEventListener("touchstart", _touchDetection, { passive: false });
                                resolve();
                            }
                        };
                        window.addEventListener("touchstart", _touchDetection, { passive: false });
                    });
                };
                waitForTouchDevice().then((r) => {
                    _surface.callbacks.forEach(fn => { try { fn(); } catch (error) { console.log(`Cannot execute callback: ${error.message || error}`); } });
                    _surface.callbacks = null;
                });
            }
        }
    }
    function detectTouch(callback) {
        if (_surface.isTouchable === true) callback();
        else _surface.callbacks.push(callback);
    }
    function isFirefox() {
        var m = window.navigator.userAgent.match(/firefox/gi);
        return (m && m.length !=-1);
    }
    function detectFirefox(userAgent, params) {
        params['isFirefox'] = (userAgent.indexOf('firefox') != -1);
        params['firefoxVersion'] = 0;
        if (/firefox[\/\s](\d+\.\d+)/.test(userAgent)) {
            params['firefoxVersion'] = new Number(RegExp.$1);
        }
    }
    function getOSVersion(userAgent) {
        var osReg = new RegExp(/Windows NT [0-9]+.[0-9]+;/gi);
        var numReg = new RegExp(/[0-9]+/gi);
        var fgroup = userAgent.match(osReg);
        if (fgroup) {
            try {
                var osnum = fgroup[0].match(numReg);
                if (osnum) {
                    osnum = parseInt(osnum[0], 10);
                    if (osnum < 10) return 7;
                    else return 10;
                }
            } catch (error) { }
        }
        return 'unknown';
    }
    // -- IN05525 - MSIE 12 (Edge) is hanging up on loading.
    function getMSIEBrowserVersion(userAgent) {
        try {
            var tempVersion = /edge\/(([0-9]+).)*/.exec(userAgent) || 0;
            return parseFloat(tempVersion[0].replace("edge/", "").replace(/ /g, "").replace(/;/g, ""));
        } catch (error) {
            return 0;
        }
    }
    // -- IN05525 - MSIE 12 (Edge) is hanging up on loading.
    function detectIE(userAgent, params) {
        var reg = /(msie) ([\w.]+)/.exec(userAgent);
        params['msieVersion'] = 0;
        params['msieOSVersion'] = '';
         // -- IN05525 - MSIE 12 (Edge) is hanging up on loading.
        params['msieHTMLVersion'] = 0;
        // -- BUG4168 - Windows phone 10 is detected as Android.
        params['isWindowsPhone'] = false;
        // -- BUG4168 - Windows phone 10 is detected as Android.
        var ieTest = /(msie) ([0-9\.]+)/i.exec(userAgent);
        params['isMSIE'] = !!(ieTest && ieTest[1] == "msie");
        if (params['isMSIE']) {
            params['msieVersion'] = parseFloat(ieTest[2]);
        } else if (userAgent.indexOf('trident') != -1) {
            // >= IE11, http://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx
            ieTest = /rv:([0-9\.]+)/i.exec(userAgent);
            if (ieTest) {
                params['isMSIE'] = true;
                params['msieVersion'] = parseFloat(ieTest[1]);
            }
        }
        else if ((/(windows nt 10.0)/i.exec(userAgent)) && (/(edge)/i.exec(userAgent))) {
            params['isMSIE'] = true;
            params['msieVersion'] = 12; // Edge;
        }  // -- BUG4168 - Windows phone 10 is detected as Android.
        else if ((/(windows phone 10.0)/i.exec(userAgent)) && (/(edge)/i.exec(userAgent))) {
            params['isMSIE'] = true;
            params['msieVersion'] = 12; // Edge;
            params['isWindowsPhone'] = true;
        }
        /*
        else if (/Edg\//.exe(userAgent)) {
            // -- Is the new version of IE based on Chromium.
        }
        */
        // -- IN05525 - MSIE 12 (Edge) is hanging up on loading.
        if (params.isMSIE) params.msieHTMLVersion = getMSIEBrowserVersion(userAgent);
        params['msieOSVersion'] = getOSVersion(userAgent);
        // -- BUG4168 - Windows phone 10 is detected as Android.
    }
    function checkPolyfillObjectURL() {
        window.URL = window.URL || window.webkitURL;
        return (window.URL) ? true : false;
    }
    function checkTypedArrays() {
        var result = false;
        if (!window.Uint32Array && !window.Uint16Array && !window.Uint8Array) {
            return result;
        }
        var test = null;
        var testU8 = null;
        var testU16 = null;
        var testU32 = null;
        var i;

        try {
            test = new ArrayBuffer(16);
            //	NOTE: 	Canvas.data must be a TypedArray.
            //			On IE10, Canvas.data is not Uint8ClampedArray, but a sort of generic byte array.
            testU8 = new Uint8ClampedArray(test, 8, 8);
            testU16 = new Uint16Array(test, 8, 4);
            testU32 = new Uint32Array(test, 8, 2);

            for (i = 0; i < testU8.length; ++i) { testU8[i] = 0xAB; }
            for (i = 0; i < testU16.length; ++i) { testU16[i] = 0xABAB; }
            for (i = 0; i < testU32.length; ++i) { testU32[i] = 0xABABABAB; }
            result = true;
        }
        catch (err) {
            result = false;
        }
        finally {
            testU8 = null;
            testU16 = null;
            testU32 = null;
            test = null;
        }
        return result;
    }
    function checkTransferableObjects() {
        var result;
        var workerScript;
        var objectUrl;
        var trArr;
        var trWork;

        try {
            //	NOTE: 	I'm counting on window.URL being supported and polyfilled.
            //			In case not, it is unlikely to have transferable objects but not ObjectURL
            if (!window.URL) {
                throw '';
            }

            workerScript = new Blob(['onmessage = function (oEvent) {}'], { type: 'text/javascript' });
            objectUrl = window.URL.createObjectURL(workerScript);
            trArr = new ArrayBuffer(1);
            trWork = new Worker(objectUrl);
            trWork.postMessage(trArr, [trArr]);
            result = (trArr.byteLength) ? false : true;
        }
        catch (err) {
            result = false;
        }
        finally {
            trWork = null;
            trArr = null;
            window.URL.revokeObjectURL(objectUrl);
        }
        return result;
    }
    //	Minimun features for asm.js to run; INCLUDING the successful load of a test worker on a default installation path.
    //	All other workers required by the application must be there too.
    function checkAsmJsWorkersSupportAsync(scriptUrl, params) {
        var worker;
        try {
            // -- IN01767 - Cannot access to WAN (Do not use workers if is not necessary);
            if (!params['hasTypedArrays'] || !_self.hasTransferableObjects) {
                throw '';
            }
            worker = new Worker(scriptUrl);
            worker.onmessage = function (oEvent) {
                //	Even if 'supportsRFXDecoder' is true, one MUST check for Binary WebSocket support. RemoteFX decoder (or any "idec" image for instance) -WILL NOT- work with AJAX.
                //	Surface is NOT mobile and will be supporting RFXDecoder with poor performance (as any older desktop will)
                params['supportsAsmJsWorkers'] = true;
                params['supportsRFXDecoder'] = true;//(true && !params['isMobile']) ? true : false;
                worker = null;

                callAsyncDetectionCallback('OnAsmJsWorkersTested');
            }
            worker.onerror = function (oEvent) {
                params['supportsAsmJsWorkers'] = false;
                params['supportsRFXDecoder'] = false;
                worker = null;

                callAsyncDetectionCallback('OnAsmJsWorkersTested');
            }
            worker.postMessage('test');
        }
        catch (err) {
            params['supportsAsmJsWorkers'] = false;
            params['supportsRFXDecoder'] = false;
            worker = null;

            callAsyncDetectionCallback('OnAsmJsWorkersTested');
        }
    }
    // -- END PRIVATE METHODS ******************************************************************************************
    function getIphoneModel() {
        var retModel = {
            'name': '',
            'resolution': '',
            'majorVersion': 0
        };
        try {
            var dpr = (window.devicePixelRatio || 1);
            var h = window.screen.height * dpr;
            var w = window.screen.width * dpr;
            if ((w == 320) && (h == 480)) {
                // -- (1st generation) iPhone 2G, 3G, 3GS
                retModel = {
                    'name': ['1', '2g', '3', '3g', '3gs'],
                    'resolution': '320x480',
                    'majorVersion': 3
                };
            } else if ((w == 640) && (h == 960)) {
                // -- iPhone 4, 4s
                retModel = {
                    'name': ['4', '4s'],
                    'resolution': '640x960',
                    'majorVersion': 4
                };
            } else if ((w == 640) && (h == 1136)) {
                // -- iPhone 5, 5s, 5c
                retModel = {
                    'name': ['5', '5s', '5c'],
                    'resolution': '640x1136',
                    'majorVersion': 5
                };
            } else if ((w == 750) && (h == 1334)) {
                // -- iPhone 6
                retModel = {
                    'name': ['6'],
                    'resolution': '750x1134',
                    'majorVersion': 6
                };
            } else if ((w == 1080) && (h == 1920)) {
                // -- iPhone 6 Plus
                retModel = {
                    'name': ['6plus'],
                    'resolution': '1080x1920',
                    'majorVersion': 6
                };
            }
        } catch (error) {

        }
        return retModel;
    };
    // function checkAndSetIpadProModel() {
    //     var isProModel = false;
    //     //var setCropFS = function (width, height) {
    //     //    if (window.Thinfinity && window.Thinfinity.InitializationData) Thinfinity.InitializationData.add('ENVIRONMENT', { 'crop': { 'fullscreen': { 'width': width, 'height': height } } });
    //     //};
    //     var setMarginFS = function (left, top, right, bottom) {
    //         if (window.Thinfinity && window.Thinfinity.InitializationData) Thinfinity.InitializationData.add('ENVIRONMENT', { 'margin': { 'fullscreen': { 'left': left, 'top': top, 'right': right, 'bottom': bottom } } });
    //     };
    //     if (window.screen.availWidth === 1366 && window.screen.width === 1024 && window.screen.availHeight === 1024 && window.screen.height === 1366 && window.devicePixelRatio >= 1.5) {
    //         isProModel = true;
    //         setMarginFS(0, 30, 0, 0);
    //     } else if (window.screen.availWidth === 1194 && window.screen.width === 834 && window.screen.availHeight === 834 && window.screen.height === 1194 && window.devicePixelRatio >= 1.5) {
    //         isProModel = true;
    //         // -- In fullscreen without crop the top of the document, is imposible to click in "Close, minimize, maximize or help" buttons
    //         setMarginFS(0, 28, 0, 0);
    //     } else if (navigator.userAgent.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    //         isProModel = true;
    //     }
    //     return isProModel;
    // }
    function getBrowserInfo(userAgent) {
        var params = {};
        if (typeof userAgent != 'string') {
            userAgent = navigator.userAgent;
        }
        //	-------------------------------------------------------------------------------
        //	Detection of browser brand and version by given userAgent (not always reliable)
        //	-------------------------------------------------------------------------------
        params['agentStr'] = userAgent = userAgent.toLowerCase();

        // Do not delete!
        var isTrident = (userAgent.indexOf('trident') != -1);

        params['protocol'] = ((document.location.protocol == 'https:') ? 'https' : 'http');
        params['majorVersion'] = parseInt(navigator.appVersion, 10);
        params['isWindows'] = (userAgent.indexOf('windows') != -1);
        params['isMac'] = (userAgent.indexOf('macintosh') != -1);
		params['isLinux'] = (userAgent.indexOf('linux') != -1);
        params['isIOS'] = (((userAgent.indexOf('iphone') != -1) || (userAgent.indexOf('ipod') != -1) || (userAgent.indexOf('ipad') != -1) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !isTrident);
        // -- The regular expression was updated to support all kind of expression version, like 8 | 8_1 | 8_1_3; previously just works with x_x_x string versions.
        params['iosVersion'] = (params['isIOS']) ? /os (([0-9]+)_)*./.exec(userAgent) || 0 : 0;
        if (params['iosVersion'] != 0) {
            // -- iosBuildVersion was added to identify between version, iosVersion is just return 6 | 7 | 8 as string, but BuildVersion return the whole version like 8.1.3
            try {
                params['iosBuildVersion'] = params['iosVersion'][0].replace("os", "").replace(/_/g, ".").replace(/ /g, "");
                var tempIosVersion = params['iosVersion'][0].replace("os", "").replace(/ /g, "");
                if (tempIosVersion.indexOf('_') != -1) {
                    tempIosVersion = parseInt(tempIosVersion.substring(0, tempIosVersion.indexOf('_')), 10);
                }
                params['iosVersion'] = tempIosVersion;
            } catch (error) {
                // -- this code is falling to get the real version of the ios, for iphone 6, the current version is 1, when it should be 8.
                params['iosVersion'] = params['iosBuildVersion'] = params['iosVersion'][params['iosVersion'].length - 1];
            }
        }
        // -- How to detect IPAD models, like 1, 2 or 3
        // -- This code is working for detect between IPAD 1, 2 and 3.
        // -- http://stackoverflow.com/questions/7400489/ipad-version-detection-in-javascript
        params['ipadModel'] = 0;
        if (params['isIOS']) {
            try {
                var ipadModel = 1;
                if (window.ondevicemotion) {
                    window.ondevicemotion = function (e) {
                        if (event.acceleration) {
                            ipadModel += window.devicePixelRatio;
                        }
                        params['ipadModel'] = ipadModel;
                        window.ondevicemotion = null;
                    };
                } else {
                    params.ipadModel = 'pro';
                }
            } catch (error) {
                params['ipadModel'] = 0;
            }
        }
        // -- end IPAD model detection;

        params['isIphone'] = ((userAgent.indexOf('iphone') != -1) || (userAgent.indexOf('ipod') != -1)) && !isTrident;
        if (params['isIphone'] == true) {
            params['iphoneModel'] = getIphoneModel();
        }
        params['isIpod'] = (userAgent.indexOf('ipod') != -1);
        params['isAndroid'] = (userAgent.indexOf('android') != -1) && !isTrident;
        params['isHPTablet'] = (userAgent.indexOf('hp-tablet') != -1);
        params['isPlaybook'] = (userAgent.indexOf('playbook') != -1);
        params['isChromeOS'] = (userAgent.indexOf(' cros ') != -1);
        // -- IN02155 - Android-chrome backspace is not working.
        // -- Missing Chrome Version
        if (params['isChromeOS'] == true) {
            try {
                var tempChromeVersion = /android (([0-9]+).)*./.exec(userAgent) || 0;
                params['chromeOSVersion'] = tempChromeVersion[0].replace("android", "").replace(/ /g, "").replace(/;/g, "");
            } catch (error) {
                params['chromeOSVersion'] = "0";
            }
        } else {
            params['chromeOSVersion'] = "0";
        }
        // -- IN02155 - Android-chrome backspace is not working.
        params['isYandex'] = (userAgent.indexOf('yabrowser') != -1);
        detectIE(userAgent, params);
        params['isSymbian'] = (userAgent.indexOf('symbian') != -1);
        params['isWindowMobile'] = (userAgent.indexOf('iemobile') != -1) || (userAgent.indexOf('windows phone') != -1);
        params['isOpera'] = userAgent.indexOf('opera') != -1 || userAgent.indexOf('opr/') != -1;
        params['isChrome'] = !params['isOpera'] && ((userAgent.indexOf('chrome') != -1) || (userAgent.indexOf('crios') != -1)) && (params['isMSIE'] == false);
        // -- IN02155 - Android-chrome backspace is not working.
        // -- Missing Chrome Version

        params['isChromium'] = false;
        if (params['isChrome']) {
            try {
                var getChromeVersion = function () {
                    var tempChromeVersion = /chrome\/(([0-9]+).)*/.exec(userAgent) || 0;
                    return tempChromeVersion[0].replace("chrome/", "").replace(/ /g, "").replace(/;/g, "");
                };
                var getCriosVersion = function () {
                    var tempChromeVersion = /crios\/(([0-9]+).)*/.exec(userAgent) || 0;
                    return params['chromeVersion'] = tempChromeVersion[0].replace("crios/", "").replace(/ /g, "").replace(/;/g, "");
                };
                var tempChromeVersion = '';
                // -- BUG 4288 - Chrome version is not detected on IPAD
                if (params['isIOS']) {
                    tempChromeVersion = /crios\/(([0-9]+).)*/.exec(userAgent) || 0;
                    // -- Is Chrome running in IOS
                    if (tempChromeVersion) {
                        params.isChrome = true;
                        params.isSafari = false;
                        params['chromeVersion'] = getCriosVersion();
                    } else {
                        // -- Is Chrome trying to pretend to be Safari
                        params.isIOS = false;
                        params.isSafari = false;
                        params['chromeVersion'] = getChromeVersion();
                    }
                } else {
                    // -- BUG 4288 - Chrome version is not detected on IPAD
                    tempChromeVersion = /chrome\/(([0-9]+).)*/.exec(userAgent) || 0;
                    if (tempChromeVersion) {
                        params.isChrome = true;
                        params.isSafari = false;
                        params['chromeVersion'] = getChromeVersion();
                    } else {
                        params.isIOS = false;
                        params.isSafari = false;
                    }
                }
            } catch (error) {
                params['chromeVersion'] = "0";
            }
        } else {
            params['chromeVersion'] = "0";
        }
        // -- Add Dragon detection.
        params['isDragon'] = (((userAgent.indexOf('dragon') != -1)) && (params['isChrome'] == true));
        if (params['isDragon']) {
            try {
                var tempDragonVersion = /dragon\/(([0-9]+).)*/.exec(userAgent) || 0;
                params['dragonVersion'] = tempDragonVersion[0].replace("dragon/", "").replace(/ /g, "").replace(/;/g, "");
            } catch (error) {
                params['dragonVersion'] = "0";
            }
        } else {
            params['dragonVersion'] = "0";
        }
        // -- IN02155 - Android-chrome backspace is not working.
        params['isNokiaBrowser'] = (userAgent.indexOf('nokiabrowser') != -1);
        detectFirefox(userAgent, params);

        //if it's not any known ios browser and is iOS then fallback to safari
        params['isSafari'] = !(params['isNokiaBrowser'] || params['isChrome'] || params['isOpera'] || params['isFirefox'] || params['isMSIE'])
            && ((userAgent.indexOf('safari') != -1) || params['isIOS']);

        // detect Samsung Galaxy default browser
        if (params['isSafari'] && params["isAndroid"]) {
            params['isSafari'] = false;
            params['isChromium'] = true;
        }
        if (params.isMSIE && params.msieVersion >= 11 && params.isWindows) {
            params.isIOS = false;
            params.isAndroid = false;
            params.isSafari = false;
            params.isChrome = false;
            params.isFirefox = false;

        }
        params['isMobile'] = !params['isChromeOS'] && (params['isIOS'] || params['isAndroid'] || params['isHPTablet'] || params['isPlaybook'] || params['isSymbian'] || params['isWindowMobile']);
        params['isTouch'] = !!('ontouchstart' in window) || (navigator.pointerEnabled && navigator.maxTouchPoints > 0) || (navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0) || false;
        // -- IN01950 - (Surface IE) - Cannot run an application.

        // -- IN01950 - (Surface IE) - Cannot run an appliation.
        /*	sgermino:
			maxTouchPoints has (an approximate of) the actual number of supported touch points. In the above code I first
			check for interface availabilty and then for touch points availability. On my machine, on Chrome, 'ontouchstart'
			is undefined and navigator.maxTouchPoints is 0, -NOT- undefined. When using touch emulation, 'ontouchstart' is
			defined and navigator.maxTouchPoints is 10. On IE10, msMaxTouchPoints is 0 (there is no touch emulation to test
			with). IE11 maxTouchPoints http://www.w3.org/TR/pointerevents/#widl-Navigator-maxTouchPoints (msMaxTouchPoints on
			IE10)
		*/

        //	-----------------------------------------------------------------------------
        //	Detection of browser features by feature detection -AND- polyfill of features
        //	-----------------------------------------------------------------------------
        params['hasObjectURL'] = checkPolyfillObjectURL();
        params['hasArrayBuffers'] = !!window.ArrayBuffer;
        params['hasTypedArrays'] = (params['hasArrayBuffers']) ? checkTypedArrays() : false;
        params['hasWorkers'] = !!window.Worker;
        // -- IN01767 - Cannot access to WAN (Do not use workers if is not necessary);
        params['hasTransferableObjects'] = null;
        // -- IN01767 - End

        //	WARNING:	Drawing with requestAnimationFrame is good to synchronize each frame drawn (entire screen) along with browser screen updates.
        //				On IE9 there is no requestAnimationFrame (or non-standard variants), but there is a draw bug that is solved by calling "setTimeout(callback, 0)" where callback
        //				has all drawing operations for the current frame. So the use of this function is always required.
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) { setTimeout(callback, 0); };

        //	Async feature detection (set callbacks and call runAsyncDetections())
        params['supportsAsmJsWorkers'] = false;
        params['supportsRFXDecoder'] = false;

        // -- BUG4168 - Windows phone 10 is detected as Android.
        if (params['isWindowsPhone'] == true) {
            // -- Force all android and chrome attributes to false;
            params['isAndroid'] = false;
            params['isChromium'] = false;
            params['isChromeOS'] = false;
            params['chromeVersion'] = "0";
        }
        // -- BUG4168 - Windows phone 10 is detected as Android.

        // -- IN02351 - Cannot initialize touch in Window tablet mode.
        params['isTabletMode'] = false;
        // -- IN02351 - Cannot initialize touch in Window tablet mode.

        // -- IN02538 - Get remote browser timezone from application.
        params['timeZone'] = (-(new Date()).getTimezoneOffset() / 60);
        // -- IN02538 - Get remote browser timezone from application.

        params['h264'] = !(params.isMSIE && params.msieVersion < 15.0);
        params['gfx'] = !(params.isMSIE && params.msieVersion < 15.0) && !(params['isSafari']);   // Se excluye Safari porque no tiene OffscreenCanvas. Ver otros casos y si hay que implementar una alternativa
        return params;
    }
    function supportsFullScreen(element) {
        var response = false;
        if ((element == null) || (element == undefined)) { element = document.documentElement; }
        if (element) {
            if (element.requestFullscreen) {
                response = true;
            } else if (element.mozRequestFullScreen) {
                response = true;
            } else if (element.webkitRequestFullscreen) {
                response = true;
            } else if (element.msRequestFullscreen) {
                response = true;
            }
            // Recheck if is running on an iframe (Fullscreen is available depending on the browser)
            if (response && (!((p.isMac && (p.isOpera || p.isChrome)) || p.isChrome))) {
                response = window.top === ((typeof element.defaultView != 'undefined') ? element.defaultView : ((typeof element.ownerDocument != 'undefined' && typeof element.ownerDocument.defaultView != 'undefined')) ? element.ownerDocument.defaultView : window);
            }
        }
        return response;
    }
    function callAsyncDetectionCallback(event) {
        if (asyncCallbacks.hasOwnProperty(event)) {
            var callbacks = asyncCallbacks[event];
            for (var i = 0; i < callbacks.length; ++i) {
                callbacks[i].callback.apply(callbacks[i].self);
            }
        }
    }
    /*
		Async detection events and set properties
		+-------------------------------+-----------------------------------------------+
		| Event Name					| Defined Properties							|
		+-------------------------------+-----------------------------------------------+
		| OnAsmJsWorkersTested			| supportsAsmJsWorkers							|
		|								| supportsRFXDecoder							|
		+-------------------------------+-----------------------------------------------+
		| OnAsyncDetectionsEnd			| (none, called when all tests are finished)	|
		+-------------------------------+-----------------------------------------------+
	*/
    function addAsyncDetectionCallback(event, self, callback) {
        if (!asyncCallbacks.hasOwnProperty(event)) {
            asyncCallbacks[event] = [];
        }
        asyncCallbacks[event].push({ self: self, callback: callback });
    }
    function runAsyncDetections() {
        //	Minimun features for asm.js to run; INCLUDING the load of a test worker on a default relative path (other workers must use this same path).
        //	******************************************************************************************************************************************************************
        //	WARNING:	Asynchronous load of worker script by design and XMLHttpRequest sychronous requests are being deprecated. supportsAsmJsWorkers and supportsRFXDecoder
        //				are false on initialization and during the test period. This could  give a false negative if checked before the callbacks is finally called.
        //	******************************************************************************************************************************************************************
        checkAsmJsWorkersSupportAsync('common/workers/test.js', p);
    }
    function supportHTML5() {
        try {
            // -- Must use other settings too.
            var canvas = document.createElement("canvas")
            return ((typeof canvas.getContext != 'undefined') ? true : false);
        } catch (error) {
            return false;
        }
    }
    // -- IN02351 - Cannot initialize touch in Window tablet mode.
    function updateProperty() {
        if (arguments && arguments.length > 0) {
            for (var key in arguments[0]) {
                if (p[key] != undefined) {
                    // -- Modifying property value.
                    console.log(`Forcing property value - ${key}:${arguments[0][key]}`);
                    p[key] = arguments[0][key];
                }
            }
        }
    }
    // -- IN02351 - Cannot initialize touch in Window tablet mode.

    // -- IN02351 - Cannot initialize touch in Window tablet mode.
    // -- Initialization Data
    function getInitizationData() {
        if (window.Thinfinity && window.Thinfinity.InitializationData) {
            var data = window.Thinfinity.InitializationData.get('AGENTINFO');
            if (data) updateProperty(data);
        }
    }
    function setInitializationData(data) {
        if (window.Thinfinity && window.Thinfinity.InitializationData) {
            window.Thinfinity.InitializationData.update('AGENTINFO', data);
            // -- IN02711 - Forced to show as mobile.
            updateProperty(data);
            // -- IN02711 - Forced to show as mobile.
        }
    }
    // -- IN02351 - Cannot initialize touch in Window tablet mode.
    function getTransferableObjects() {
        if (p['hasTransferableObjects'] != null) {
            return p['hasTransferableObjects'];
        } else {
            p['hasTransferableObjects'] = (p['hasWorkers']) ? checkTransferableObjects() : false;
            return p['hasTransferableObjects'];
        }
    }
    function compareVersions(versionA, versionB) {
        var result = 0;
        if (versionA != versionB) {
            var aVA = versionA.split(".");
            var aVB = versionB.split(".");
            var m = Math.min(aVA.length, aVB.length);
            var i = 0;
            while (result == 0 && i < m) {
                result = parseInt(aVA[i], 10) - parseInt(aVB[i], 10);
                i++;
            }
            if (result == 0) {
                if (m < aVB.length) {
                    result = -1;
                } else if (m < aVA.length) {
                    result = 1;
                }
            }
        }
        return result;
    }
    function isNewerThan(versionA, versionB) {
        return compareVersions(versionA, versionB) > 0;
    }
    function isOlderThan(versionA, versionB) {
        return compareVersions(versionA, versionB) < 0;
    }
    function isSameVersion(versionA, versionB) {
        return compareVersions(versionA, versionB) == 0;
    }
    function getBrowserName() {
        return p['isChrome'] ? 'chrome' : p['isMSIE'] ? 'edge' : p['isFirefox'] ? 'firefox' : p['isOpera'] ? 'opera' : p['isSafari'] ? 'safari' : p['isDragon'] ? 'dragon' : p['isSymbian'] ? 'symbian' : p['isChromium'] ? 'android' : 'unknown';
    }
    function supportOggFormat(callback){
        let checkOgg = () =>{
            return new Promise(resolve => {
                try {
                    let audioCtx = new AudioContext();
                    let chunk = [79, 103, 103, 83, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 26, 50, 0, 0, 0, 0, 0, 0, 253, 79, 48, 95, 1, 19, 79, 112, 117, 115, 72, 101, 97, 100, 1, 2, 56, 1, 68, 172, 0, 0, 0, 0, 0, 79, 103, 103, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 50, 0, 0, 1, 0, 0, 0, 101, 92, 227, 247, 1, 51, 79, 112, 117, 115, 84, 97, 103, 115, 35, 0, 0, 0, 108, 105, 98, 111, 112, 117, 115, 32, 117, 110, 107, 110, 111, 119, 110, 44, 32, 108, 105, 98, 111, 112, 117, 115, 101, 110, 99, 32, 117, 110, 107, 110, 111, 119, 110, 0, 0, 0, 0, 79, 103, 103, 83, 0, 4, 245, 37, 0, 0, 0, 0, 0, 0, 26, 50, 0, 0, 2, 0, 0, 0, 167, 37, 66, 36, 14, 255, 144, 241, 237, 233, 235, 241, 233, 230, 255, 111, 230, 255, 158, 252, 127, 12, 20, 204, 98, 190, 27, 223, 60, 146, 131, 102, 2, 15, 67, 177, 166, 86, 254, 172, 19, 81, 160, 245, 25, 129, 89, 47, 50, 163, 219, 19, 109, 120, 142, 210, 182, 207, 246, 96, 150, 241, 199, 58, 105, 62, 202, 178, 179, 170, 86, 30, 188, 185, 17, 125, 250, 117, 60, 173, 73, 126, 157, 36, 135, 211, 204, 180, 173, 211, 208, 122, 17, 193, 32, 51, 107, 80, 2, 34, 51, 119, 59, 119, 122, 228, 213, 149, 184, 223, 154, 232, 140, 57, 182, 203, 52, 207, 211, 36, 98, 208, 10, 24, 250, 149, 166, 251, 147, 123, 156, 163, 173, 143, 250, 145, 224, 120, 23, 125, 163, 194, 207, 224, 192, 202, 60, 103, 42, 44, 254, 187, 54, 251, 212, 135, 145, 105, 136, 31, 138, 157, 19, 34, 160, 226, 180, 201, 223, 78, 96, 54, 7, 249, 255, 203, 49, 105, 182, 182, 227, 80, 120, 30, 161, 20, 0, 0, 0, 1, 244, 148, 122, 129, 74, 111, 98, 98, 85, 129, 123, 61, 74, 124, 255, 58, 194, 191, 58, 194, 183, 89, 45, 128, 75, 96, 0, 2, 208, 1, 30, 72, 209, 111, 46, 227, 119, 148, 51, 34, 19, 209, 3, 214, 235, 0, 191, 149, 3, 214, 235, 55, 120, 147, 57, 153, 131, 41, 216, 133, 47, 110, 252, 30, 102, 202, 17, 96, 192, 212, 74, 97, 193, 185, 149, 214, 165, 55, 204, 141, 161, 39, 104, 96, 131, 64, 197, 153, 0, 109, 233, 199, 117, 124, 93, 47, 177, 243, 68, 148, 182, 182, 43, 232, 172, 62, 79, 64, 103, 124, 59, 16, 176, 139, 36, 116, 143, 10, 233, 116, 192, 152, 166, 143, 138, 30, 14, 114, 190, 123, 33, 196, 102, 217, 98, 212, 101, 134, 196, 141, 110, 118, 204, 91, 173, 171, 117, 146, 22, 179, 162, 139, 248, 0, 164, 124, 99, 112, 66, 94, 122, 216, 1, 59, 239, 84, 22, 187, 179, 205, 107, 221, 59, 195, 94, 43, 229, 106, 122, 130, 205, 203, 197, 229, 216, 150, 12, 0, 54, 121, 110, 118, 234, 14, 145, 117, 155, 220, 93, 226, 115, 230, 100, 69, 147, 31, 164, 71, 109, 96, 182, 38, 45, 17, 124, 179, 250, 89, 128, 21, 231, 11, 68, 164, 87, 1, 82, 7, 252, 101, 151, 201, 103, 98, 50, 196, 172, 95, 172, 137, 244, 140, 185, 12, 251, 106, 121, 57, 240, 172, 205, 112, 121, 55, 113, 123, 117, 114, 14, 246, 44, 246, 80, 110, 187, 121, 212, 147, 237, 241, 69, 46, 235, 178, 140, 192, 114, 121, 219, 97, 150, 55, 23, 151, 4, 19, 37, 221, 162, 241, 61, 214, 150, 232, 163, 86, 135, 190, 154, 29, 191, 84, 40, 136, 48, 81, 232, 230, 206, 213, 92, 99, 105, 182, 199, 80, 230, 91, 49, 85, 148, 56, 51, 176, 67, 233, 100, 20, 152, 213, 3, 194, 183, 146, 123, 49, 23, 37, 51, 223, 66, 43, 116, 115, 57, 11, 16, 159, 43, 198, 68, 239, 150, 143, 76, 54, 72, 36, 151, 188, 185, 201, 243, 25, 74, 132, 117, 71, 202, 195, 63, 131, 194, 48, 50, 155, 61, 136, 31, 247, 56, 18, 115, 168, 185, 134, 226, 172, 72, 246, 95, 76, 122, 39, 70, 231, 227, 240, 139, 51, 142, 65, 27, 172, 31, 127, 26, 249, 69, 186, 117, 31, 134, 51, 185, 45, 156, 37, 81, 149, 93, 90, 145, 164, 18, 197, 255, 189, 61, 219, 209, 159, 198, 123, 70, 168, 110, 107, 55, 49, 69, 2, 145, 2, 54, 105, 13, 77, 53, 59, 233, 160, 247, 10, 184, 137, 144, 157, 27, 184, 33, 242, 229, 145, 106, 155, 166, 123, 149, 252, 38, 119, 8, 151, 118, 97, 60, 197, 181, 145, 118, 161, 103, 159, 136, 110, 183, 175, 184, 61, 238, 153, 244, 76, 74, 102, 163, 131, 108, 1, 86, 11, 0, 34, 130, 169, 169, 103, 192, 103, 90, 100, 153, 238, 171, 117, 44, 143, 177, 252, 6, 14, 193, 55, 13, 24, 140, 103, 2, 252, 205, 240, 15, 204, 12, 174, 97, 179, 126, 240, 140, 76, 251, 90, 229, 42, 205, 20, 183, 121, 43, 250, 243, 148, 162, 226, 230, 127, 110, 202, 103, 62, 84, 198, 232, 113, 45, 3, 185, 90, 52, 180, 220, 120, 20, 123, 231, 143, 102, 132, 221, 227, 46, 11, 221, 92, 73, 71, 207, 133, 131, 128, 108, 39, 45, 205, 14, 68, 70, 83, 178, 18, 26, 232, 179, 88, 43, 29, 39, 175, 76, 153, 80, 31, 221, 61, 228, 239, 130, 217, 80, 157, 95, 149, 43, 230, 177, 106, 69, 153, 0, 54, 129, 100, 65, 23, 60, 6, 5, 156, 187, 33, 183, 107, 89, 142, 117, 165, 31, 198, 138, 24, 134, 177, 177, 79, 130, 139, 181, 20, 106, 195, 13, 6, 48, 183, 205, 179, 81, 124, 3, 217, 236, 124, 255, 20, 87, 9, 235, 73, 59, 248, 226, 54, 59, 126, 110, 190, 126, 88, 4, 64, 155, 85, 254, 70, 122, 234, 122, 185, 239, 144, 58, 75, 144, 234, 252, 40, 103, 44, 173, 139, 243, 37, 30, 197, 11, 208, 244, 201, 78, 57, 181, 34, 58, 66, 91, 165, 70, 64, 196, 34, 184, 32, 243, 173, 104, 63, 51, 109, 186, 218, 178, 226, 79, 176, 10, 183, 19, 52, 247, 113, 211, 140, 239, 52, 244, 33, 154, 168, 83, 172, 166, 222, 82, 223, 108, 166, 207, 68, 109, 11, 193, 128, 141, 218, 147, 36, 180, 69, 173, 15, 193, 112, 36, 86, 48, 198, 241, 67, 246, 134, 17, 195, 246, 35, 125, 42, 247, 80, 142, 127, 67, 146, 2, 204, 117, 227, 203, 160, 208, 164, 141, 226, 73, 131, 203, 89, 215, 80, 206, 22, 64, 116, 155, 137, 197, 119, 87, 161, 46, 235, 231, 82, 13, 34, 234, 228, 38, 36, 87, 38, 128, 236, 101, 183, 25, 108, 53, 79, 248, 133, 242, 140, 107, 88, 86, 134, 80, 66, 142, 109, 53, 219, 109, 14, 186, 81, 42, 117, 47, 82, 243, 50, 54, 15, 170, 90, 56, 21, 199, 82, 16, 161, 241, 123, 72, 63, 62, 163, 209, 12, 31, 212, 150, 210, 215, 178, 241, 71, 151, 143, 179, 155, 102, 109, 228, 230, 244, 8, 18, 22, 3, 155, 197, 62, 212, 148, 68, 154, 244, 10, 193, 22, 55, 170, 207, 168, 185, 21, 247, 110, 197, 218, 207, 242, 149, 240, 249, 252, 37, 177, 219, 167, 13, 34, 187, 105, 57, 130, 73, 87, 49, 150, 29, 217, 251, 190, 247, 255, 45, 237, 202, 156, 26, 231, 13, 114, 170, 231, 116, 139, 117, 34, 252, 122, 95, 146, 78, 177, 167, 231, 24, 42, 55, 50, 9, 201, 224, 173, 201, 153, 204, 5, 219, 147, 104, 132, 124, 52, 219, 74, 43, 212, 159, 1, 133, 74, 12, 85, 195, 232, 231, 16, 59, 190, 98, 1, 38, 222, 164, 52, 113, 31, 42, 114, 164, 222, 154, 74, 242, 83, 188, 163, 162, 135, 59, 127, 5, 217, 90, 27, 91, 124, 33, 248, 239, 98, 58, 218, 127, 220, 136, 110, 10, 42, 73, 102, 64, 136, 249, 116, 68, 153, 103, 4, 165, 210, 111, 143, 119, 75, 182, 97, 70, 93, 171, 221, 238, 231, 202, 111, 160, 111, 35, 126, 254, 88, 190, 125, 160, 69, 85, 223, 230, 225, 180, 189, 57, 32, 75, 148, 91, 58, 163, 14, 73, 51, 254, 2, 14, 203, 168, 109, 141, 29, 225, 52, 108, 13, 52, 54, 155, 172, 191, 153, 125, 225, 190, 93, 114, 36, 205, 35, 48, 60, 144, 215, 202, 204, 57, 18, 118, 14, 147, 161, 143, 250, 45, 143, 65, 224, 84, 216, 197, 96, 210, 10, 160, 52, 230, 209, 109, 39, 45, 143, 132, 126, 114, 74, 7, 31, 45, 60, 252, 46, 164, 87, 128, 38, 225, 187, 169, 63, 243, 221, 220, 205, 167, 103, 27, 124, 115, 184, 21, 55, 115, 9, 104, 162, 39, 189, 176, 22, 175, 89, 189, 148, 187, 215, 107, 84, 90, 202, 96, 131, 199, 111, 39, 240, 230, 122, 137, 238, 212, 15, 81, 108, 118, 198, 133, 91, 18, 173, 171, 194, 116, 15, 160, 216, 183, 167, 172, 194, 114, 23, 77, 12, 35, 252, 66, 192, 98, 21, 37, 29, 73, 204, 83, 118, 198, 102, 166, 91, 251, 66, 117, 97, 61, 99, 143, 7, 122, 149, 189, 148, 253, 25, 208, 151, 150, 243, 6, 100, 162, 152, 176, 5, 48, 164, 119, 86, 58, 245, 188, 191, 183, 200, 22, 172, 239, 95, 114, 138, 173, 251, 199, 248, 157, 90, 192, 93, 89, 206, 229, 84, 82, 30, 98, 19, 18, 42, 202, 29, 25, 67, 54, 159, 146, 188, 236, 148, 60, 203, 55, 58, 66, 217, 113, 253, 79, 13, 35, 253, 91, 16, 44, 172, 36, 2, 68, 183, 244, 69, 53, 110, 61, 228, 149, 12, 101, 61, 86, 211, 122, 152, 68, 69, 145, 7, 208, 57, 93, 91, 31, 14, 142, 163, 8, 156, 22, 154, 142, 187, 80, 192, 100, 221, 184, 249, 185, 221, 133, 74, 153, 67, 105, 189, 186, 185, 71, 82, 216, 226, 52, 69, 238, 44, 106, 34, 236, 199, 68, 141, 131, 252, 47, 9, 213, 11, 17, 31, 234, 115, 186, 222, 147, 77, 196, 1, 20, 144, 89, 226, 207, 65, 128, 12, 138, 213, 175, 85, 7, 180, 28, 136, 198, 216, 55, 103, 59, 153, 110, 195, 193, 202, 20, 207, 134, 44, 128, 190, 3, 83, 166, 125, 130, 68, 218, 106, 38, 193, 95, 81, 156, 99, 85, 107, 98, 64, 2, 211, 235, 176, 1, 12, 218, 141, 40, 150, 220, 170, 57, 94, 8, 152, 53, 103, 130, 141, 102, 224, 130, 59, 206, 3, 235, 14, 113, 74, 193, 197, 94, 27, 181, 221, 167, 150, 81, 193, 14, 212, 232, 101, 104, 157, 4, 81, 119, 11, 93, 45, 61, 71, 223, 11, 119, 162, 156, 228, 63, 156, 110, 148, 177, 85, 23, 17, 42, 67, 142, 58, 118, 112, 199, 215, 24, 54, 251, 43, 175, 137, 161, 32, 161, 38, 78, 231, 249, 136, 68, 235, 249, 180, 77, 33, 156, 93, 173, 217, 26, 1, 118, 224, 21, 60, 169, 159, 66, 169, 87, 192, 50, 254, 4, 228, 152, 169, 23, 180, 10, 164, 178, 30, 164, 3, 243, 173, 244, 55, 40, 116, 202, 182, 116, 100, 72, 55, 138, 241, 235, 49, 128, 145, 104, 26, 254, 141, 101, 16, 125, 54, 239, 45, 0, 103, 215, 218, 31, 158, 215, 97, 104, 87, 45, 146, 18, 164, 252, 46, 0, 101, 234, 211, 183, 62, 130, 57, 238, 51, 209, 85, 67, 128, 33, 10, 167, 149, 176, 189, 237, 244, 99, 28, 6, 121, 119, 183, 32, 108, 88, 245, 165, 153, 181, 153, 51, 71, 142, 71, 9, 254, 24, 204, 95, 196, 3, 34, 188, 225, 84, 206, 7, 157, 159, 242, 174, 188, 170, 39, 240, 133, 52, 129, 88, 151, 44, 11, 187, 239, 245, 192, 18, 57, 182, 161, 133, 110, 12, 178, 128, 144, 89, 47, 206, 243, 222, 2, 181, 137, 29, 228, 181, 133, 20, 98, 135, 210, 56, 218, 162, 123, 139, 111, 230, 228, 247, 76, 252, 228, 136, 149, 129, 131, 122, 162, 43, 132, 165, 118, 77, 140, 168, 89, 122, 250, 225, 65, 90, 60, 4, 213, 71, 237, 205, 210, 26, 28, 95, 200, 94, 132, 72, 92, 199, 126, 37, 136, 87, 152, 226, 172, 36, 201, 191, 110, 86, 50, 81, 47, 120, 59, 16, 239, 108, 46, 205, 194, 93, 52, 186, 95, 147, 174, 128, 220, 217, 105, 108, 121, 193, 48, 136, 206, 71, 204, 66, 41, 138, 178, 222, 215, 79, 118, 140, 0, 211, 58, 124, 81, 11, 172, 174, 187, 101, 221, 124, 8, 153, 242, 136, 5, 118, 42, 243, 208, 188, 71, 30, 65, 251, 218, 131, 101, 220, 112, 41, 115, 252, 123, 16, 18, 142, 20, 151, 239, 200, 161, 5, 196, 168, 112, 249, 82, 169, 130, 132, 202, 135, 92, 139, 251, 183, 70, 215, 34, 226, 65, 223, 212, 213, 179, 64, 131, 213, 250, 216, 43, 171, 150, 142, 239, 108, 66, 194, 246, 48, 69, 195, 166, 24, 197, 224, 63, 195, 5, 132, 131, 214, 218, 65, 5, 146, 98, 195, 112, 121, 192, 145, 72, 229, 193, 182, 53, 210, 7, 12, 139, 143, 19, 184, 151, 117, 4, 234, 212, 36, 199, 100, 106, 187, 168, 212, 115, 48, 201, 239, 33, 29, 26, 162, 94, 117, 137, 84, 143, 238, 144, 66, 142, 98, 58, 93, 26, 107, 90, 79, 113, 171, 146, 158, 1, 153, 111, 48, 232, 126, 120, 114, 61, 159, 191, 106, 154, 157, 96, 31, 42, 60, 238, 188, 203, 88, 125, 154, 239, 97, 228, 120, 220, 241, 123, 235, 22, 13, 220, 205, 19, 30, 15, 6, 28, 22, 183, 3, 162, 191, 200, 195, 184, 187, 45, 32, 173, 180, 77, 168, 212, 79, 102, 50, 219, 27, 163, 123, 144, 24, 159, 103, 219, 188, 46, 143, 193, 254, 38, 63, 214, 137, 122, 213, 196, 137, 150, 245, 153, 179, 28, 192, 211, 251, 96, 189, 109, 178, 132, 117, 42, 171, 74, 154, 52, 219, 86, 12, 55, 5, 2, 104, 233, 229, 132, 1, 86, 57, 143, 55, 83, 23, 178, 187, 254, 245, 145, 51, 179, 59, 197, 118, 49, 14, 253, 189, 219, 135, 37, 5, 212, 84, 240, 53, 195, 147, 88, 233, 45, 252, 237, 3, 66, 200, 165, 255, 189, 214, 71, 44, 75, 18, 92, 222, 194, 51, 169, 62, 216, 113, 47, 205, 166, 12, 163, 100, 48, 104, 75, 19, 83, 64, 204, 83, 149, 194, 229, 93, 223, 65, 104, 147, 59, 158, 254, 203, 9, 62, 15, 107, 42, 92, 117, 149, 128, 51, 205, 11, 64, 206, 187, 145, 23, 126, 41, 65, 25, 52, 165, 152, 139, 26, 81, 72, 107, 223, 223, 242, 122, 115, 111, 52, 220, 27, 84, 55, 141, 92, 36, 146, 136, 97, 237, 196, 168, 69, 217, 252, 1, 18, 158, 161, 218, 100, 186, 252, 112, 152, 148, 116, 30, 118, 133, 8, 19, 138, 136, 50, 109, 180, 225, 221, 171, 138, 140, 219, 194, 53, 216, 152, 237, 58, 114, 57, 229, 39, 122, 170, 168, 222, 46, 144, 55, 199, 30, 234, 6, 104, 86, 64, 18, 42, 111, 80, 207, 57, 64, 129, 234, 56, 237, 117, 138, 130, 110, 141, 39, 137, 4, 247, 52, 96, 244, 134, 213, 135, 140, 218, 54, 183, 195, 243, 179, 113, 29, 191, 92, 164, 183, 88, 197, 60, 35, 214, 3, 250, 149, 205, 165, 204, 225, 46, 78, 40, 73, 140, 172, 237, 47, 100, 173, 190, 91, 223, 153, 191, 51, 195, 26, 216, 89, 96, 130, 128, 185, 188, 248, 244, 201, 200, 104, 240, 102, 108, 127, 66, 99, 252, 236, 110, 251, 25, 95, 24, 56, 98, 14, 214, 59, 187, 86, 208, 197, 42, 209, 229, 146, 232, 66, 41, 110, 113, 70, 4, 253, 7, 12, 91, 77, 148, 216, 255, 143, 24, 185, 34, 65, 159, 146, 201, 102, 177, 177, 142, 179, 41, 10, 206, 251, 72, 186, 196, 24, 168, 77, 134, 146, 242, 141, 78, 238, 183, 67, 137, 11, 223, 163, 196, 28, 202, 50, 87, 39, 1, 169, 80, 58, 139, 27, 84, 17, 89, 200, 179, 56, 36, 116, 252, 114, 165, 6, 179, 6, 71, 137, 123, 67, 7, 148, 163, 133, 82, 23, 107, 43, 58, 198, 65, 72, 174, 130, 245, 38, 3, 254, 68, 169, 70, 116, 99, 149, 186, 84, 114, 147, 213, 100, 103, 222, 56, 189, 156, 225, 96, 58, 156, 0, 17, 86, 213, 8, 134, 46, 136, 30, 11, 11, 247, 97, 229, 80, 0, 12, 226, 247, 49, 102, 152, 8, 183, 31, 4, 151, 11, 188, 3, 11, 27, 5, 19, 184, 6, 190, 213, 104, 188, 0, 0, 7, 65, 195, 30, 60, 0, 0, 223, 109, 64, 130, 237, 214, 14, 160, 176, 40, 27, 216, 147, 27, 9, 68, 165, 25, 73, 146, 192, 72, 249, 89, 190, 220, 55, 61, 146, 249, 212, 81, 61, 64, 162, 97, 161, 102, 79, 186, 150, 13, 37, 121, 24, 189, 69, 247, 56, 202, 2, 217, 206, 0, 99, 86, 203, 165, 149, 53, 174, 201, 202, 97, 113, 32, 107, 121, 77, 196, 192, 220, 62, 146, 75, 38, 210, 88, 35, 210, 226, 150, 186, 27, 238, 84, 82, 247, 52, 113, 63, 254, 158, 156, 69, 244, 95, 139, 53, 75, 133, 21, 198, 31, 199, 92, 44, 187, 3, 32, 2, 140, 106, 179, 80, 119, 149, 201, 194, 55, 184, 167, 183, 20, 50, 194, 81, 62, 181, 146, 157, 140, 71, 120, 8, 43, 173, 184, 74, 116, 148, 116, 108, 246, 12, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 13, 6, 137, 177, 239, 236, 22, 3, 42, 144, 166, 108, 232, 130, 10, 93, 18, 206, 254, 91, 121, 192, 138, 188, 92, 92, 122, 195, 226, 212, 169, 31, 80, 106, 16, 4, 149, 101, 83, 203, 7, 200, 64, 216, 252, 84, 87, 224, 52, 63, 5, 67, 56, 252, 142, 223, 73, 194, 52, 119, 31, 134, 214, 12, 196, 135, 1, 136, 3, 131, 169, 176, 171, 247, 16, 0, 0, 0, 0, 0, 0, 0, 5, 42, 130, 161, 75, 5, 183, 162, 118, 19, 150, 78, 89, 249, 239, 152, 208, 143, 151, 199, 114, 90, 242, 137, 175, 148, 247, 102, 96, 66, 224, 163, 67, 83, 165, 204];
                    let ab = new ArrayBuffer(chunk.length * Uint8Array.BYTES_PER_ELEMENT);
                    let view = new Uint8Array(ab);
                    chunk.forEach((elem, idx) =>{ view[idx]= elem;});
                    view = null;
                    audioCtx.decodeAudioData(ab, ()=>{ resolve(true);}, () =>{ resolve(false); });
                } catch(err) {
                    resolve(false);
                }
            });
        };
        if (window.localStorage) {
            let tempData = localStorage.getItem(_ogg.key);
            if (tempData) {
                try {
                    tempData = JSON.parse(tempData);
                    if (tempData.hasOwnProperty("supportOgg")) _ogg.supportOgg = tempData.supportOgg;
                    callback(_ogg.supportOgg);
                } catch (error) {

                }
            } else {
                checkOgg().then(res =>{
                    localStorage.setItem(_ogg.key, JSON.stringify({supportOgg:res}));
                    callback(res);
                });
            }
        } else checkOgg().then(res =>{callback(res)});
    }

    initialize();
    // -- PUBLIC METHODS ***********************************************************************************************
    Object.defineProperty(this, 'gfx', { enumerable: true, 'configurable': false, 'value': p['gfx'] });
    Object.defineProperty(this, 'h264', { enumerable: true, 'configurable': false, 'value': p['h264'] });
    Object.defineProperty(this, 'agentStr', { enumerable: true, 'configurable': false, 'value': p['agentStr'] });
    Object.defineProperty(this, 'protocol', { enumerable: true, 'configurable': false, 'get': function () { return p['protocol']; } });
    Object.defineProperty(this, 'majorVersion', { enumerable: true, 'configurable': false, 'value': p['majorVersion'] });
    Object.defineProperty(this, 'isWindows', { enumerable: true, 'configurable': false, 'value': p['isWindows'] });
    Object.defineProperty(this, 'isMac', { enumerable: true, 'configurable': false, 'value': p['isMac'] });
    Object.defineProperty(this, 'isIOS', { enumerable: true, 'configurable': false, 'value': p['isIOS'] });
    Object.defineProperty(this, 'iosVersion', { enumerable: true, 'configurable': false, 'value': p['iosVersion'] });
    Object.defineProperty(this, 'ipadModel', { enumerable: true, 'configurable': false, 'get': function () { return p['ipadModel']; } });
    Object.defineProperty(this, 'iosBuildVersion', { enumerable: true, 'configurable': false, 'value': p['iosBuildVersion'] });
    Object.defineProperty(this, 'isIphone', { enumerable: true, 'configurable': false, 'value': p['isIphone'] });
    if (p['isIphone'] == true) {
        Object.defineProperty(this, 'iphoneModel', { enumerable: true, 'configurable': false, 'value': p['iphoneModel'] });
    }
    Object.defineProperty(this, 'isIpod', { enumerable: true, 'configurable': false, 'value': p['isIpod'] });
    Object.defineProperty(this, 'isAndroid', { enumerable: true, 'configurable': false, 'value': p['isAndroid'] });
    Object.defineProperty(this, 'isHPTablet', { enumerable: true, 'configurable': false, 'value': p['isHPTablet'] });
    Object.defineProperty(this, 'isPlaybook', { enumerable: true, 'configurable': false, 'value': p['isPlaybook'] });
    Object.defineProperty(this, 'isChromeOS', { enumerable: true, 'configurable': false, 'value': p['isChromeOS'] });
    // -- IN02155 - Android-chrome backspace is not working.
    Object.defineProperty(this, 'chromeOSVersion', { enumerable: true, 'configurable': false, 'value': p['chromeOSVersion'] });
    // -- IN02155 - Android-chrome backspace is not working.
    // -- =============================================================================================================
    Object.defineProperty(this, 'isSymbian', { enumerable: true, 'configurable': false, 'value': p['isSymbian'] });
    Object.defineProperty(this, 'isFirefox', { enumerable: true, 'configurable': false, 'value': p['isFirefox'] });
    Object.defineProperty(this, 'isOpera', { enumerable: true, 'configurable': false, 'value': p['isOpera'] });
    Object.defineProperty(this, 'isChrome', { enumerable: true, 'configurable': false, 'value': p['isChrome'] });
    Object.defineProperty(this, 'chromeVersion', { enumerable: true, 'configurable': false, 'value': p['chromeVersion'] });
    Object.defineProperty(this, 'isNokiaBrowser', { enumerable: true, 'configurable': false, 'value': p['isNokiaBrowser'] });
    Object.defineProperty(this, 'isSafari', { enumerable: true, 'configurable': false, 'value': p['isSafari'] });
    Object.defineProperty(this, 'isMSIE', { enumerable: true, 'configurable': false, 'value': p['isMSIE'] });
    Object.defineProperty(this, 'isYandex', { enumerable: true, 'configurable': false, 'value': p['isYandex'] });
    // -- IN02155 - Android-chrome backspace is not working.
    Object.defineProperty(this, 'isDragon', { enumerable: true, 'configurable': false, 'value': p['isDragon'] });
    Object.defineProperty(this, 'dragonVersion', { enumerable: true, 'configurable': false, 'value': p['dragonVersion'] });
    // -- IN02155 - Android-chrome backspace is not working.
    Object.defineProperty(this, 'isChromium', { enumerable: true, 'configurable': false, 'value': p['isChromium'] });
    Object.defineProperty(this, 'msieVersion', { enumerable: true, 'configurable': false, 'value': p['msieVersion'] });
    Object.defineProperty(this, 'msieOSVersion', { enumerable: true, 'configurable': false, 'value': p['msieOSVersion'] });
    Object.defineProperty(this, 'msieHTMLVersion', { enumerable: true, 'configurable': false, 'value': p['msieHTMLVersion'] });
    Object.defineProperty(this, 'browserName', { enumerable: true, 'configurable': false, 'get': getBrowserName });
    Object.defineProperty(this, 'firefoxVersion', { enumerable: true, 'configurable': false, 'value': p['firefoxVersion'] });
    // -- BUG4168 - Windows phone 10 is detected as Android.
    Object.defineProperty(this, 'isWindowsPhone', { enumerable: true, 'configurable': false, 'value': p['isWindowsPhone'] });
    // -- BUG4168 - Windows phone 10 is detected as Android.
    // -- IN02351 - Cannot initialize touch in Window tablet mode.
    Object.defineProperty(this, 'isMobile', { enumerable: true, 'configurable': false, 'get': function () { return p['isMobile']; } });
    Object.defineProperty(this, 'isTouch', { enumerable: true, 'configurable': false, 'get': function () { return p['isTouch']; } });
    //Object.defineProperty(this, 'isTouch', { enumerable: true, 'configurable': false, 'value': p['isTouch'] });
    // -- IN02351 - Cannot initialize touch in Window tablet mode.
    Object.defineProperty(this, 'getAgentKey', { enumerable: true, 'configurable': false, 'value': getAgentKey });
    Object.defineProperty(this, 'browserFromAgent', { enumerable: true, 'configurable': false, 'value': browserFromAgent });
    Object.defineProperty(this, 'hasObjectURL', { enumerable: true, 'configurable': false, 'value': p['hasObjectURL'] });
    Object.defineProperty(this, 'hasArrayBuffers', { enumerable: true, 'configurable': false, 'value': p['hasArrayBuffers'] });
    Object.defineProperty(this, 'hasTypedArrays', { enumerable: true, 'configurable': false, 'value': p['hasTypedArrays'] });
    Object.defineProperty(this, 'hasWorkers', { enumerable: true, 'configurable': false, 'value': p['hasWorkers'] });
    // -- IN01767 - Cannot access to WAN (Do not use workers if is not necessary);
    Object.defineProperty(this, 'hasTransferableObjects', { enumerable: true, 'configurable': false, 'get': function () { return getTransferableObjects(); } });
    // -- IN01767 - End
    Object.defineProperty(this, 'supportsAsmJsWorkers', { enumerable: true, 'configurable': false, 'get': function () { return p['supportsAsmJsWorkers']; } });
    Object.defineProperty(this, 'supportsRFXDecoder', { enumerable: true, 'configurable': false, 'get': function () { return p['supportsRFXDecoder']; } });
    Object.defineProperty(this, 'supportsFullScreen', { enumerable: true, 'configurable': false, 'value': supportsFullScreen });
    Object.defineProperty(this, 'addAsyncDetectionCallback', { enumerable: true, 'configurable': false, 'value': addAsyncDetectionCallback });
    Object.defineProperty(this, 'runAsyncDetections', { enumerable: true, 'configurable': false, 'value': runAsyncDetections });
    Object.defineProperty(this, 'supportHTML5', { enumerable: true, 'configurable': false, 'get': function () { return supportHTML5(); } });
    Object.defineProperty(this, 'supportAudioAutoPlay', { enumerable: true, 'configurable': false, 'get': function () { return apaSupported; } });
    Object.defineProperty(this, 'detectTouch', { enumerable: true, 'configurable': false, writable: false, 'value': detectTouch });

    // -- IN02351 - Cannot initialize touch in Window tablet mode.
    // Object.defineProperty(this, '__update__', { enumerable: true, 'configurable': false, 'writable': false, 'value': updateProperty });
    Object.defineProperty(this, 'isTabletMode', { enumerable: true, 'configurable': false, 'get': function () { return p['isTabletMode']; } });
    // -- IN02538 - Get remote browser timezone from application.
    Object.defineProperty(this, 'timeZone', { enumerable: true, 'configurable': false, 'get': function () { return p['timeZone']; } });
    Object.defineProperty(this, 'compareVersions', { enumerable: true, 'configurable': false, 'value': compareVersions });
    Object.defineProperty(this, 'isOlderThan', { enumerable: true, 'configurable': false, 'value': isOlderThan });
    Object.defineProperty(this, 'isNewerThan', { enumerable: true, 'configurable': false, 'value': isNewerThan });
    Object.defineProperty(this, 'isSameVersion', { enumerable: true, 'configurable': false, 'value': isSameVersion });
    Object.defineProperty(this, 'supportOggFormat', { enumerable: true, 'configurable': false, 'value': supportOggFormat });

    // -- IN02538 - Get remote browser timezone from application.
    Object.defineProperty(this, '__setInitializationData__', { enumerable: true, 'configurable': false, 'writable': false, 'value': setInitializationData });
    // -- IN02351 - Cannot initialize touch in Window tablet mode.
    // -- END PUBLIC METHODS *******************************************************************************************
    return this;
};
var agentInfo = null;
try {
    agentInfo = new AgentInfo();
} catch (error) {
    // --document.write("Warning, your browser do not support HTML 5.");
}
// -- For any versions of old browsers, check if the current browser support HTML5
if ((typeof agentInfo == 'undefined') || (agentInfo == null)) {
    agentInfo = new Object();
    agentInfo['supportHTML5'] = false;
}

// *************************************************************************************************************************
// End AgentInfo ***********************************************************************************************************
// *************************************************************************************************************************
