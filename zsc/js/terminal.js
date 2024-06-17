var zscopeTerminal = null;
var zscopeHLLAPI = null;
var establishingConnection = null;
var sessionTimeout = {
    growl: null,
    lastValue: null
};
helper.dom.ready(function () {
    // -- TERMINAL
    // -- ===========================================================
    zscopeTerminal = new zScope.Terminal({ 'postData': (Thinfinity.global.variables.data || '') });
    var connEnvironment = environment.getEnvironmentInformation();
    // -- Events
    zscopeTerminal.on('loading', function (status) {
        helper.console.log("Loading...", arguments);
        var animated = true;
        var msg = "Establishing Connection...";
        var msgDetail = "Loading";
        if (status && status.description) msgDetail = status.description;
        Thinfinity.Popups.establishing.show(msg, msgDetail, animated, false);
    });

    zscopeTerminal.on('connect',function () {
        // -- TODO
        helper.console.log("connect", arguments);
        Thinfinity.Popups.establishing.hide();
    });

    zscopeTerminal.on("sessionTimeout", function (jData) {
        var showGrowlSessionPopup = function () {
            sessionTimeout.growl = Thinfinity.Popups.growl({
                'message': jData.message,
                'icon': false,
                'type': Thinfinity.Popups.growl.type.WARNING
            });
        };
        let showGrowlPopup = false;
        if (jData.minutesToClose > 1) {
            showGrowlPopup = sessionTimeout.lastValue != jData.minutesToClose;
            sessionTimeout.lastValue = jData.minutesToClose;
        } else { sessionTimeout.lastValue = null; showGrowlPopup = true; }
        if (showGrowlPopup) {
            if (sessionTimeout.growl && !sessionTimeout.growl.destroyed) sessionTimeout.growl.message = jData.message;
            else showGrowlSessionPopup();
        }
        helper.console.log("onSessionTimeout: " + jData.secondsToClose + " seconds.", arguments);
    });

    zscopeTerminal.on('disconnect', function () {
        // -- TODO
        helper.console.log("disconnect", arguments);
    });

    zscopeTerminal.on('close',function (status) {
        // -- TODO
        helper.console.log("close", arguments);
        if (status) {
            var msg = "Terminal closed";
            var msgDetail = "";
            var close = false;
            if (status.description) msgDetail = status.description;
            if (status.close) close = status.close;
            var wndClose = window.close;
            function closeWndTab() {
                if (status.closeTab && status.wnd) wndClose();
                Thinfinity.Popups.unblock();

                let win = connEnvironment.mainWindow;

                document.body.innerHTML = "<div class='bye'>" + thinzs_consts.connClosed + "</div>";
                if (win && connEnvironment.inNewWindow) {
                    win.close();
                }
            }
            var goToMain = function () {
                //Beta-V7
                if (connEnvironment?.webV7) {
                    window.parent.postMessage({ to: 'webV7', type: 'connection', cmd: 'close', meta: connEnvironment.webV7 }, '*');
                    return;
                }
                function checkBroker() {
                    var info = {
                        "withBroker": false,
                        "fromIndex": false
                    }
                    if (window.parent) {
                        var pLoc = "";
                        try {
                            pLoc = window.parent.location.href;
                        } catch (e) { }
                        if (pLoc != "") {
                            var wLoc = location.href;
                            var pURL = pLoc.split("/");
                            var vPath = "/" + pURL.splice(pURL.length - 2, 1) + "/";
                            var server = pURL.join("/");
                            if (wLoc.match(server + ".*" + vPath) != null) {
                                info.withBroker = true;
                                info.fromIndex = parent.document.referrer == server;
                            }
                        }
                    }
                    return info;
                }
                if (status.closeTab) {
                    closeWndTab();
                } else if ((window.top == window) && (document.referrer) && (location.href != document.referrer)) {
                    // -- if a referrer exists...
                    location.href = document.referrer;
                } else if ((typeof url != 'undefined') && (url != '') && (url != null)) {
                    // -- The url argument is used to enable going back to a specific page, when virtualPath is used and url is not null.
                    window.location.href = url;
                } else {
                    // -- if the application was opened in a new window...
                    closeWndTab();
                }
            };
            if (window?.customSettings?.noShowConnectionClosePopup === true) goToMain();
            else setTimeout(function(){ Thinfinity.Popups.alert(msgDetail + "<br/>" + msg, "", "disconnectedDlg", "", "", goToMain, false); }, 500);
        }
    });

    zscopeTerminal.on('error',function (er) {
        // -- TODO
        helper.console.log("error " + er.message || er, arguments);
        Thinfinity.Popups.establishing.hide();
    });

    //zscopeTerminal.on("licenseMsg", function (obj) {
    //    // -- TO CUSTOMIZE
    //    // console.log (`License error: ${obj.title}, Description: ${obj.errorMsg}`);
    //});
    // -- Caption
    //zscopeTerminal.caption = true;

    // -- Font Family
    //zscopeTerminal.fontFamily = 'zscope';

    // -- HLLAPI
    // -- ===========================================================
    //zscopeHLLAPI = new zScope.HLLAPI();

    //zscopeHLLAPI.on('psupdate', function (screen) {
    //    // -- TODO
    //});

    //zscopeHLLAPI.on('querySessions', function (querysessions) {
    //    // -- TODO
    //});


    // -- Connect terminal
    // -- ===========================================================
    zscopeTerminal.connect();
});