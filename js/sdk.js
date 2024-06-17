var server = '';
var myThinRDP = null;
var msgs = null;
var size = { 'width': null, 'height': null };
var HOLD_DELAY_MS = 75;
var MIN_DRAG_DISTANCE = 32;

function reset() {
    setRunningState(false);
    msgs.innerHTML = '';
    document.getElementById('deskdiv').innerHTML = '';
    document.getElementById('txtOtUrl').value = '';
    document.getElementById('btnReset').disabled = 'disabled';
};

function toogleButtons(enabled) {
    var menu = document.querySelector('div.menu');
    var b;
    var buttons = menu.querySelectorAll("input[type='button'].toggle");
    for (b = 0; b < buttons.length; b++) {
        buttons[b].disabled = !enabled;
    }
};

function setRunningState(isRunning) {
    if (!isRunning) helper.style.replace(document.body, 'running', '');
    else if (!helper.style.hasClass(document.body, 'running')) helper.style.addClass(document.body, 'running');
};

function clearMessages() {
    msgs.innerHTML = "";
};

function getEvents() {
    return {
        'onServerConnecting': function (reconnecting) {
            //-- formerly "establishingConnection" event binding
            console.log("onServerConnecting");
            msgs.innerHTML = "Connecting...";
        },
        'onServerConnect': function (obj) {
            //-- formerly "serverConnect" event binding
            console.log("onServerConnect");
            toogleButtons(true);
            msgs.innerHTML = "Connected to Thinfinity Remote Desktop Server";
        },
        'onInteractionRequired': function (cmd) {
            //--created to unblock the interface
        },
        'onServerConnectionError': function (errMessage) {
            console.log("onServerConnectionError");
            //--formerly "disconnectConfirmRequest" event bindig
            // alert("connect error: " + errMessage);
            msgs.innerHTML = "Connect error: " + errMessage;
            document.getElementById('btnReset').removeAttribute('disabled');
        },
        'onServerDisconnect': function () {
            console.log("onServerDisconnect");
            //--formerly "serverDisconnect" event bindig
            toogleButtons(false);
            msgs.innerHTML = "Disconnected";
            size.info.style.visibility = "hidden";
            document.getElementById('btnReset').removeAttribute('disabled');
            return true;
        },
        'onExecResult': function (cmd) {
            //--formerly "execResult" event bindig
            msgs.innerHTML = "Exec result: " + JSON.stringify(cmd);
            //return true;
        },
        // onFileReady: function (sURL) { }, // custom printing and automatic download
        'onSessionEnd': function (message) {
            console.log("onSessionEnd");
            //--formerly "sessionEnd" event bindig
            msgs.innerHTML = "Session end: " + message;
        },
        'onBrokerError': function () {
            console.log("Broker error, cannot connect throught the same connection, need to reload o connect from zero");
            // -- reconnect from the beginning.
            toogleButtons(false);
        },
        'onSessionStart': function (obj) {
            console.log("onSessionStart");
            //--formerly "sessionStart" event bindig
            msgs.innerHTML = "Session start";
            size.info.style.visibility = "visible";
        },
        'onPropertyChange': function (obj) {
            msgs.innerHTML = obj.property + ": " + JSON.stringify(obj.value);
        },
        'onExecRemoteApp': function (cmd) {
            msgs.innerHTML = "Exec Remote App: " + JSON.stringify(cmd);
        },
        'onShareSession': function (obj) {
            alert(JSON.stringify(obj));
        },
        'onQueryDisconnect': function () {
            msgs.innerHTML = "Request disconnect";
            // -- Use timeout, to avoid to stop main thread.
            //setTimeout(function () {
            //    if (confirm("Close the connection?")) {
            //        myThinRDP.disconnect();
            //    }
            //}, 10);
            // -- Return TRUE to handle event locally, and avoid the default event treatment.
            return false;
        },
        'onServerNeedCredentials': function () {
            console.log("onServerNeedCredentials");;
        },
        'onLoginCancel': function () {
            console.log("onSessionEnd");
            //--formerly "sessionEnd" event bindig
            msgs.innerHTML = "Login canceled";
            toogleButtons(false);
            size.info.style.visibility = "hidden";
            document.getElementById('btnReset').removeAttribute('disabled');
        },
        'onWidthChange': function (e) {
            console.log("property has been " + e.event + " - " + e.name + ": " + e.value);
            size.width.innerHTML = e.value;
        },
        'onHeightChange': function (e) {
            console.log("property has been " + e.event + " - " + e.name + ": " + e.value);
            size.height.innerHTML = e.value;
        }
    };
};

function goOTURL(oturl) {
    var oturl = document.getElementById('txtOtUrl').value;
    window.name = 'oturl_remote';
    clearMessages();
    myThinRDP = new ThinRDP(server, {
        'success': function () { helper.console.log("success"); setRunningState(true); },
        'failure': function (msg) { helper.console.log("fail. " + msg); alert(msg); setRunningState(false); },
        'targetWindow': 'deskdiv',
        'events': getEvents(),
        'oturl': oturl
    });
    return myThinRDP;
};

function goSDK() {
    window.name = 'SDK_remote';
    clearMessages();
    // -- If you decide to use only the profile key, without any subscription or override, you can use the virtualPath directly.
    myThinRDP = new ThinRDP(server, {
        'success': function () { helper.console.log("success"); setRunningState(true); },
        'failure': function (msg) { helper.console.log("fail. " + msg); alert(msg); setRunningState(false); },
        'targetWindow': 'deskdiv',
        'events': getEvents(),
        // -- You can use a profileKey
        //'profileKey': '', //complete profileId, not applicable in ThinRDP Workstation

        // -- OR...

        // -- You can overrides profile values with your custom values directly.
        // -- The next examples shows the default structure for RDP or RFB connections.
        // -- Also, you don't need to define all the values. Please only declare the entries
        // -- related to the field you want to override.

        // -- If you want to use this method, please select the right structure for the connection.

        // 'profile': { // --> JSON profile, YOU CAN USE RDP OR RFB
        ////-- RDP JSON profile:
        //    'general': {
        //        'address': '',
        //        'username': '',
        //        'password': '',
        //        'port': 3389,
        //        'credentials': ThinRDP.credential.USE_DEFINED //["USE_AUTH", "ASK", "USE_DEFINED"]
        //    },
        //    'display': {
        //        'resolution': ThinRDP.resolution.CUSTOM,// ["CUSTOM", "FIT_TO_BROWSER", "FIT_TO_SCREEN"]
        //        'width': 800,
        //        'height': 600,
        //        'resizeDesktop':true, // -- only valid when resolution is FIT_TO_BROWSER
        //        'imageQuality':ThinRDP.imageQuality.OPTIMUM, //["HIGHEST", "OPTIMUM", "GOOD", "FASTEST"]
        //        'colorDepth':ThinRDP.colorDepth.HIGH_COLOR, // ["LOW_COLOR", "HIGH_COLOR", "TRUE_COLOR24", "TRUE_COLOR32"]
        //        'fullscreen': document.getElementById('fullscreen').checked, // -- to run in fullscreen mode a valid user gesture will be required.
        //    },
        //    'resources': {
        //        'clipboardEnabled': true,
        //        'disk': {
        //            'enabled': false,
        //            'name': 'ThinDisk',
        //            'autoDownload': false
        //        },
        //        'printer': {
        //            'enabled': false,
        //            'setAsDefault': true,
        //            'name': 'Printer',
        //            'driver': 'Microsoft XPS Document Writer V4'
        //        },
        //        'sound': {
        //            'enabled': false,
        //            'quality': ThinRDP.soundQuality.OPTIMUM, //["HIGHEST", "OPTIMUM", "GOOD", "FASTEST"]
        //        },
        //        'clipboard': true
        //    },
        //    'program': {
        //        'startprg': ThinRDP.applicationAction.NONE, //["NONE", "START_PROGRAM", "RUN_REMOTEAPP"],
        //        'programPath': '',
        //        'arguments': '',
        //        'folder': '',
        //        'showSystemWindows': true
        //    },
        //    'experience': {
        //        'smartSizing': true,
        //        'touchRedirection': false,
        //        'remoteFX': false,
        //        'desktopBackground': true,
        //        'visualStyles': true,
        //        'menuWindowAnimation': false,
        //        'fontSmoothing': false,
        //        'showWindowContent': false,
        //        'desktopComposition': false
        //    },
        //    'advanced': {
        //        'unicodeKeyboard': true,
        //        'keyboardLayout': '1033',
        //        'consoleSession': false,
        //        'disableNLALogin': false,
        //        'TLSversion': ThinRDP.TLSVersion.TLS_V1_2, //["NEGOTIATE", "TLS_V1_0", "TLS_V1_1", "TLS_V1_2", "TLS_V1_3"]
        //        'webSocketCompression': true,
        //        'recordRDSession': false,
        //        'relativeTouch': true,
        //        'holdDelay': HOLD_DELAY_MS,
        //        'minDragDistance': MIN_DRAG_DISTANCE
        //    },
        //    'scraperId': 'rdp'
        //}
        //// --> END RDP JSON profile
        //// ========================

        //// -- RFB JSON profile:
        //   'general': {
        //       'address': '',
        //       'password': '',
        //       'port': 5900
        //   },
        //    'display': {
        //        'colorDepth': Thinfinity.Profile.RFB.COLOR_DEPTH.TRUE_COLOR, // ["LOW_COLOR", "TRUE_COLOR"]
        //        'encoding': Thinfinity.Profile.RFB.ENCONDING.HEXTILE,
        //        'displayMode': Thinfinity.Profile.RFB.DISPLAY_MODE.BLOCK,
        //        'customCompressionLevel': 6,
        //        'JPEGCompressionLevel': 6,
        //        'allowCopyRect': true,
        //        'showWallpaper': true,
        //        'smartScaling': true
        //    },
        //    'control': {
        //        'allowMouseControl': true
        //    },
        //    'advanced': {
        //        'relativeTouch': true,
        //        'holdDelay': HOLD_DELAY_MS,
        //        'minDragDistance': MIN_DRAG_DISTANCE
        //    },
        //    'scraperId': 'rfb'
        //// -- END RFB JSON profile
        //}
    });
    return myThinRDP;
};
/*
THIS IS A DEMO, AND ONLY SHOWS A WAY TO INTEGRATE THINRDP WITH A RDP CONNECTION, ANYWAY YOU CAN USE (RFB, SSH OR RDP)

KEYSTROKE AVAILABLE METHODS:
===========================================

ThinRDP.sendText(textValue)
Sends a text value to the current cursor position.
Argument:
textValue: String - Text to be sent.

**********************
ThinRDP.sendKeyStroke(keyCode)
Sends a key code, emulating press and release of key.
Argument:
keyCode: Number - Number representing the key the user pressed and released.

**********************
ThinRDP.sendKeyDown(keyCode)
Sends a key down
Argument:
keyCode: Number - Number representing the key the user pressed.
Used, i.e., to send a CTRL, ALT or SHIFT hold-down to start a special combination key sequence.

**********************
ThinRDP.sendKeyUp(keyCode)
Sends a key up
Argument:
keyCode: Number - Number representing the key the user released.
Used, i.e., to send a CTRL, ALT or SHIFT release to end a special combination key sequence.

**********************
ThinRDP.sendCtrlAltDel()
Sends a CTRL+ALT+DEL sequence.
Arguments: None.

**********************
ThinRDP.sendShiftCtrlEsc()
Sends a CTRL+ALT+DEL sequence.
Arguments: None.

**********************
ThinRDP.sendShellExplorer()
Sends a CTRL+ALT+E (or WINDOWS+E) sequence.
Arguments: None.

**********************
ThinRDP.sendShellRun()
Sends a CTRL+ALT+R (or WINDOWS+R) sequence.
Arguments: None.

**********************
ThinRDP.sendCtrlEsc()
Sends a CTRL+ESC sequence.
Arguments: None.

**********************
ThinRDP.sendCut()
Sends a CTRL+X sequence.
Arguments: None.

**********************
ThinRDP.sendCopy()
Sends a CTRL+C sequence.
Arguments: None.

**********************
ThinRDP.sendPaste()
Sends a CTRL+V sequence.
Arguments: None.    */


// Send an ENTER...
function sendEnter() {
    if (myThinRDP) myThinRDP.sendKeyStroke(13);
};

// Select the next word on Notepad, Word Processor, etc.
function selectNextWord() {
    if (myThinRDP) {
        myThinRDP.sendKeyDown(0x11); //CTRL
        myThinRDP.sendKeyDown(0x10); //SHIFT
        myThinRDP.sendKeyStroke(39); // RIGHT ARROW
        myThinRDP.sendKeyUp(0x10); //SHIFT
        myThinRDP.sendKeyUp(0x11); //CTRL
    }
};

// Select a line of text from text cursor position to the next row.
function selectLine() {
    if (myThinRDP) {
        myThinRDP.sendKeyDown(0x10); //SHIFT
        myThinRDP.sendKeyStroke(40); // DOWN ARROW
        myThinRDP.sendKeyUp(0x10); //SHIFT
    }
};

// Inserts the phrase into the current text cursor position.
function sendText() {
    if (myThinRDP) {
        myThinRDP.sendText("This is a test...");
        sendEnter();
    }
};

// Close the current session
function sendDisconnect() {
    if (myThinRDP) myThinRDP.disconnect();
};

function attachHandlers() {
    helper.dom.addEvent(document.getElementById('btnSendEnter'), 'click', sendEnter, false);
    helper.dom.addEvent(document.getElementById('btnSelectLine'), 'click', selectLine, false);
    helper.dom.addEvent(document.getElementById('btnSelectWord'), 'click', selectNextWord, false);
    helper.dom.addEvent(document.getElementById('btnSendText'), 'click', sendText, false);
    helper.dom.addEvent(document.getElementById('btnDisconnect'), 'click', sendDisconnect, false);
    helper.dom.addEvent(document.getElementById('btnReset'), 'click', reset, false);

    helper.dom.addEvent(document.getElementById('btnGoOTURL'), 'click', goOTURL, false);
    helper.dom.addEvent(document.getElementById('btnGoSDK'), 'click', goSDK, false);
};

function renderPage() {
    helper.dom.ready(function () {
        msgs = document.getElementById('smessage');
        size.info = document.getElementById('sizeInfo');
        size.height = document.getElementById('sizeHeight');
        size.width = document.getElementById('sizeWidth');
        attachHandlers();
    });
}

renderPage();



