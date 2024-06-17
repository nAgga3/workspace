// =============================================================================================================================
// Copyright 2020, CybeleSoft
// CYBELESOFT
// 20200716.1
// info@cybelesoft.com
// =============================================================================================================================
// -- Required:
// -- helper.js
// *****************************************************************************************************************************
// THINFINITY.PROFILE.RDPMAPPING CLASS *****************************************************************************************
// *****************************************************************************************************************************
(function () {
    function RDPMapping(args) {
        // -- PRIVATE VARIABLES ************************************************************************************************
        var _ref = this;
        var _args = {
            'mapping': null,
            'methods': { 'propertyValue': null },
            'API': null
        };
        var _propertyValue = function () { };
        var _mappings = null;
        // -- END PRIVATE VARIABLES ********************************************************************************************
        // -- PRIVATE METHODS **************************************************************************************************
        function initialize() {
            helper.object.parseAttributes(_args, args);
            if (_args.methods.propertyValue) _propertyValue = _args.methods.propertyValue;
            initializeMappings();
        };
        function initializeMappings() {
            _mappings = {
                'dictionary': {
                    'publickey': 'publickey',

                    'general.address': 'host.address',
                    'general.remoteId': 'remoteId',
                    'general.name': 'name',
                    'general.virtualPath': 'virtualPath',
                    'general.icon': 'icon',
                    'general.username': 'host.username',
                    'general.password': 'host.password',
					'general.credentials': 'host.credentials',

                    'display.colorDepth': 'host.bpp',
                    'display.imageQuality': 'host.imgquality',
                    'display.resolution.height': 'host.screenheight',
                    'display.resolution.mode': 'host.screenres',
                    'display.resolution.width': 'host.screenwidth',

                    'resources.clipboard': 'clipboard',
                    'resources.clipboardFileTransfer': 'clipboardFileTransfer',
                    'resources.disk.enabled': 'disk.enabled',
                    'resources.disk.name': 'disk.name',
                    'resources.disk.autoDownload': 'disk.autodownload',
                    'resources.printer.enabled': 'printer.enabled',
                    'resources.printer.name': 'printer.name',
                    'resources.printer.driver': 'printer.driver',
                    'resources.printer.setAsDefault': 'printer.setasdefault',
                    'resources.sound.enabled': 'sound.enabled',
                    'resources.sound.quality': 'sound.quality',

                    'program.onConnection': 'host.appmode',
                    'program.programPath': 'host.appcmdline',
                    'program.arguments': 'host.appcmdargs',
                    'program.folder': 'host.appworkdir',
                    'program.showSystemWindows': 'host.showonstart',

                    'experience.smartSizing': 'host.smartSizing',
                    'experience.touchRedirection': 'host.enableTouchRedirection',
                    'experience.remoteFX': 'host.enableRemoteFx',

                    'advanced.unicodeKeyboard': 'host.unicodekbd',
                    'advanced.keyboardLayout': 'host.kbdlayout',
                    'advanced.consoleSession': 'host.console',
                    'advanced.disableNLALogin': 'host.nonnlaonerror',
                    'advanced.TLSversion': 'host.forceTLSVersion',
                    'advanced.webSocketCompression': 'host.websocketcompression',
                    'advanced.recordRDSession': 'host.saveRDSessions',
                    'advanced.relativeTouch': 'host.relativetouch',
                    'advanced.holdDelay': 'host.touchDragDelay',
                    'advanced.minDragDistance': 'host.dragDist',
                    'remotePass': 'remotePass',
                    'byPassConfiguration': 'byPassConfiguration',

                },
                'computed': {
                    'display.resolution.value': { 'set': setResolutionValues, 'get': getResolutionValues, 'target': 'host.screenres' }, // string
                    'display.resizeDesktop': { 'set': setResizeDesktop, 'get': getResizeDesktop, 'target': 'host.resizedesktop' },
                    'experience.visualEffects': { 'set': setVisualEffects, 'get': getVisualEffects, 'target': 'host.visualeffects', 'node': 'experience' },
                    'general.labels': { "set": setLabelList, 'get': getLabelList, 'target': 'labels' }
                }
            };
        };
        function getResolutionValues(obj) {
            var value = helper.object.getValue(obj, "display.resolution.value");
			if (_args.API.resolution.hasOwnProperty(value)) {
				value = _args.API.resolution[value];
				helper.object.setValue(obj, "display.resolution.width", 0);
                helper.object.setValue(obj, "display.resolution.height", 0);
				helper.object.setValue(obj, "display.resolution.mode", value);
            } else {
                var aSize = value.split("x");
                helper.object.setValue(obj, "display.resolution.width", parseInt(aSize[0], 10));
                helper.object.setValue(obj, "display.resolution.height", parseInt(aSize[1], 10));
				helper.object.setValue(obj, "display.resolution.mode",  _args.API.resolution.CUSTOM);
				value = _args.API.resolution.CUSTOM;
            }
            return value;
        };
        function setResolutionValues(profileObj) {
            var value = "";
            var mode = helper.object.getValue(profileObj, "host.screenres", _propertyValue('DEFAULT_SCREENMODE'));
            switch (mode) {
                case _args.API.resolution.FIT_TO_BROWSER:
                case _args.API.resolution.FIT_TO_SCREEN:
                    value = _args.API.resolution.getKey(mode);
                    break;
                default:
                    var height = helper.object.getValue(profileObj, "host.screenheight", _propertyValue('DEFAULT_SCREENHEIGHT'));
                    var width = helper.object.getValue(profileObj, "host.screenwidth", _propertyValue('DEFAULT_SCREENWIDTH'));
					if (!isNaN(height)&&!isNaN(width)) {
						value = width + "x" + height;
					} else {
						helper.console.error("An error occurs when processing the received profile resolution. height: " + height + " - width: " + width);
						value = _args.API.resolution.getKey(_args.API.resolution.FIT_TO_BROWSER);
					}
            }
            return value;
        };
		function getResizeDesktop(obj) {
            var resValue = helper.object.getValue(obj, "display.resolution.value");
            var resize = helper.object.getValue(obj, "display.resizeDesktop");
            return resize && resValue == _args.API.resolution.getKey(_args.API.resolution.FIT_TO_BROWSER);
		};
		function setResizeDesktop(profileObj) {
			return helper.object.getValue(profileObj, "host.resizedesktop");
		};
        function setLabelList(profileObj) {
            var getLabels = function (labels) {
                var aLabels = (labels) ? labels.split(";") : [];
                var result = aLabels.extract(function (elem) { return typeof "string" && elem.length != 0 });
                return result;
            };

            var labelIDs = getLabels(profileObj.labels);
            // PATCH: Solve server error
            profileObj.labels = labelIDs.join(";");
            //
            return labelIDs;
        };
        function getLabelList(viewObject) {
            return viewObject.general.labels.join(";");
        };
        function setVisualEffects(profileObj, obj) {
            _args.API.graphicExperience.integerToObject(profileObj.host.visualeffects, obj);
            return profileObj.host.visualeffects;
        };
        function getVisualEffects(viewObject) {
            return _args.API.graphicExperience.objectToInteger(viewObject.experience);
        };
        // -- END PRIVATE METHODS **********************************************************************************************
        initialize(args);
        // -- PUBLIC METHODS ***************************************************************************************************
        Object.defineProperty(_ref, 'mapping', { 'enumerable': false, 'configurable': false, 'get': function () { return _mappings; } });
        // -- END PUBLIC METHODS ***********************************************************************************************

        return _ref;
    };
    try { Thinfinity != undefined; }
    catch (e) { Thinfinity = {}; }
    if (Thinfinity.Profile == undefined) Thinfinity.Profile = {};
    if (Thinfinity.Profile.Mapping == undefined) Thinfinity.Profile.Mapping = {};
    // -- Can force to create a new instance each time.
    Thinfinity.Profile.Mapping.RDP = RDPMapping;
})();
// *****************************************************************************************************************************
// END THINFINITY.PROFILE.RDPMAPPING  CLASS ************************************************************************************
// *****************************************************************************************************************************
