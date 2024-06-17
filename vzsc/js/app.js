const legacyVersion = false;
var vzscApp = null;

// -- Popup templates consts
var vuiAppConsts = {
    "popupBlockedMsg": "The Pop-up Blocker is enabled! Please add this site to the exception list or click here:",
    "pleaseSelectAFile": "Please, select or drop a file:",
    "unknownError": "Please contact your support team.",
    "invalidFileType": "Invalid file type",
    "serverMsgDefault": "Server Message",
    "noFileSelected": "No file selected",
    "measuresUnit": "Measures unit:",
    "measuresUnits": ["Default", "Millimeters", "Inches"],
    "clickToSelectFile": "Click to select file",
    "numCopies": "Number of copies",
    "printAllPages": "Print all",
    "printSelection": "Selection",
    "printPageNums": "Pages",
    "download": "Download",
    "portrait": "Portrait",
    "landscape": "Landscape",
    "size": "Size",
    "top": "Top",
    "bottom": "Bottom",
    "left": "Left",
    "right": "Right",
    "print": "Print",
    "close": "Close",
    "cancel": "Cancel",
    "ok": "Ok",
};

helper.dom.ready(function () {
    // Foreach event, return 'true' to prevent default execution. (Default return value will be 'true')
    vzscApp = new Thinfinity.VirtualUI();

    vzscApp.onError = function (errorMsg) {
        //console.log(`onError. Message: ${errorMsg}`);
    };

    vzscApp.onLoading = function (status) {
        //console.log(`onLoading. Status: ${JSON.stringify(status)}`);
    };

    vzscApp.onShow = function () {
        //console.log(`onShow`);
    };

    vzscApp.onClose = function (url, status, message) {
        //console.log(`onClose`);
    };

    vzscApp.onConnectionLost = function (status) {
        //status = { 'code': int, 'message': string }
        //console.log(`onConnectionLost. Code: ${status.code}, message: ${status.message}`);
    };

    vzscApp.onConnectionRestored = function (status) {
        //status = { 'code': int, 'message': string }
        //console.log(`onConnectionRestored. Code: ${status.code}, message: ${status.message}`);
    };

    vzscApp.onBeforeUnload = function (msg) {
        //console.log(`onBeforeUnload. Message: ${msg}`);
    };

    vzscApp.onSessionStart = function (jData) {
        //console.log("onSessionStart", arguments);
    };

    vzscApp.onSessionEnd = function (jData) {
        //console.log("onSessionEnd", arguments);
    };

    vzscApp.onProcessInfo = function (processInfo) {
        //console.log(`onProcessInfo. processId: ${processInfo.processId}`)
    };

    vzscApp.onReceiveMessage = function (message) {
        //console.log(`onReceiveMessage. message: ${message}`)
    };

    vzscApp.onLogin = function (loggedIn) {
        //console.log(`Is logged in: ${loggedIn}`);
    };

    vzscApp.onLogout = function (loggedOut) {
        // -- Is logged out.
        //console.log(`Is logged out: ${loggedOut}`);
        //if (!loggedOut) {
            //console.log(`Application closed, but the current user is still logged in`);
        //}
    };

    // -- Connect to server...
    // -- "ClientSettings" values are used during the start of the connection and then are no longer taken into account, only used as query.
    // -- Set values or leave as default.
    vzscApp.clientSettings = {
        // -- Leave as default, server rules (Is not necessary to assign value).
        //'CursorVisible': null,
        //'OverrideCursor': null, // true - Overrides the browser cursor pointer (default), false - it uses a canvas image instead the browser cursor pointer.
        //'MouseMoveGestureStyle': null,
        //'MouseMoveGestureStyle': null, vzscApp.enumMouseMoveGestureStyle[ABSOLUTE,RELATIVE],
        //'MouseMoveGestureAction': null,
        //'MousePressAsRightButton': null, // -- Allow the browser treat press event as right button.
        // -- Set default values, JS rules.
        //'MouseWheelDirection': null, // 0 - Normal (default), 1 - Inverted (finger direction)
        'MouseWheelZoom': false, // -- Allow the browser to capture the ctrl mouse wheel, instead the app.
        'UseViewportSize': false,
        'DockMenu': {
            'Enabled': false,
            'Pinned': (agentInfo.isMobile) ? true : false,
            //'Style': 'default', // Display mode, how the windows are displaying. -Values: ['Taskbar','Default|Menu'];
            //'Embedded': false, // Force the cutout of the desktop area
            'Items': {
                'WindowList': true,
                'ErrorReporting': false,
                'Keyboard': true,
                'Fullscreen': true,
                'TabletModeAvailable': false
            }
        },
        //'PreventMobileKeyboardDisplay': false, // true - Prevents auto opening virtual keyboard on mobile devices when focusing on input
        //'PrintDialog': {
        //    'DefaultMethod': PrintDialog.printMethods.DEFAULT, // PrintDialog.printMethods [DEFAULT:0, DIRECT_PRINT:1, GOOGLE_CLOUD_PRINT:2] (Google Cloud Print)
        //    'BypassDialog': false
        //},
        // 'Mobile': {
        //    'KeyboardCaretWait': 200,
        //    'Gestures': [
        //      /*
        //      ===========
        //      Directions: 'DIRECTION_ALL', 'DIRECTION_VERTICAL', 'DIRECTION_HORIZONTAL', 'DIRECTION_LEFT', 'DIRECTION_UP', 'DIRECTION_RIGHT', 'DIRECTION_DOWN'
        //      ===========
        //      Types:
        //         ['TAP', 'PAN', 'PRESS', 'PINCH', 'SWIPE', 'PRESSANDRELEASE', 'PRESSANDTAP', 'PANANDTAP', 'SWIPEFROMEDGE', 'RELEASE']
        //          *TAP    [Options: pointers, taps, interval, time, threshold, posThreshold]
        //          *PAN    [Options: pointers, threshold, direction]
        //          *PINCH  [Options: pointers, threshold]
        //          *PRESS  [Options: pointers, threshold, time]
        //          *SWIPE  [Options: pointers, threshold, direction]
        //      ===========
        //      Actions:
        //      //        ['mouseMove', 'click', 'doubleClick', 'rightClick', 'zoomOrWheel', 'wheel', 'zoom', 'zoomPan', 'contextMenu', 'keyboard', 'menu', 'closeMenu', 'focus', 'holdLeft', 'holdRight', 'releaseLeft', 'releaseRight', 'releaseAll']
        //      ===========
        //      Example: { 'type': 'TAP', 'pointers': 2, 'taps': 1, 'threshold': 15, 'action': ['rightClick'] },
        //      */
        //    ]
        // }
    };

    //vzscApp.clipboard.onCopy = function (obj) {
    //    // console.log(`Copy: ${obj.cmd} ${obj.cmd === 'err' ? obj.msg : ''}`);
    //};
    //vzscApp.clipboard.onPaste = function (obj) {
    //    // console.log(`Paste: ${obj.cmd} ${obj.cmd === 'err' ? obj.msg : ''}`);
    //};
    //vzscApp.clipboard.onCut = function (obj) {
    //    // console.log(`Cut: ${obj.cmd} ${obj.cmd === 'err' ? obj.msg : ''}`);
    //};
    //// -- Allow to set async copy handler, setting async copy will show a gif popup during the copy/paste event, until finish.
    //vzscApp.clipboard.async = false;

    vzscApp.connect();
});