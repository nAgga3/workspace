var rfp = null;
helper.dom.ready(function () {
    // Foreach event, return 'true' to prevent default execution.
    rfb = new Thinfinity.RFB();

    rfb.onLoading = function (jData) {
        helper.console.log("onLoading", arguments);
        // -- TO CUSTOMIZE
    };
    rfb.onError = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onError", arguments);
    };

    rfb.onShow = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onShow", arguments);
    };

    rfb.onClose = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onClose", arguments);
    };

    rfb.onSessionStart = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onSessionStart", arguments);
    };

    rfb.onSessionTimeout = function (jData) {
        helper.console.log("onSessionTimeout: " + jData.secondsToClose + " seconds.", arguments);
    };

    rfb.onSessionEnd = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onSessionEnd", arguments);
    };
    rfb.onWakeOnLan = function (jData) {
        helper.console.log("onWakeOnLan - " + jData.message, arguments);
    };
    rfb.onReconnectionAttempt = function (jData) {
        helper.console.log("onReconnectionAttempt - " + jData.message, arguments);
    };
    ////rfb.onMessage = function (jData) {
    ////    // -- TODO
    ////    //return false;
    ////};

    //rfb.onConnectionLost = function (jData) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log("onConnectionLost", arguments);
    //};

    //rfb.onConnectionRestored = function (jData) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log("onConnectionRestored", arguments);
    //};

    rfb.onBeforeUnload = function (jData) {
        // -- TO CUSTOMIZE
        helper.console.log("onBeforeUnload", arguments);
    };
    //rfb.onLicenseMsg = function (obj) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log(`License error: ${obj.title}, Description: ${obj.errorMsg}`);
    //}
    //rfb.onReceiveMessage = function (jData) {
    //    // -- TO CUSTOMIZE
    //    helper.console.log("onReceiveMessage", arguments);
    //};
    rfb.onWidthChange= function (e) {
        helper.console.log("property has been " + e.event + " - " + e.name + ": " + e.value);
        size.width.innerHTML = e.value;
    };

    rfb.onHeightChange = function (e) {
        helper.console.log("property has been " + e.event + " - " + e.name + ": " + e.value);
        size.height.innerHTML = e.value;
    }

    rfb.connect();
});