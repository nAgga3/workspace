// =========================================================================================================================
// Copyright 2019, CybeleSoft
// CYBELESOFT
// 20190415.1
// info@cybelesoft.com
// =========================================================================================================================
// Required:
// -- agentInfo.js
// -- helper.js
// *************************************************************************************************************************
// VNC (AS CONNECTION) WRAPPER *********************************************************************************************
// *************************************************************************************************************************
(function () {
    // -- PRIVATE VARIABLES ************************************************************************************************
    var THIN = null;
    var connected = false;
    var runInNewWindow = false;
    var runInFullScreen = false;
    var autoStart = false;
    var closing = false;
    var manualClose = false;
    var publicExposeRef = window;
    var connEnvironment = null;
    var eventsList = {};
    var toolbar = null;
    var crossDomain = false;
    var embeddedCross = false;
    var _data = null;
    // -- END PRIVATE VARIABLES ********************************************************************************************
    // -- PRIVATE METHODS **************************************************************************************************

    function getConnectionEnvironment() {
        var wndp = null;
        var wb = true;
        if (window.parent && window != window.parent) {
            try {
                if (window.parent.location.href) wndp = window.parent;
                wb = (wndp && wndp.location.host == window.location.host &&
                    wndp.location.protocol == window.location.protocol &&
                    window.location.pathname.endsWith(wndp.location.pathname));
            } catch (error) { wndp = window; }
        } else wndp = window;
        var mw = (wndp != window && wndp == top) ? wndp : window;
        var inFullScreen = crossDomain || embeddedCross ? false : (!!window.top.document.body.querySelector('div.fullscreen-container'));
        var inw = window.frameElement == null && ((mw.opener && mw != mw.opener) || mw.document.referrer == mw.document.location.href || mw.document.referrer == "" || (wndp == window && window.document.referrer.indexOf('oturl') != -1));// || (crossDomain && wndp == window));
        var referrer = (inw ? '' : window.document.referrer);
        var sameOrigin = (helper.url.parseUrl(referrer).toUrl('-vp-a-p')) === helper.url.parseUrl(window.location).toUrl('-vp-a-p');

        var info = {
            "withBroker": wb,
            "referrer": referrer,
            "fromIndex": (inFullScreen || inw) ? false : sameOrigin,
            "mainWindow": mw,
            'inFullScreen': inFullScreen,
            "inNewWindow": inw
        };
        return info;
    };

    function terminate(message) {
        if (closing) return false;
        closing = true;
        fireHandler('terminate', message);
        if (toolbar) toolbar.destroy();
        function doTerminate() {
            if (typeof message == "undefined") { message = ""; }
            if (runInFullScreen) runInNewWindow = false;
            if ((runInNewWindow && THIN && (THIN.rcParams.exitURL == "" || THIN.rcParams.exitURL == "about:blank")) || (THIN && THIN.isOTURLSession && THIN.rcParams.exitURL == "")) {
                if (message != "") {
                    var btnCaption = "";
                    var btnAction = closeWindow;
                    var doc = connEnvironment.mainWindow.document;
                    if ((doc.referrer == doc.location.href)) {
                        var btnCaption = thinRDPconsts.reload;
                        var btnAction = function () { connEnvironment.mainWindow.document.location.reload(); };
                    }
                    if (!manualClose) {
                        if (THIN && THIN.rcParams && THIN.rcParams.noShowConnectionClosePopup === true) btnAction();
                        else  Thinfinity.Popups.alert(message, thinRDPconsts.productDescription, "disconnectedDlg", "", "", btnAction, false, btnCaption);
                    } else {
                        bye();
                    }
                }
            } else if (autoStart) {
                closeAndBye(message);
            } else {
                if (THIN && THIN.rcParams && THIN.rcParams.noShowConnectionClosePopup === true) {
                    goToMain();
                } else if (message != "") {
                    Thinfinity.Popups.alert(message, thinRDPconsts.productDescription, "disconnectedDlg", "", "", goToMain, false);
                }
            }
        }

        if (THIN && THIN.isOTURLSession)
            THIN.logout(function () { doTerminate(); });
        else
            doTerminate();
    }

    function goToMain() {
        //Beta-V7
        if (Thinfinity?.global?.variables?.webV7?.active) {
            window.parent.postMessage({ to: 'webV7', type: 'connection', cmd: 'close', meta: window.__webV7__ }, '*');
            return;
        }

        if (runInFullScreen) {
            environment.exitFullscreen(window.top.document.documentElement);
            // -- remove container;
            var container = window.top.document.body.querySelector('div.fullscreen-container');
            window.top.document.body.removeChild(container);
            return;
        }
        if (THIN && THIN.isOTURLSession && window != top) {
            if (THIN) { THIN = null; }
            $("body").html("<div class='bye'>" + thinRDPconsts.connClosed + "</div>");
        } else {
            if (!THIN) {
                connEnvironment.mainWindow.location.href = (connEnvironment.referrer != "") ? connEnvironment.referrer : "about:blank";
            } else {
                var targetW = THIN.rcParams.sourceTarget || THIN.rcParams.targetWindow;
                if (typeof targetW !== 'undefined' && targetW != "_self" && targetW != "*") {
                    if (agentInfo.isFirefox) connEnvironment.mainWindow.location.href = THIN.rcParams.exitURL;
                    else connEnvironment.mainWindow.open(THIN.rcParams.exitURL, '_self', '');
                } else {
                    connEnvironment.mainWindow.location.href = (typeof THIN.rcParams.exitURL != 'undefined' && THIN.rcParams.exitURL != "about:blank") ?
                        THIN.rcParams.exitURL : connEnvironment.referrer;
                }
            }
        }
    };

    function closeAndBye(message) {
        if (THIN && THIN.rcParams && THIN.rcParams.noShowConnectionClosePopup === true) {
            bye()
        } else {
            if (typeof message == "undefined") message = thinRDPconsts.connClosed;
            Thinfinity.Popups.alert(message, thinRDPconsts.productDescription, "disconnectedDlg", "", "", bye, true);
        }
    }

    function closeWindow(ai) {
        if (typeof ai == "undefined" && agentInfo) { ai == agentInfo; }
        var win = connEnvironment.mainWindow;
        if (ai) {
            if (ai.isSafari) {
                win.opener = 'x';
            } else if (ai.isChrome) {
                win = connEnvironment.mainWindow.open("", "_self", "", "true");
                win.opener = true;
            } else if (ai.isMSIE) {
                win = connEnvironment.mainWindow.open("", "_top", "", "true");
                win.opener = true;
            }
        }
        bye(win);
    };

    function bye(win) {
        closing = true;
        if (THIN) {
            THIN.disconnect();
            if (THIN.rcParams.sessionKey) {
                THIN.logout(function () {
                    completeBye(win);
                });
                return;
            }
        }
        completeBye(win);
    }

    function completeBye(win) {
        THIN = null;
        if (!win) win = connEnvironment.mainWindow;

        document.body.innerHTML = "<div class='bye'>" + thinRDPconsts.connClosed + "</div>";
        if (connEnvironment.withBroker && connEnvironment.fromIndex && !connEnvironment.inNewWindow) {
            win.location.href = win.document.referrer;
        } else if (connEnvironment.inNewWindow) {
            win.close();
        }
    }

    function on(event, handler) {
        if ((event == undefined) || (event == null) || (event == '')) { return 'Event is undefined or null.'; }
        if ((handler == undefined) || (handler == null) || (handler == '')) { return 'Handler is undefined or null.'; }
        var item = { 'event': event, 'handler': handler };
        var isContained = false;
        if (eventsList[event] == undefined) {
            // -- Event doesnt exist.
            eventsList[event] = [];
        } else {
            // -- New handler?, check if the handler is not in the list.
            for (var i = 0; i < eventsList[event].length; i++) {
                if (eventsList[event][i].handler == item.handler) { isContained = true; break; }
            }
        }
        if (!isContained) { eventsList[event].push(item); }
        return true;
    };

    function off(event, handler) {
        if ((event == undefined) || (event == null) || (event == '')) { return 'Event is undefined or null.'; }
        if ((handler == undefined) || (handler == null) || (handler == '')) { return 'Handler is undefined or null.'; }
        var item = { 'event': event, 'handler': handler };
        var isContained = false;
        if (eventsList[event] == undefined) {
            // -- Event doesnt exist.
            return 'Cannot find event. Event is not in the model view.';
        } else {
            // -- Find handler
            for (var i = 0; i < eventsList[event].length; i++) {
                if (eventsList[event][i].handler == item.handler) {
                    eventsList[event].splice(i, 1);
                }
            }
        }
        if (!isContained) { eventsList[event].push(item); }
        return true;
    };

    function hasHandler(event) {
        return eventsList[event];
    };

    function fireHandler(event, data, code) {
        if (eventsList[event] == undefined) {
            // -- Event doesnt has a register handler.
            return 'Event doesn\'t has a register handler.';
        } else {
            for (var i = 0; i < eventsList[event].length; i++) {
                eventsList[event][i].handler(data, code);
            }
        }
    };
    // -- To allow logStats dinamically, attach before any other script.
    if (window.browserTracking && window.eScript) {
        var lastMsg = null;
        on('sessionEnd', function (msg, code) {
            if (lastMsg != null && lastMsg == msg) { return; }
            lastMsg = msg;
            browserTracking.terminate("Close", msg, 0);
        });
        on('serverConnectionError', function (msg, code) {
            if (lastMsg != null && lastMsg == msg) { return; }
            lastMsg = msg;
            browserTracking.terminate("Error", msg, code);
        });
        on('sessionDisconnect', function (msg, code) {
            if (lastMsg != null && lastMsg == msg) { return; }
            lastMsg = msg;
            browserTracking.terminate("Close", msg, 0);
        });
        on('serverError', function (msg, code) {
            if (lastMsg != null && lastMsg == msg) { return; }
            lastMsg = msg;
            browserTracking.terminate("Error", msg, -1);
        });
        on('terminate', function (msg) {
            // -- Must be un error
            if (lastMsg != null && lastMsg == msg) { return; }
            var regex = /(<([^>]+)>)/ig;
            if (msg != '') browserTracking.terminate("Error", msg.replace(regex, ""), -1);
            else browserTracking.terminate("Close", '', 0);
        });
    }

    // -- Custom
    function checkColorDepth() {
        if (THIN.rcParams.pixelFormat == 1) {
            $("#color256").addClass("pressed");
            $("#colorFull").removeClass("pressed");
        } else {
            $("#color256").removeClass("pressed");
            $("#colorFull").addClass("pressed");
        }
    };

    function refreshListener(e) {
        if (THIN.rcParams.active) {
            THIN.refresh();
        }
    };
    function stateListener(e) {
        if (THIN.rcParams.active) {
            THIN.stop();
        } else {
            THIN.start();
        }
    };
    function ctrlAltDelListener(e) {
        THIN.sendFunctionKey("CtrlAltDel");
    };
    function ctrlEscListener(e) {
        THIN.sendFunctionKey("CtrlEsc");
    };
    function onlyKeyCodeBtnListener(e) {
        THIN.onlyKeyCode = !THIN.onlyKeyCode;
        if (THIN.onlyKeyCode) $('#onlykeycode-btn').addClass("pressed");
        else $('#onlykeycode-btn').removeClass("pressed");
        THIN.savePreferences();
    };
    function helpBtnListener(e) {
        Thinfinity.Popups.alert($('#help-content').html(), thinVncConsts.kbdShortcuts, "help-content", "", "", "", false, "Close");
    };
    function monitorListener(e) {
        THIN.setMonitor(THIN.rcParams.monitor + 1);
    };
    function scaleListener(e) {
        var isIE9 = (agentInfo.isMSIE && agentInfo.msieVersion >= 9);
        if (!agentInfo.isMSIE || isIE9) {
            THIN.rcParams.scaled = !THIN.rcParams.scaled;

            if (!THIN.rcParams.scaled) {
                document.body.style.overflow = "auto";
            } else {
                document.body.style.overflow = "hidden";
            }
            THIN.zoomDesktop();
            if (THIN.rcParams.scaled) $('#scale').addClass('pressed');
            else $('#scale').removeClass('pressed');
        }
    };
    function colorsListener(elem) {
        if ($(elem).hasClass("pressed")) return;
        THIN.switchPixelFormat();
    };
    function settingsListener(e) {
        settingPopup = new Thinfinity.Popups.popup();
        settingPopup.captureKeyboard = false;
        settingPopup.block("remoteDialogPopup", $('#remoteDlg'));
        // -- BUG4660 - [Presentation Mode] Revienta la web cuando se intenta entrar por Join
        var url = "../index.html?cmd=settings" + ((typeof _data != "undefined" && typeof _data.gwusr != "undefined") ? "&usr=" + _data.gwusr : "");
        // -- BUG4660 - [Presentation Mode] Revienta la web cuando se intenta entrar por Join
        $("#remoteWindow").attr("src", url);
    };
    function buildToolbar() {
        var isFullscreen = null;
        var _initialSizeTimeout = null;
        function observeSize(e) {
            if (isFullscreen) {
                window.removeEventListener("resize", observeSize, false);
                clearTimeout(_initialSizeTimeout);
                _initialSizeTimeout = setTimeout(function () {
                    isFullscreen = false;
                    $("#fullScreen").removeClass("fullScreenOn");
                    $("#fullScreen").html(consts.fullscreen);
                    setFullScreen(false);
                }, 250);
            }
        };
        var tbmenu = {
            "attributes": { "class": "connectionToolbar" },
            "itemClass": "connectionToolbarItem"
        };
        var buttons = [
                {
                    "type": "tbsubmenu",
                    "attributes": { "id": "actionsMenuBtn", "class": "actionBtn" },
                    "html": "Actions",
                    "options": [
                        {
                            "id": "refresh",
                            "text": thinVncConsts.refresh,
                            "type": "action",
                            "attributes": { "title": thinVncConsts.requestFullDisplayUpd },
                            "event": function (event) { refreshListener(event); }
                        },
                        {
                            "id": "state_pause",
                            "text": thinVncConsts.pause,
                            "type": "action",
                            "event": function (event) { stateListener(); }
                        },
                        {
                            "id": "state_resume",
                            "text": thinVncConsts.resume,
                            "type": "action",
                            "attributes": { "style": "display: none" },
                            "event": function (event) { stateListener(); }
                        },
                        {
                            "id": "help",
                            "text": thinVncConsts.keyboard,
                            "type": "submenu",
                            "attributes": { "title": thinVncConsts.kbdShortcuts },
                            "events": {
                                "mouseenter": function (event) {
                                    if ($('#help-content').dialog('isOpen'))
                                        $('#help-btn').addClass('pressed');
                                    else
                                        $('#help-btn').removeClass('pressed');
                                }
                            },
                            "options": [
                                {
                                    "id": "ctrl-alt-del", "text": thinVncConsts.ctrlAltDel, "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { ctrlAltDelListener(); }
                                },
                                {
                                    "id": "ctrl-esc", "text": thinVncConsts.ctrlEsc, "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { ctrlEscListener(); }
                                },
                                {
                                    "id": "onlykeycode-btn", "text": thinVncConsts.remoteKbdLayout, "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { onlyKeyCodeBtnListener(event); }
                                },
                                {
                                    "id": "help-btn", "text": thinVncConsts.help, "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { helpBtnListener(event); }
                                }
                            ]
                        },
                        {
                            "id": "monitor",
                            "text": thinVncConsts.monitor,
                            "type": "action",
                            "attributes": { "class": "hidden", "title": thinVncConsts.nextMonitor },
                            "event": function (event) { monitorListener(); }
                        }
                    ]
                },
                {
                    "type": "tbsubmenu",
                    "attributes": { "id": "optionsMenuBtn" },
                    "html": "Options",
                    "options": [
                        {
                            "id": "mouse",
                            "text": thinVncConsts.control,
                            "type": "onoff",
                            "attributes": { "title": thinVncConsts.enableMouseKbdControl },
                            "events": {
                                "toggle": function (event) { if (THIN.rcParams.active) THIN.toggleMouseControl(); }
                            }
                        },
                        {
                            "id": "scale",
                            "text": thinVncConsts.scale,
                            "type": "onoff",
                            "attributes": { "title": thinVncConsts.scaleDisplayToFitWin },
                            "events": {
                                "toggle": function (event) { scaleListener(); }
                            }
                        },
                        {
                            "id": "colors",
                            "text": thinVncConsts.colors,
                            "type": "submenu",
                            "attributes": { "title": thinVncConsts.changeColorDepth },
                            "events": { "mouseenter": function (event) { checkColorDepth(); } },
                            "options": [
                                {
                                    "id": "color256", "text": "256 colors", "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { colorsListener(this); }
                                },
                                {
                                    "id": "colorFull", "text": "Full color", "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { colorsListener(this); }
                                }
                            ]
                        },
                        {
                            "id": "settingsBtn",
                            "icon": "thin-wrench",
                            "text": thinVncConsts.settings,
                            "type": "action",
                            "attributes": { "title": thinVncConsts.settingsTooltip },
                            "event": function (event) { settingsListener(); }
                        },
                        {
                            "id": "fullScreen",
                            "text": consts.fullscreen,
                            "type": "action",
                            "event": function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                if (window.environment.isFullscreen == true) {
                                    isFullscreen = false;
                                    // -- To normal
                                    window.removeEventListener("resize", observeSize, false);
                                    $("#fullScreen").removeClass("fullScreenOn");
                                    $("#fullScreen").html(consts.fullscreen);
                                    setFullScreen(false);
                                } else {
                                    // -- Check if the user press ESC key
                                    window.addEventListener("resize", observeSize, false);
                                    // -- To fullscreen.
                                    setFullScreen(true);
                                    setTimeout(function () {
                                        $("#fullScreen").html(consts.exitFullscreen);
                                        $("#fullScreen").addClass("fullScreenOn");
                                        isFullscreen = true;
                                    }, 500);
                                }
                            }
                        },
                    ]
                },
                {
                    "type": "tbbutton",
                    "attributes": { "id": "disconnect", "title": thinVncConsts.disconnectThinVNCSess },
                    "html": thinVncConsts.disconnect,
                    "events": [{
                        "name": "click", "action": function () {
                            var message = thinVncConsts.disconnectConfirm;
                            Thinfinity.Popups.choice("", "", "confirmDlg", "disconnectedIco", thinVncConsts.productDescription, message, [consts.ok, consts.cancel],
                                THIN.disconnect, "", true);
                        }
                    }]
                }
        ];
        // -- IN02458 - 'Settings' option cannot be visible when logInAutomatically (auto) is true. ==> CAUTION: FIX WAS WRONG. NOW WORKS USING CUSTOMSETTINGS
        // -- Instead add this option when is not a bypass, remove it when is necessary, because if want to choice the position of the menu, you'll cannot
        // -- BUG4660 - [Presentation Mode] It fails when somebody tries to access by "join"
        // -- BUG4726 - "settings" doesn't work
        if (helper.object.getValue(THIN.rcParams, 'toolbar.hideSettingsButton', false)) {
            // -- BUG4726 - "settings" doesn't work
            // -- BUG4660 - [Presentation Mode] It fails when somebody tries to access by "join"
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].options) {
                    for (var k = buttons[i].options.length - 1; k >= 0 ; k--) {
                        if (buttons[i].options[k].id == 'settingsBtn') {
                            buttons[i].options.splice(k, 1);
                            break;
                        }
                    }
                }
            }
        }
        // -- IN02458 - 'Settings' option cannot be visible when logInAutomatically (auto) is true.
        toolbar = new csToolbar("connectionToolbar", tbmenu);
        if (!!THIN.rcParams.disableControl) {
            toolbar.purgeOptions(buttons, ["optionsMenuBtn.mouse"]);
            THIN.rcParams.mouseControl = false;
            THIN.sendParams(THIN.rcParams.mouseControl, THIN.rcParams.remotePointer, THIN.rcParams.pixelFormat);
        }
        // IN01918 - Feature - Quit toolbar options through customSettings
        if (helper.object.existsPath(this, 'tv.rcParams.toolbarRestrictions')) {
            toolbar.purgeOptions(buttons, THIN.rcParams.toolbarRestrictions);
        };
        // IN01918 - End
        toolbar.addButtons(buttons);
        toolbar.refreshLayout();
        // IN01684  - end
        // -- IN02474 - Expand toolbar option does not work on start event, does not expand automatically
        if (!!THIN.rcParams.toolbarVisible) {
            toolbar.expand();
        }
        // -- IN02474 - Expand toolbar option does not work on start event, does not expand automatically
    };
    function setFullScreen(active) {
        // -- ********************************************
        var onResizeComplete = function () {
            // -- Detach resizeEvent from window
            window.environment.off("resizeComplete", onResizeComplete);
            // -- Wait until the size of the desktop is ready.
            // -- BUG 4432 - After switch to fullscreen mode, cannot send 'start' and 'restart' command again.
            //self.sendResize(0);
            // -- BUG 4432 - After switch to fullscreen mode, cannot send 'start' and 'restart' command again.
            //self.zoomDesktop();
        };
        window.environment.on("resizeComplete", onResizeComplete);
        // -- Wait until the size of the desktop is ready.
        // -- ********************************************
        var el = document.documentElement;
        if (active) {
            window.environment.requestFullscreen(el);
        } else {
            window.environment.exitFullscreen(el);
        };
    };
    function buildArgs(params) {
        var args = "";
        if (params.profileKey) {
            args += "profileKey=" + params.profileKey;
            if (params.profilePass) { args += "&profilePass=" + params.profilePass; }
            if (params.scraperId) { args += "&scraperId=" + params.scraperId; }
            if (params.remoteId) { args += "&remoteId=" + params.remoteId; }
            if (params.overrideDefaults != "") { args += "&overrideDefaults=" + params.overrideDefaults; }
            if (params.password != "") { args += "&password=" + encodeURIComponent(params.password); }
        }

        return args;
    };
    helper.dom.ready(function () {
        try { if (!(parent && parent.document)) crossDomain = true; }
        catch (error) { crossDomain = true; }
        try { if (!window.top.document) embeddedCross = true; }
        catch (error) { embeddedCross = true; }

        window.scroll(0, 1);
        connEnvironment = getConnectionEnvironment();
        runInFullScreen = (connEnvironment.inFullScreen);
        if (Thinfinity.global.variables.data != undefined && typeof Thinfinity.global.variables.data == 'string') {
            try {
                _data = JSON.parse(unescape(Thinfinity.global.variables.data));
            } catch (error) {
                helper.console.warning(error.message, arguments);
                terminate(helper.string.sprintf(consts.connAttemptFailed, ("<br/>" + error.message) || ""));
                _data = {};
            }
        }

        function startThinVNC(options) {
            Thinfinity.Theme.apply({ auto: true });
            var serverConnection = function (status) {
                if (status && status.description) {
                    if (status.state == 4) {
                        var msg = '';
                        if (status.description != '') msg = status.description;
                        Thinfinity.Popups.establishing.hide();
                        if (msg == '') { 'Session initialization error' }
                        terminate(msg);
                        return;
                    }
                }
                if (!status || !status.reconnecting) {
                    var msg = ((status && status.title) || "Loading...");
                    var animated = true;
                    var msgDetail = "Loading";
                    if (status && status.description) msgDetail = status.description;
                    Thinfinity.Popups.establishing.show(msg, msgDetail, animated, false);
                }
            };
            var startDesktop = function () {
                if (typeof customSettings != "undefined") {
                    for (var customProp in customSettings) {
                        options[customProp] = customSettings[customProp];
                    }
                }
                options.events = {
                    onServerCommandResult: function () {
                        if (THIN.connected) {
                            if (THIN.rcParams.active) {
                                $("#state_pause").show();
                                $("#state_resume").hide();
                            } else {
                                $("#state_resume").show();
                                $("#state_pause").hide();
                            }

                            if ((THIN.rcParams.pin != undefined) && (THIN.rcParams.pin != '')) {
                                $('#mouse').addClass('hidden');
                                $('#monitor').addClass('hidden');
                                $('#cursor').addClass('hidden');
                                $('#state_pause').addClass('hidden');
                                $('#state_resume').addClass('hidden');
                                $('#help').addClass('hidden');
                            } else {
                                if (THIN.rcParams.active && THIN.rcParams.mouseControl) $('#mouse').addClass('pressed');
                                else $('#mouse').removeClass('pressed');
                                if (THIN.rcParams.active && THIN.rcParams.remotePointer) $('#cursor').addClass('pressed');
                                else $('#cursor').removeClass('pressed');
                                if (THIN.rcParams.monitorCount > 1) $('#monitor').removeClass('hidden');
                            }
                            checkColorDepth();
                        }
                    },
                    onSessionStart: function (obj) {
                        Thinfinity.Popups.establishing.hide();
                        fireHandler('sessionStart', obj, 0);
                        if (THIN.rcParams.id) document.body.style.backgroundColor = "#000";
                        if (typeof obj.smartSizing !== "undefined" && obj.smartSizing != THIN.rcParams.scaled) {
                            if (typeof customSettings == "undefined" || typeof customSettings.smartSizing == "undefined") {
                                THIN.rcParams.scaled = obj.smartSizing;
                            }
                        }
                        if (!toolbar) {
                            $(document.body).prepend(
                                ["<input type='text' id='touchkbd' title='", consts.touchKeyboard, "' value='TOUCH KEYBOARD'/>",
                                    "<div id='help-content' title='", thinVncConsts.help, "'><ul><li><strong>", thinVncConsts.ctrlAltEnd, "</strong>",
                                    thinVncConsts.openNTSecurityDlg, "</li><li><strong>", thinVncConsts.altPageUp, "</strong>", thinVncConsts.switchBetweenProgs, "</li><li><strong>", thinVncConsts.altPageDown, "</strong>",
                                    thinVncConsts.switchBetweenProgsRL, "</li><li><strong>", thinVncConsts.altInsert, "</strong>", thinVncConsts.cycleThroughProgs, "</li><li><strong>", thinVncConsts.altHome, "</strong>",
                                    thinVncConsts.displyStartMenu, "</li><li><strong>", thinVncConsts.altDelete, "</strong>", thinVncConsts.displayWinMenu, "</li><li><strong>", thinVncConsts.ctrlAltMinus, "</strong>",
                                    thinVncConsts.placeSnapshotEntire, "</li><li><strong>", thinVncConsts.ctrlAltPlus, "</strong>", thinVncConsts.placeSnapshotActiveWin, "</li></ul></li></ul></div>"].join(""));

                            buildToolbar();
                            $('#help-content').dialog({
                                autoOpen: false,
                                draggable: true,
                                width: 600,
                                height: 300
                            });
                        }
                        if (!THIN.iphone) {
                            $('#touchkbd').hide();
                        } else {
                            var tkbd = document.getElementById("touchkbd");
                            if (tkbd) helper.dom.addEvent('click', function (e) {
                                $('#dropdown').hide();
                                $('#help').removeClass('pressed');
                            }, false);
                        }
                        if (THIN.onlyKeyCode)
                            $('#onlykeycode-btn').addClass("pressed");
                        if (agentInfo.isMSIE && agentInfo.msieVersion > 9 || agentInfo.isIphone) {
                            THIN.rcParams.scaled = false;
                            $('#scale').addClass('hidden');
                        } else if (THIN.rcParams.scaled)
                            $('#scale').addClass('pressed');

                        toolbar.refreshLayout();
                    },
                    onServerConnect: function (obj) {
                        fireHandler('serverConnect', obj, 0);
                    },
                    onServerDisconnect: function (obj) {
                        var err = (!connected) ? -1 : 0;
                        var msg = (!connected) ? thinRDPconsts.connNotEstablished : consts.thisSessionHasEnded;
                        fireHandler('sessionDisconnect', msg, err);
                        if (!closing) {
                            $.unblockUI();
                            terminate(msg);
                            THIN = null;
                        }
                    },
                    onServerReconnect: function (obj) {
                        $('#touchkbd').unbind();
                        $('#cursor').unbind();
                        fireHandler('serverReconnect', obj, 0);
                    },
                    onServerError: function (oError) {
                        fireHandler('serverError', oError.message, -1);
                        terminate(oError.message);
                    },
                    onServerConnecting: serverConnection,
                    onSessionEnd: function (msg) {
                        function completeSessionEnd() {
                            $.unblockUI();
                            terminate(message);
                        }
                        fireHandler('sessionEnd', msg, 0);
                        if (!closing) {
                            $.unblockUI();
                            terminate(msg);
                            THIN = null;
                        }
                    },
                    onServerConnectionError: function (errMessage) {
                        var msg = DecodeEscapedUnicode(errMessage);
                        fireHandler('serverConnectionError', msg, -1);
                        terminate(msg);
                    },
                    onPlaybackEnds: function (message) {
                        terminate(message);
                    }

                };

                THIN.setParams(options, options.events);
                // -- EXTEND THIN
                THIN.sendParams = function (mouseControl, remotePointer, pixelFormat) {
                    THIN.sendCmd("cmd=params&mouseControl=" + mouseControl + "&kbdControl=" + mouseControl + "&remotePointer=" + remotePointer + "&pixelFormat=" + pixelFormat);
                };

                THIN.toggleMouseControl = function () {
                    THIN.sendParams(!THIN.rcParams.mouseControl, THIN.rcParams.remotePointer, THIN.rcParams.pixelFormat);
                };

                THIN.toggleRemotePointer = function () {
                    THIN.sendParams(THIN.rcParams.mouseControl, !THIN.rcParams.remotePointer, THIN.rcParams.pixelFormat);
                };

                THIN.switchPixelFormat = function () {
                    THIN.sendParams(THIN.rcParams.mouseControl, THIN.rcParams.remotePointer, (THIN.rcParams.pixelFormat == 0) ? 1 : 0);
                };
                THIN.fromBroker = helper.object.convertTo(helper.object.getValue(options, 'fromBroker', false), 'boolean');
                //options.scraper = cookiePrefix;
                //options.scraperArgs = buildArgs(options);
                THIN.init(options);
            };
            var startMobile = function () {
                //-- BUG6169-3 allow hookmouse to allow mobiles with mouse support
                //options.hookMouse = false;
                options.hookKeyboard = false;
                options.centered = true;
                options.scaled = (typeof options.scaled != 'undefined') ? options.scaled : false;
                THIN.fromBroker = helper.object.convertTo(helper.object.getValue(options, 'fromBroker', false), 'boolean');
                THIN.init(options);
                initMobile(THIN, null, {
                    onServerConnecting: serverConnection,
                    onServerConnect: function (obj) {
                        // -- BUG4642 - Update name
                        if (typeof obj.promptRequired != "undefined" && obj.promptRequired) {
                            //$.blockUI({
                            //    message: thinVncConsts.waitingForAuthorization,
                            //    css: {
                            //        'padding': 0, 'margin': 0,
                            //        'width': '100%', 'height': '100%',
                            //        'top': '0px', 'left': '0px',
                            //        'textAlign': 'center',
                            //        'backgroundColor': 'transparent',
                            //        'border': 'none',
                            //        'cursor': 'auto'
                            //    }, centerX: true, centerY: true
                            //});
                            Thinfinity.Popups.message({ 'message': thinVncConsts.waitingForAuthorization });
                        }
                        // -- BUG4642 - Update name
                    },
                    onSessionStart: function () {
                        $.unblockUI();
                    },
                    onServerDisconnect: terminate,
                    onServerReconnect: function (obj) {
                        fireHandler('serverReconnect', obj, 0);
                    },
                    onDragValidate: function (scrollWithMouse, relativeTouch, scaled) {
                        return scrollWithMouse && relativeTouch && !scaled;
                    },
                    onServerCommandResult: function (obj) {
                        if (!obj.remotePointer && agentInfo.isMobile) {
                            THIN.setRemotePointer(true);
                        }
                    },
                    onServerError: function (oError) {
                        fireHandler('serverError', oError.message, -1);
                        terminate(oError.message);
                    },
                    onSessionEnd: function (msg) {
                        function completeSessionEnd() {
                            $.unblockUI();
                            terminate(message);
                        }
                        fireHandler('sessionEnd', msg, 0);
                        if (!closing) {
                            $.unblockUI();
                            terminate(msg);
                            THIN = null;
                        }
                    },
                    onServerConnectionError: function (errMessage) {
                        var msg = DecodeEscapedUnicode(errMessage);
                        fireHandler('serverConnectionError', msg, -1);
                        terminate(msg);
                    },
                });
                THIN.rcParams.scaled = options.scaled;
                THIN.rcParams.monitor = 0;
                THIN.rcParams.centered = true;
                THIN.rcParams.events = THIN.events;
                // -- thinvnc.m.js
                initTouchDevice();
            };
            if (typeof options.sessionKey != "undefined" && options.sessionKey != "" & options.password != "") {
                runInNewWindow = true;
            }
            else if (typeof options.sourceTarget != "undefined") {
                runInNewWindow = options.sourceTarget == "*" || options.sourceTarget == "-" || (options.sourceTarget != "_self" && connEnvironment.inNewWindow);
            }
            else if (typeof options.targetWindow != "undefined") {
                runInNewWindow = ((options.targetWindow == "*") || ((options.targetWindow != "_self") && (options.targetWindow != "_parent") && connEnvironment.inNewWindow));
            } else {
                runInNewWindow = connEnvironment.inNewWindow;
            }
            options.divId = "deskdiv";
            THIN = new ThinVNC();

            if (helper.object.getValue(window, 'agentInfo.__setInitializationData__', null)) {
                var initData = helper.object.getValue(window, 'customSettings.initializationData', null);
                if (initData) {
                    window.agentInfo['__setInitializationData__'](initData);
                }
            }
            options.scraper = cookiePrefix;
            options.scraperArgs = buildArgs(options);
            (!agentInfo.isMobile) ? startDesktop() : startMobile();
            if (typeof options.connectionName != "undefined")
                document.title = options.connectionName;
            if (typeof options.icon != "undefined") {
                var link = document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = options.icon;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            THIN.connect();
        };

        function DecodeEscapedUnicode(x) {
            var r = /\\u([\d\w]{4})/gi;
            x = x.replace(r, function (match, grp) {
                return String.fromCharCode(parseInt(grp, 16));
            });
            return unescape(x);
        }

        $(window).bind('beforeunload', function () {
            if ((typeof THIN != "undefined") && (THIN != null) && (THIN.rcParams && !THIN.rcParams.checkBeforeWindowClose)) {
                return;
            }
            if (connected && !closing) {
                return thinRDPconsts.disconnectConfirm;
            }
        });
        function doConnect() {
            agentInfo.addAsyncDetectionCallback('OnAsmJsWorkersTested', null, function () { startThinVNC(_data); });
            agentInfo.runAsyncDetections();
        }
        if (agentInfo.supportHTML5) {
            //	We must wait for all asynchronous tests to finish before starting a connection
            //	or we could end with false negatives for features that depend on undetected
            //	browser capabilities or other limitations (bad SDK usage, etc).
            doConnect();
        }
    });

    // -- END PRIVATE METHODS **********************************************************************************************
    // -- PUBLIC METHODS ***************************************************************************************************
    // -- Compatibility mode
    Object.defineProperty(publicExposeRef, 'goToMain', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': goToMain });
    Object.defineProperty(publicExposeRef, 'terminate', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': terminate });
    Object.defineProperty(publicExposeRef, 'bye', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': bye });
    Object.defineProperty(publicExposeRef, 'closeAndBye', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': closeAndBye });
    Object.defineProperty(publicExposeRef, 'closeWindow', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': closeWindow });
    // -- END PUBLIC METHODS ***********************************************************************************************

})();
// *************************************************************************************************************************
// END VNC (AS CONNECTION) WRAPPER *****************************************************************************************
// *************************************************************************************************************************