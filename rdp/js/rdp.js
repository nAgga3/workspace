var rdp = null;

helper.dom.ready(function () {
    // Foreach event, return 'true' to prevent default execution.
    rdp = new Thinfinity.RDP();

    rdp.onLoading = function (jData) {
        helper.console.log("onLoading", arguments);
        // -- TO CUSTOMIZE
    };
    rdp.onError = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onError", arguments);
    };

    rdp.onShow = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onShow", arguments);
    };

    rdp.onClose = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onClose", arguments);
    };

    rdp.onSessionStart = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onSessionStart", arguments);
    };

    rdp.onSessionTimeout = function (jData) {
        helper.console.log("onSessionTimeout: " + jData.secondsToClose + " seconds.", arguments);
    };

    rdp.onSessionEnd = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onSessionEnd", arguments);
    };

    rdp.onExecRemoteApp = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onExecRemoteApp", arguments);
    };
    rdp.onExecResult = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onExecResult", arguments);
    };
    rdp.onMessage = function (jData) {
        // -- TODO
        //return false;
    };
    rdp.onWakeOnLan = function (jData) {
        helper.console.log("onWakeOnLan - " + jData.message, arguments);
    };
    rdp.onWaitForVM = function (jData) {
        helper.console.log("onWaitForVM - " + jData.message, arguments);
    };

    //rdp.onConnectionLost = function (jData) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log("onConnectionLost", arguments);
    //};

    //rdp.onConnectionRestored = function (jData) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log("onConnectionRestored", arguments);
    //};

    rdp.onBeforeUnload = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onBeforeUnload", arguments);
    };
    //rdp.onLicenseMsg = function (obj) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log(`License error: ${obj.title}, Description: ${obj.errorMsg}`);
    //}
    //rdp.onReceiveMessage = function (jData) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log("onReceiveMessage", arguments);
    //};

    // rdp.clipboard.onCopy = function (obj) {
    //     helper.console.log(`Copy: ${obj.cmd} ${obj.cmd === 'err' ? obj.msg : ''}`);
    // };
    // rdp.clipboard.onPaste = function (obj) {
    //     helper.console.log(`Paste: ${obj.cmd} ${obj.cmd === 'err' ? obj.msg : ''}`);
    // };
    // rdp.clipboard.onCut = function (obj) {
    //     helper.console.log(`Cut: ${obj.cmd} ${obj.cmd === 'err' ? obj.msg : ''}`);
    // };
    // -- Allow to set async copy handler, setting async copy will show a gif popup during the copy/paste event, until finish.
    // rdp.clipboard.async = true;

    // -- TK-1769 - Shadowed session notification
    // rdp.onShadowingStatus = function(shadowed) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log("onShadowingStatus", arguments);
    // };
    // -- TK-1769 - Shadowed session notification


    rdp.connect();
});