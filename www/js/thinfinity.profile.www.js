// =============================================================================================================================
// Copyright 2020, CybeleSoft
// CYBELESOFT
// 20200715.1
// info@cybelesoft.com
// =============================================================================================================================
// -- Required:
// -- helper.js
// -- thinrdp.graphic.experience.js
// -- thinfinity.events.js
// *****************************************************************************************************************************
// THINFINITY.RDP.PROFILE CLASS ************************************************************************************************
// *****************************************************************************************************************************
(function () {
    function RDPProfile() {
        // -- PRIVATE VARIABLES ************************************************************************************************
        var _ref = this;
        var _args = {};
        var _defaultProfile = null;
        var _viewObj = null;
        var _API = ThinRDP;
        var _KIND = null;
        var _defaults = {
            'DEFAULT_TLS_VERSION': null,
            'HOLD_DELAY_MS': null,
            'MIN_DRAG_DISTANCE': null,
            'DEFAULT_SCREENMODE': null,
            'DEFAULT_SCREENHEIGHT': null,
            'DEFAULT_SCREENWIDTH': null,
            'DEFAULT_IMGQUALITY': null,
            'DEFAULT_BPP': null,
            'DEFAULT_SOUND_QUALITY': null,
            'ON_CONNECT_ACTION': null,
            'DEFAULT_PROGRAM_ACTION': null,
            'DEFAULT_GATEWAY_PORT': null,
            'KBD_LAYOUT': null,
            'THINDISK': null,
            'LOCALHOST': null,
            'DEFAULT_ICON': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB3UlEQVRYR+3WO6jPYRzH8ddJKJcQExZks2BBBgZFQmKQkEUGRbkll0ySQmFQDISQTrkMp1CyoJQzGFwGBkkk5Z7LcelT3yMLw9/pfwb/Z/rdnufzfj7f59f306aXR1sv62sBdDvQD32bXI4ufA7ACCzHaPxoEkR0n+NkLqZjL67hRZMAhmA2dgdgDjZgPe43CWAUDuFcN0DE1zYZ4DDaWwAtB1oOtBz4bx0YimW401sORLc/uhoBOI+v6eW4h7u4gamYjy/Vah/iFl5iFibhNd7iGW7jXSMAEe4o0ZHVTXdiLHYg12m3M3ETu7Adk3EV4zGxvu0IQPryZmzCg7+04wgnxXzEPpzCOOzBQQwvoWHog5XYWICrMBD7a07mH8CxAEzD0bIzFv1pnMb1sv8pXuE7rtT8JdiGwbVALL+IFZiLhXhU7qRM69AZgEFYiilF/ieAE5Wa3pcDqWUyRCw/WwtuRRzIWFRJK4EnbkzApTofnXiSCNhILP+ALThSAjOwppyMA6uRkLugDl1KmxInbwb20+87bATgOM7gMsaUeP6EnI15eFOlSei8gMdYXADtVcJfDI0ApMY5kKlj5g+oxb/VzvMsu837fJeRfz6j+/6fAHo0tzbiQAugRx34CezClNE4VMIPAAAAAElFTkSuQmCC',
            'DEFAULT_PASSWORD_MASK': '****************'
        };
        //var _licenseType = helper.object.getValue(global, 'variables.license', 0);
        var fireEvent = null;
        // -- END PRIVATE VARIABLES ********************************************************************************************
        // -- PRIVATE METHODS **************************************************************************************************
        function initialize(args) {
            helper.object.parseAttributes(_args, args);
            var te = new Thinfinity.Events({ 'owner': _ref, 'events': _args.events });
            fireEvent = te.fireEvent;
            initializeDefaultValues();
            setDefaultProfile();
            //setMappings();
            setViewObject();
            _viewObj.layout.mode = helper.url.gup('mode');
        };
        function initializeDefaultValues() {
            _defaults.DEFAULT_TLS_VERSION = _API.TLSVersion.TLS_V1_2;
            _defaults.HOLD_DELAY_MS = 75;
            _defaults.MIN_DRAG_DISTANCE = 32;
            _defaults.DEFAULT_SCREENMODE = _API.resolution.FIT_TO_BROWSER;
            _defaults.DEFAULT_SCREENHEIGHT = 600;
            _defaults.DEFAULT_SCREENWIDTH = 800;
            _defaults.DEFAULT_IMGQUALITY = _API.imageQuality.OPTIMUM;
            _defaults.DEFAULT_BPP = _API.colorDepth.HIGH_COLOR;
            _defaults.DEFAULT_SOUND_QUALITY = _API.soundQuality.OPTIMUM;
            _defaults.ON_CONNECT_ACTION = helper.object.createEnum("DO_NOTHING", "START_A_PROGRAM", "REMOTEAPP");
            _defaults.DEFAULT_PROGRAM_ACTION = _defaults.ON_CONNECT_ACTION.DO_NOTHING;
            _defaults.DEFAULT_GATEWAY_PORT = 3389;
            _defaults.KBD_LAYOUT = fillKeyboardLayout();
            _defaults.THINDISK = "ThinDisk";
            _defaults.LOCALHOST = "127.0.0.1";
        };
        function fillKeyboardLayout() {
            var keyboardLayout = {};
            var options = [];
            var kbds = null;
            var tempDefaultKbd = null;
            kbds = Thinfinity.global.variables.kblayouts;
            for (var k in kbds) {
                if (tempDefaultKbd == null && kbds[k] == 'US') {
                    tempDefaultKbd = k;
                }
                if (k == 'default') tempDefaultKbd = kbds[k];
                else options.push({ 'value': k, 'text': kbds[k] });
            }
            options.sort(function (a, b) { return (a.text.toLowerCase() < b.text.toLowerCase()) ? -1 : 1 });
            keyboardLayout.options = options;
            keyboardLayout.defaultKeyboard = tempDefaultKbd;
            return keyboardLayout;
        };
        function setDefaultProfile() {
            _defaultProfile = {
                'name': '',
                'publickey': '',
                'virtualPath': '',
                'icon': _defaults.DEFAULT_ICON,
                'clipboardEnabled': true,
                'users': [],
                'password': _defaults.DEFAULT_PASSWORD_MASK,
                'loadbalanceInfo': '',
                'host': {
                    //'address': '',
                    'port': _defaults.DEFAULT_GATEWAY_PORT,
                    //'username': '',
                    //'password': '',
                    'visualeffects': _API.visualEffect.VISUAL_STYLES + _API.visualEffect.FONT_SMOOTHING,
                    'screenres': _defaults.DEFAULT_SCREENMODE,
                    'imgquality': _defaults.DEFAULT_IMGQUALITY,
                    'bpp': _defaults.DEFAULT_BPP,
                    'unicodekbd': true,
                    'console': false,
                    'credentials': 1,
                    'kbdlayout': _defaults.KBD_LAYOUT.defaultKeyboard,
                    'appmode': 0,
                    'appcmdline': '',
                    'showonstart': true,
                    'appcmdargs': '',
                    'appworkdir': '',
                    'persistentcache': false,
                    'websocketcompression': true,
                    'relativetouch': true,
                    'nonnlaonerror': false,
                    'dragDist': _defaults.MIN_DRAG_DISTANCE,
                    'enableRemoteFx': false,
                    'enableTouchRedirection': false,
                    'touchDragDelay': _defaults.HOLD_DELAY_MS,
                    'saveRDSessions': false,
                    'forceTLSVersion': _defaults.DEFAULT_TLS_VERSION,
                    'smartSizing': true,
                    'resizedesktop': true
                },
                'gateway': {
                    'port': _defaults.DEFAULT_GATEWAY_PORT
                },
                'reconnectonresize': false,
                'printer': {
                    'enabled': false,
                    'setasdefault': true,
                    'name': consts.ThinRDPPrinter,
                    'driver': consts.MicrosoftXPSV4
                },
                'disk': {
                    'enabled': false,
                    'name': _defaults.THINDISK,
                    'autodownload': false
                },
                'sound': {
                    'enabled': false,
                    'quality': _defaults.DEFAULT_SOUND_QUALITY
                },
                'scraperId': 'rdp',
                'remoteId': '',
                'restriction': {
                    'action': 0,
                    'iplist': ''
                },
                'labels': null
            };
        };
        // -- CAN BE AN EXTERNAL CLASS (INTERFACE)
        // -- MUST BE REGISTRABLE
        function setViewObject() {
            _viewObj = {
                'layout': {
                    'tabbar': false,
                    'showTabsScroller': false,
                    'selectedTab': 'Display',
                    'saveasIsVisible': false,
                    'modified': false,
                    'savable': false,
                    'userFromList': false,
                    'connectable': false,
                    'labelListVisible': false,
                    'mode': null
                },
                'extra': {
                    'savedAddresses': [],
                    'savedUsers': [],
                    'username': '',
                    'disk': { 'options': [_defaults.THINDISK] },
                    'printer': {
                        'names': [consts.ThinRDPPrinter],
                        'drivers': [consts.MicrosoftXPSV4, consts.HPLaserJet8500, consts.HPLaserJet2800, consts.HPLaserJet2700]
                    },
                    'labels': [],
                    'defaultLabel': null,
                    'keyboardLayout': _defaults.KBD_LAYOUT,
                },
                'authenticated': false,// _WND_REF.authenticated,
                'profile': {
                    'publickey': '',
                    'general': {
                        'address': '',
                        'remoteId': '',
                        'username': '',
                        'password': '',
                        'name': '',
                        'virtualPath': '',
                        'icon': _defaults.DEFAULT_ICON,
                        'labels': []
                    },
                    'display': {
                        'colorDepth': _defaults.DEFAULT_BPP,
                        'resolution': {
                            'mode': _defaults.DEFAULT_SCREENMODE,
                            'height': _defaults.DEFAULT_SCREENHEIGHT,
                            'width': _defaults.DEFAULT_SCREENWIDTH
                        },
                        'imageQuality': _defaults.DEFAULT_IMGQUALITY,
                        'resizeDesktop': true
                    },
                    'resources': {
                        'clipboardEnabled': true,
                        'disk': {
                            'enabled': true,
                            'name': '',
                            'autoDownload': true
                        },
                        'printer': {
                            'enabled': false,
                            'setAsDefault': false,
                            'name': '',
                            'driver': '',
                        },
                        'sound': {
                            'enabled': false,
                            'quality': _defaults.DEFAULT_SOUND_QUALITY
                        }
                    },
                    'program': {
                        'onConnection': _defaults.DEFAULT_PROGRAM_ACTION,
                        'programPath': '',
                        'arguments': true,
                        'folder': '',
                        'showSystemWindows': true
                    },
                    'experience': {
                        'visualEffects': 0,
                        'smartSizing': false,
                        'touchRedirection': false,
                        'remoteFX': false,
                        'desktopBackground': false,
                        'visualStyles': false,
                        'menuWindowAnimation': false,
                        'fontSmoothing': false,
                        'showWindowContent': false,
                        'desktopComposition': false
                    },
                    'advanced': {
                        'unicodeKeyboard': false,
                        'keyboardLayout': 0,
                        'consoleSession': false,
                        'disableNLALogin': false,
                        'TLSversion': _defaults.DEFAULT_TLS_VERSION,
                        'webSocketCompression': true,
                        'recordRDSession': false,
                        'relativeTouch': false,
                        'holdDelay': _defaults.HOLD_DELAY_MS,
                        'minDragDistance': _defaults.MIN_DRAG_DISTANCE
                    },
                    'remotePass': '',
                    'byPassConfiguration': false
                }
            };
            //_viewObj.layout.hasProfiles = true;
        };
        function getDefaultPropertyValue(propertyName) {
            return _defaults[propertyName];
        };
        // -- END PRIVATE METHODS **********************************************************************************************
        initialize();
        // -- PUBLIC METHODS ***************************************************************************************************
        //Object.defineProperty(_ref, 'API', { 'enumerable': false, 'configurable': false, 'get': function () { return _API; } });
        //Object.defineProperty(_ref, 'initialize', { 'enumerable': false, 'configurable': false, 'writable': false, 'value': initialize });
        Object.defineProperty(_ref, 'getProfile', { 'enumerable': false, 'configurable': false, 'writable': false, 'value': function () { return _defaultProfile; } });
        Object.defineProperty(_ref, 'getView', { 'enumerable': false, 'configurable': false, 'writable': false, 'value': function () { return _viewObj; } });
        Object.defineProperty(_ref, 'defaults', { 'enumerable': false, 'configurable': false, 'get': getDefaultPropertyValue });
        // -- END PUBLIC METHODS ***********************************************************************************************
        return _ref;
    };
    try { Thinfinity != undefined; }
    catch (e) { Thinfinity = {}; }
    if (Thinfinity.Profile == undefined) Thinfinity.Profile = {};
    // -- Can force to create a new instance each time.
    Thinfinity.Profile.RDP = RDPProfile;
})();
// *****************************************************************************************************************************
// END THINFINITY.RDP.PROFILE  CLASS *******************************************************************************************
// *****************************************************************************************************************************