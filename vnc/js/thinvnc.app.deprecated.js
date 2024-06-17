ThinVNCApp = function (obj, events) {
    var TVNCAPP = this;
    this.tv = new ThinVNC();
    var THIN = this.tv;
    var pinned = 0;
    var clipbrdVisible = false;
    var dropVisible = false;
    var settingPopup = null;

    this.toolbar = null;
    this.externalEvents = (events) ? events : null;
    // -- IN02334 - Mouse move lag
    if (THIN && THIN.overrideCursor) {
        THIN.overrideCursor = false;
    }
    // -- IN02334 - Mouse move lag
    this.registerEvent = function (name, action) {
        if (this.externalEvents == null)
            this.externalEvents = {};
        this.externalEvents[name] = action;
    };

    this.unregisterEvent = function (name) {
        if (this.externalEvents != null)
            if (this.externalEvents[name]) {
                this.externalEvents[name] = null;
                delete this.externalEvents[name];
            }
    };

    obj.events = {
        "onServerCommandResult": function (obj) {
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
                    /*
                    logDebug("THIN.rcParams.active: " + THIN.rcParams.active +
                            " - THIN.rcParams.mouseControl: " + THIN.rcParams.mouseControl +
                            " - THIN.rcParams.remotePointer: " + THIN.rcParams.remotePointer);
                            */
                    if (THIN.rcParams.active && THIN.rcParams.mouseControl) {
                        $('#mouse').addClass('pressed');
                    } else
                        $('#mouse').removeClass('pressed');

                    if (THIN.rcParams.active && THIN.rcParams.remotePointer) {
                        $('#cursor').addClass('pressed');
                    } else
                        $('#cursor').removeClass('pressed');

                    if (THIN.rcParams.monitorCount > 1) {
                        $('#monitor').removeClass('hidden');
                    }
                }
                TVNCAPP.checkColorDepth();
            }

        },

        'onSessionStart' : function(e) {
            if (TVNCAPP.externalEvents != null)
                if (typeof TVNCAPP.externalEvents.onSessionStart != "undefined") {
                    TVNCAPP.externalEvents.onSessionStart();
                }
            if (THIN.rcParams.id) {
                document.body.style.backgroundColor = "#000";
            }

            if (!TVNCAPP.toolbar) {
                $(document.body).prepend(
                    ["<input type='text' id='touchkbd' title='", consts.touchKeyboard, "' value='TOUCH KEYBOARD'/>",
                        "<div id='help-content' title='", thinVncConsts.help, "'><ul><li><strong>", thinVncConsts.ctrlAltEnd, "</strong>",
                        thinVncConsts.openNTSecurityDlg, "</li><li><strong>", thinVncConsts.altPageUp, "</strong>", thinVncConsts.switchBetweenProgs, "</li><li><strong>", thinVncConsts.altPageDown, "</strong>",
                        thinVncConsts.switchBetweenProgsRL, "</li><li><strong>", thinVncConsts.altInsert, "</strong>", thinVncConsts.cycleThroughProgs, "</li><li><strong>", thinVncConsts.altHome, "</strong>",
                        thinVncConsts.displyStartMenu, "</li><li><strong>", thinVncConsts.altDelete, "</strong>", thinVncConsts.displayWinMenu, "</li><li><strong>", thinVncConsts.ctrlAltMinus, "</strong>",
                        thinVncConsts.placeSnapshotEntire, "</li><li><strong>", thinVncConsts.ctrlAltPlus, "</strong>", thinVncConsts.placeSnapshotActiveWin, "</li></ul></li></ul></div>"].join(""));

                TVNCAPP.buildToolbar();
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
                TVNCAPP.get("touchkbd").addEventListener("click", TVNCAPP.touchKbdListener, false);
            }
            if (THIN.onlyKeyCode)
                $('#onlykeycode-btn').addClass("pressed");
            if (agentInfo.isMSIE && agentInfo.msieVersion > 9 || agentInfo.isIphone) {
                THIN.rcParams.scaled = false;
                $('#scale').addClass('hidden');
            } else if (THIN.rcParams.scaled)
                $('#scale').addClass('pressed');

            TVNCAPP.toolbar.refreshLayout();
        },

        'onServerConnect': function (obj) {

            $('#computer').unbind();
            $('#connect-page').hide();

            if (TVNCAPP.externalEvents != null)
                if (typeof TVNCAPP.externalEvents.onServerConnect != "undefined") {
                    TVNCAPP.externalEvents.onServerConnect(obj);
                }
        },

        'onServerDisconnect': function () {
            document.body.style.backgroundColor = "#FFF";
            if (clipbrdVisible) {
                $('#clipbrd').removeClass('pressed');
                $('#clipboard').addClass('hidden');
                clipbrdVisible = false;
            }
            if (TVNCAPP.externalEvents != null) {
                if (typeof TVNCAPP.externalEvents.onServerDisconnect != "undefined")
                    TVNCAPP.externalEvents.onServerDisconnect();
                //TVNCAPP.externalEvents.splice(0, TVNCAPP.externalEvents.length);
                TVNCAPP.externalEvents = null;
            }
            TVNCAPP.dispose();
        },

        'onServerReconnect': function () {
            $('#touchkbd').unbind();
            $('#cursor').unbind();
            if (TVNCAPP.externalEvents != null)
                if (typeof TVNCAPP.externalEvents.onServerReconnect != "undefined")
                    TVNCAPP.externalEvents.onServerReconnect();
        },
        'onServerError': function (message) {
            if (TVNCAPP.externalEvents != null && typeof TVNCAPP.externalEvents.onServerError != "undefined") TVNCAPP.externalEvents.onServerError(message);
            TVNCAPP.dispose();
        }
    };

    this.checkColorDepth = function() {
        if (THIN.rcParams.pixelFormat == 1) {
            $("#color256").addClass("pressed");
            $("#colorFull").removeClass("pressed");
        } else {
            $("#color256").removeClass("pressed");
            $("#colorFull").addClass("pressed");
        }
    }

    this.buildToolbar = function () {
        // IN01684  - start
        var tbmenu = {
            "attributes": { "class": "connectionToolbar" },
            "itemClass": "connectionToolbarItem"
        };
        var buttons = [
                {
                    "type": "tbsubmenu",
                    "attributes": { "id": "actionsMenuBtn" },
                    "html": "Actions",
                    "options": [
                        {
                            "id": "refresh",
                            "text": thinVncConsts.refresh,
                            "type": "action",
                            "attributes": { "title": thinVncConsts.requestFullDisplayUpd },
                            "event": function (event) { TVNCAPP.refreshListener(event); }
                        },
                        {
                            "id": "state_pause",
                            "text": thinVncConsts.pause,
                            "type": "action",
                            "event": function (event) { TVNCAPP.stateListener() }
                        },
                        {
                            "id": "state_resume",
                            "text": thinVncConsts.resume,
                            "type": "action",
                            "attributes": { "style": "display: none" },
                            "event": function (event) { TVNCAPP.stateListener() }
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
                                    "event": function (event) { TVNCAPP.ctrlAltDelListener(); }
                                },
                                {
                                    "id": "ctrl-esc", "text": thinVncConsts.ctrlEsc, "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { TVNCAPP.ctrlEscListener(); }
                                },
                                {
                                    "id": "onlykeycode-btn", "text": thinVncConsts.remoteKbdLayout, "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { TVNCAPP.onlyKeyCodeBtnListener(); }
                                },
                                {
                                    "id": "help-btn", "text": thinVncConsts.help, "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { TVNCAPP.helpBtnListener(); }
                                }
                            ]
                        },
                        {
                            "id": "monitor",
                            "text": thinVncConsts.monitor,
                            "type": "action",
                            "attributes": { "class": "hidden", "title": thinVncConsts.nextMonitor },
                            "event": function (event) { TVNCAPP.monitorListener(); }
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
                                "toggle": function (event) { TVNCAPP.scaleListener(); }
                            }
                        },
                        {
                            "id": "colors",
                            "text": thinVncConsts.colors,
                            "type": "submenu",
                            "attributes": { "title": thinVncConsts.changeColorDepth },
                            "events": { "mouseenter": function (event) { TVNCAPP.checkColorDepth(); } },
                            "options": [
                                {
                                    "id": "color256", "text": "256 colors", "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { TVNCAPP.colorsListener(this); }
                                },
                                {
                                    "id": "colorFull", "text": "Full color", "type": "action",
                                    "attributes": { "class": "noIcon noPadding" },
                                    "event": function (event) { TVNCAPP.colorsListener(this); }
                                }
                            ]
                        },
                        {
                            "id": "settingsBtn",
                            'icon': "thin-wrench",
                            "text": thinVncConsts.settings,
                            "type": "action",
                            "attributes": { "title": thinVncConsts.settingsTooltip },
                            "event": function (event) { TVNCAPP.settingsListener(); }
                        }
                    ]
                },
                {
                    "type": "tbbutton",
                    "attributes": { "id": "disconnect", "title": thinVncConsts.disconnectThinVNCSess },
                    "html": thinVncConsts.disconnect,
                    "events": [{
                        "name": "click", "action": function () { THIN.disconnect(); }
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
        this.toolbar = new csToolbar("connectionToolbar", tbmenu);
        if (!!this.tv.rcParams.disableControl) {
            this.toolbar.purgeOptions(buttons, ["optionsMenuBtn.mouse"]);
            this.tv.rcParams.mouseControl = false;
            this.tv.sendParams(this.tv.rcParams.mouseControl, this.tv.rcParams.remotePointer, this.tv.rcParams.pixelFormat);
        }
        // IN01918 - Feature - Quit toolbar options through customSettings
        if (helper.object.existsPath(this, 'tv.rcParams.toolbarRestrictions')) {
            this.toolbar.purgeOptions(buttons, this.tv.rcParams.toolbarRestrictions);
        };
        // IN01918 - End
        this.toolbar.addButtons(buttons);
        this.toolbar.refreshLayout();
        // IN01684  - end
        // -- IN02474 - Expand toolbar option does not work on start event, does not expand automatically
        if (!!THIN.rcParams.toolbarVisible) {
            this.toolbar.expand();
        }
        // -- IN02474 - Expand toolbar option does not work on start event, does not expand automatically
    }

    this.tv.init(obj);

    this.connect = function (username, password) {
        this.tv.connect(username, password);
    }
    this.get = function (id) {
        return document.getElementById(id);
    }

    this.helpBtnListener = function (e) {
        alertPopup($('#help-content').html(), thinVncConsts.kbdShortcuts, "help-content", "", "", "", false, "Close");
    }
    this.onlyKeyCodeBtnListener = function (e) {
        THIN.onlyKeyCode = !THIN.onlyKeyCode;
        if (THIN.onlyKeyCode) {
            $('#onlykeycode-btn').addClass("pressed");
        }
        else {
            $('#onlykeycode-btn').removeClass("pressed");
        }
        THIN.savePreferences();
    }

    this.touchKbdListener = function (e) {
        $('#dropdown').hide();
        dropVisible = false;
        $('#help').removeClass('pressed');
    }

    this.ctrlAltDelListener = function (e) {
        THIN.sendFunctionKey("CtrlAltDel");
    }
    this.ctrlEscListener = function (e) {
        THIN.sendFunctionKey("CtrlEsc");
    }
    this.refreshListener = function (e) {
        if (THIN.rcParams.active) {
            THIN.refresh();
        }
    }
    this.monitorListener = function (e) {
        THIN.setMonitor(THIN.rcParams.monitor + 1);
    }
    this.scaleListener = function (e) {
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
    }
    this.stateListener = function (e) {
        if (THIN.rcParams.active) {
            THIN.stop();
        } else {
            THIN.start();
        }
    }
    this.colorsListener = function (elem) {
        if ($(elem).hasClass("pressed")) return;
        THIN.switchPixelFormat();
    }
    this.settingsListener = function (e) {
        settingPopup = new PopupDialog();
        settingPopup.captureKeyboard = false;
        settingPopup.block("remoteDialogPopup", $('#remoteDlg'));
        // -- BUG4660 - [Presentation Mode] Revienta la web cuando se intenta entrar por Join
        var url = "../index.html?cmd=settings" + ((typeof data != "undefined" && typeof data.gwusr != "undefined") ? "&usr=" + data.gwusr : "");
        // -- BUG4660 - [Presentation Mode] Revienta la web cuando se intenta entrar por Join
        $("#remoteWindow").attr("src", url);
    }
    window.addEventListener("message", function (e) {
        if (e.data.cmd == "CLOSEDLG")
            settingPopup.unblock();
    }, false);

    THIN.sendParams = function (mouseControl, remotePointer, pixelFormat) {
        THIN.sendCmd("cmd=params&mouseControl=" + mouseControl + "&kbdControl=" + mouseControl + "&remotePointer=" + remotePointer + "&pixelFormat=" + pixelFormat);
    }

    THIN.toggleMouseControl = function () {
        THIN.sendParams(!THIN.rcParams.mouseControl, THIN.rcParams.remotePointer, THIN.rcParams.pixelFormat);
    }

    THIN.toggleRemotePointer = function () {
        THIN.sendParams(THIN.rcParams.mouseControl, !THIN.rcParams.remotePointer, THIN.rcParams.pixelFormat);
    }

    THIN.switchPixelFormat = function () {
        THIN.sendParams(THIN.rcParams.mouseControl, THIN.rcParams.remotePointer, (THIN.rcParams.pixelFormat == 0) ? 1 : 0);
    }

    this.dispose = function () {
        $(window).unbind();
        if (TVNCAPP.toolbar) {
            $('#touchkbd').unbind();
            $('#cursor').unbind();
            $('#toolbar').remove();
            $('#help-content').remove();
            TVNCAPP.toolbar.destroy();
            delete TVNCAPP.toolbar;
        }
        // [BUG 4710] [JS] No esta ofuscando el codigo de los js en la build. (erased line)
        THIN = null;
        TVNCAPP = null;
    }
    $(window).resize(function () {
        TVNCAPP.toolbar.refreshLayout();
    });

    function CommandLineInterface() {
        var type = "unknown";
        var div = null;

        this.init = cliInit;
        this.dispose = cliDispose;
        this.show = cliShow;
        this.hide = cliHide;
        this.getText = cliGetText;
        this.setText = cliSetText;
        this.send = cliSend;
        this.recv = cliReceive;
    }

    function cliInit(element) {
        this.div = element;
        if (this.div == null || this.div == undefined) {
            throw "Element with Id = '" + id + "' not found in the DOM";
        }
    }

    function cliDispose() {
        this.div = null;
    }

    function cliShow() {
        div.style.display = 'inline';
    }

    function cliHide() {
        div.style.display = 'none';
    }

    function cliGetText() {
        return this.div.innerText;
    }

    function cliSetText(text) {
        this.div.innerText = text;
    }

    function cliSend(action) {
        var url = THIN.baseUrl + "cmd?id=" + THIN.rcParams.id + "&cmd=cli&type=" + this.type + "&action=" + action;
        var txt = this.getText();
        try {
            if (THIN.rcParams.mouseControl) {
                // [BUG 4710] [JS] No esta ofuscando el codigo de los js en la build.
                $.post(url, txt, function (obj) {});
                // [BUG 4710] [JS] No esta ofuscando el codigo de los js en la build.
            }
        }
        catch (e) {
            alert(e);
        }
    }

    function cliReceive(action) {
        var url = THIN.baseUrl + "cmd?id=" + THIN.rcParams.id + "&cmd=cli&type=" + this.type + "&action=" + action;
        var me = this;
        try {
            // [BUG 4710] [JS] No esta ofuscando el codigo de los js en la build.
            $.getJSON(url, function (obj) {
                me.setText(obj.text);
                me = null;
            });
            // [BUG 4710] [JS] No esta ofuscando el codigo de los js en la build.
        }
        catch (e) {
            alert(e);
        }
    }


    /* Clipboard */

    function CLI4Clipboard() {
        this.inheritFrom = CommandLineInterface;
        this.inheritFrom();
        this.type = "clipboard";
        this.copying = false;

        this.getText = clipboardGetText;
        this.setText = clipboardSetText;
        this.copy = clipboardCopy;
        this.paste = clipboardPaste;
        this.clear = clipboardClear;
    }

    function clipboardGetText() {
        return $('textarea#clipboardText').val();
    }

    function clipboardSetText(text) {
        this.copying = true;
        $('textarea#clipboardText').val(text);
        var textarea = document.getElementById("clipboardText");
        if (textarea.setSelectionRange)
            textarea.setSelectionRange(0, textarea.value.length);
        else {
            var r = textarea.createTextRange();
            r.collapse(true);
            r.moveEnd('character', 0);
            r.moveStart('character', textarea.value.length);
            r.select();
        }
        this.copying = false;
    }

    function clipboardCopy() {
        this.recv("copy");
    }

    function clipboardPaste() {
        this.send("paste");
    }

    function clipboardClear() {
        $('textarea#clipboardText').val("");
    }

    /* Startup functions */
    function startClipboard() {
        //jQuery.ajaxSettings.contentType = 'text/plain';
        var clipboard = new CLI4Clipboard();
        clipboard.init($('#clipboard'));
        $('#clipbremcopy').click(function () {
            clipboard.copy();
        });

        $("#clipboardText").bind('paste', function (e) {
            setTimeout(function () {
                clipboard.paste();
            }, 100);
        })

        $('#clipbrempaste').click(function () {
            clipboard.paste();
        });
        $('#clipblclclear').click(function () {
            clipboard.clear();
        });
        $('#clipboardText').keydown(function (e) {
            e.stopPropagation();
        });
        $('#clipboardText').keyup(function (e) {
            e.stopPropagation();
        });
        $('#clipboardText').focus(function (e) {
            THIN.removeListeners();
        });
        $('#clipboardText').blur(function (e) {
            THIN.hookKM();
        });
    }

}

