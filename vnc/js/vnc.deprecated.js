
var runInNewWindow = false;
var THIN = null;
var mythinvnc = null;

$(document).ready(function () {
    var canConfig = false;

    function gup(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null)
            return "";
        else
            return results[1];
    }
    // -- IN02594 - Update jquery version. scrollTbRight and scrollTbLeft are not exists in the whole project
    $("#scrollTbRight").on("click", function () {
        if (document.body.clientWidth < $("#toolbar").width()) {
            if (document.body.clientWidth > ($("#toolbar").width() / 2) || ($("#toolbar").width() + $("#toolbar").offset().left < document.body.clientWidth * 2)) {
                var leftOffset = document.body.clientWidth - $("#toolbar").width() - 7;
                $("#scrollTbRight").css('display', 'none');
            }
            else {
                var leftOffset = $("#toolbar").offset().left - document.body.clientWidth;
            }
            $("#toolbar").css('left', leftOffset);
            $("#scrollTbLeft").css('display', 'inherit');
        }
    });

    $("#scrollTbLeft").on("click", function () {
        if (document.body.clientWidth < $("#toolbar").width()) {
            if (document.body.clientWidth > ($("#toolbar").width() / 2) || Math.abs($("#toolbar").offset().left) <= document.body.clientWidth) {
                $("#scrollTbLeft").css('display', 'none');
                var leftOffset = 0;
            }
            else {
                var leftOffset = $("#toolbar").offset().left + document.body.clientWidth;
            }
            $("#scrollTbRight").css('display', 'inherit');
            $("#toolbar").css('left', leftOffset);
        }
    });
    // -- IN02594 - Update jquery version. scrollTbRight and scrollTbLeft are not exists in the whole project

    function connect() {
        try {
            eval("data=" + getConnectionInfo());
        } catch (e) {
        }
        if (data) {
            runInNewWindow = data.newWindow || data.fromGateway;
            if (data.connectionName) document.title = data.connectionName;
            if (data && data.logWindow) {
                var scr = document.createElement("SCRIPT");
                scr.setAttribute("type", "text/javascript");
                scr.setAttribute("src", "../js/msgLogger.js");
                document.getElementsByTagName("HEAD")[0].appendChild(scr);
            }
            // -- IN02711 - Forced to show as mobile.
            if (helper.object.getValue(window, 'agentInfo.__setInitializationData__', null)) {
                var initData = helper.object.getValue(window, 'customSettings.initializationData', null);
                if (initData) {
                    window.agentInfo['__setInitializationData__'](initData);
                }
            }
            /*
            var jdata = {
                "connectionName": thinVncConsts.thinVNCScreenSharing,
                "divId": "deskdiv",
                "mouseControl": mouseControl,
                "pixelFormat": fcPF,
                "screenResX": resX,
                "screenResY": resY,
                "lfn": lfn,
                "imageMethod": imageMethod,
                "wallpaper": wallpaper,
                "scaled": scaled,
                "quality": fcQ,
                "wscompression":storage.data.screenSharing.wscompression,
                "relativeTouch": storage.data.screenSharing.relativeTouch,
                "dragDist": storage.data.screenSharing.dragDist,
                "newWindow": ((document.getElementById("newwindow").checked && !document.getElementById("newwindow").disabled)) && (!auto),
                "logWindow": logInWindow == "1",
                "fromGateway": getFromGateway(),
                "gwusr": usr,
                "auto": ($("#defaultConnType").val() != "none")
            }
            */
            data.divId = 'deskdiv';
            // -- IN02711 - Forced to show as mobile.
            try {
                if (!agentInfo.isMobile) {
                    // IN01684  - start
                    if (typeof customSettings != "undefined") {
                        for (var customProp in customSettings) {
                            data[customProp] = customSettings[customProp];
                        }
                    }
                    // IN01684  - end
                    mythinvnc = new ThinVNCApp(data, {
                        onServerConnect: function (obj) {
                            if (typeof obj.promptRequired != "undefined" && obj.promptRequired)
                                blockMessage(thinVncConsts.waitingForAuthorization);
                        },
                        onSessionStart: function () {
                            $.unblockUI();
                        },
                        onServerDisconnect: terminate,
                        onServerError: function (message) {
                            var div = document.createElement('div');
                            div.innerHTML = message;
                            var description = (div.querySelector('h1') ? div.querySelector('h1').innerText : message);
                            terminate(description);
                        }
                    });
                    mythinvnc.connect();
                } else {
                    document.body.style.backgroundColor = "#000";
                    var mw = 0;
                    var mh = 0;
                    if (divScrolling) {
                        mw = screenWidth;
                        mh = screenHeight;
                    }
                    THIN = new ThinVNC();
                    adjustMainSize();
                    //var scaled = data.scaled;
                    data.hookMouse = false;
                    data.hookKeyboard = false;
                    data.maxWidth = mw;
                    data.maxHeight = mh;
                    data.centered = true;
                    data.scaled = (typeof data.scaled != 'undefined') ? data.scaled : false;
                    THIN.init(data);
                    initMobile(THIN, null, {
                        onServerConnect: function (obj) {
                            // -- BUG4642 - Update name
                            if (typeof obj.promptRequired != "undefined" && obj.promptRequired) {
                                blockMessage(thinVncConsts.waitingForAuthorization);
                            }
                            // -- BUG4642 - Update name
                        },
                        onSessionStart: function () {
                            $.unblockUI();
                        },
                        onServerDisconnect: terminate,
                        onDragValidate: function (scrollWithMouse, relativeTouch, scaled) {
                            return scrollWithMouse && relativeTouch && !scaled;
                        },
                        // -- BUG4642 - [VNC] There is no cursor on mobile if "Show Remote Pointer" is not checked.
                        onServerCommandResult: function (obj) {
                            if (!obj.remotePointer && agentInfo.isMobile) {
                                THIN.setRemotePointer(true);
                            }
                        },
                        onServerError: function (message) {
                            var div = document.createElement('div');
                            div.innerHTML = message;
                            var description = (div.querySelector('h1') ? div.querySelector('h1').innerText : message);
                            terminate(description);
                        }
                        // -- BUG4642 - [VNC] There is no cursor on mobile if "Show Remote Pointer" is not checked.
                    });
                    THIN.rcParams.scaled = data.scaled;
                    THIN.rcParams.monitor = 0;
                    THIN.rcParams.centered = true;
                    THIN.rcParams.events = THIN.events;

                    if (agentInfo.isTouch) {
                        /*
                        -------------------------------------------------------------------------------------------------
                        FIXME (guarda, revisar)
                        -------------------------------------------------------------------------------------------------
                        isTouch es diferente a isMobile!

                            La funcion initTouchDevice() esta definida en thinvnc.m.js, archivo que se incluye solo si
                            isMobile == true, pero hay dispositivos encasillados bajo la otra denominacion "desktop" (sin
                            ir mas lejos, Surface) que tambien tienen touch! y en el caso especifico de Surface, tambien
                            hay que iniciarle Local Gestures como a los demas isMobile.
                        -------------------------------------------------------------------------------------------------
                        Touch Redirection es diferente a Local Gestures!

                            Se definio que los "desktop" (salvo Surface) no usen Local Gestures (hammer). Pero si no se
                            inicia TouchManager, los "desktop" tampoco van a poder usar redireccion! y desktop es la
                            unica plataforma que da una buena experiencia en redireccion.
                        -------------------------------------------------------------------------------------------------
                        Sugiero revisar, y si esto es correcto, habria que traer de vuelta aca lo de initTouchDevice()
                        y/o tener en cuenta estas cuestiones para buscar una mejor solucion.
                        -------------------------------------------------------------------------------------------------
                        */
                        initTouchDevice();
                    }
                    THIN.connect();
                    adjustMainSize();
                }
            } catch (e) {
                alert(e.message);
                terminate();
            }
        } else {
            // alert("invalid data");
            terminate();
        }
    }

    function blockMessage(msg, animated) {
        var msg = "<div class='popup' id='connectingDlg'><h2>" + msg + "</h2><div id='connDlgBody'>" +
            (animated !== false ?
                "<img id='ecWaiting' src='../images/core/loadajax.gif'/>" :
                "<div class='popuplink' onclick='backToMain()'>OK</div>") +
            "</div></div>"
        $.blockUI({
            message: msg,
            css: {
                'padding': 0, 'margin': 0,
                'width': '100%', 'height': '100%',
                'top': '0px', 'left': '0px',
                'textAlign': 'center',
                'backgroundColor': 'transparent',
                'border': 'none',
                'cursor': 'auto'
            }, centerX: true, centerY: true
        });
    }

    blockMessage(thinVncConsts.pleaseWait);

    function getConnectionInfo() {
        return unescape(data);
    };

    connect();
});

function terminate(message) {
    // -- IN01676 - Connect directly from URL or custom HTML.
    // IN02819 -- customSettings.noShowPopupsOnClose doesn't work properly
    if (helper.object.getValue(mythinvnc, "tv.rcParams.auto", false)) {
        if (helper.object.getValue(mythinvnc, "tv.rcParams.noShowPopupsOnClose", false)) {
            closeWindow();
        } else {
            window.history.replaceState({ "pageTitle": document.title }, "", window.location.href.replace("vnc/", ""));
            alertPopup(thinVncConsts.connectionClosed, "", "disconnectedDlg", "", "", closeWindow, false, "Close");
        }
    } else {
        if (helper.object.getValue(mythinvnc, "tv.rcParams.noShowPopupsOnClose", false)) {
            ((runInNewWindow || helper.object.getValue(mythinvnc, "tv.rcParams.auto", false)) ? doTerminate : gotoMain)();
        } else {
            var action = (runInNewWindow || helper.object.getValue(mythinvnc, "tv.rcParams.auto", false)) ? doTerminate : gotoMain;
            alertPopup(message || thinVncConsts.connectionClosed, "", "disconnectedDlg", "", "", action, false);
        }
    }
    // IN02819 -- customSettings.noShowPopupsOnClose doesn't work properly
};

function backToMain() {
    (runInNewWindow) ? closeWindow() : gotoMain();
}

function gotoMain() {
    if (typeof mythinvnc != "undefined" && mythinvnc.tv && mythinvnc.tv.rcParams.fromBroker) {
        window.location.href = window.location.origin;
        return;
    }
    // IN02515 -- Uploads using the toolbar button always cuts the first character of the filename.
    // with reverse-proxy only: now it goes to the parent path insteadof the root.
    var url = "/";
    if (typeof THIN != "undefined" && THIN) {
        url = THIN.getAjaxUrl();
    }
    if (typeof mythinvnc != "undefined" && mythinvnc) {
        url = mythinvnc.tv.getAjaxUrl();
    }
    if (url != "/") {
        url = url.split("/");
        if (url.pop() == "") {
            url.pop();
            url.push("");
        }
        url = url.join("/");
    }
    // IN02515
    window.location.href = url;
}

function doTerminate() {
    if (data.fromGateway != "undefined" && data.fromGateway == true && window != top) {
        window.top.postMessage({ "cmd": "CLOSE" }, "*");
    } else if (mythinvnc.tv.rcParams.auto) {
        window.history.replaceState({ "pageTitle": document.title }, "", window.location.href.replace("vnc/", ""));
    } else {
        closeWindow();
    }
}

function clean() {
    // [BUG 4710] [JS] No esta ofuscando el codigo de los js en la build.
    if (mythinvnc) { mythinvnc = null; }
    // [BUG 4710] [JS] No esta ofuscando el codigo de los js en la build.
    data = null;
}

function closeWindow() {
    var win = window;
    var ai = new AgentInfo();
    if (ai.getAgentKey() == "ANDROID_SAFARI")
        win.opener = 'x';
    else if (ai.isChrome) {
        win = window.open("", "_self", "", "true");
        win.opener = true;
    }
    else if (ai.isMSIE || ai.isTrident) {
        win = window.open("", "_top", "", "true");
        win.opener = true;
    }
    window.close();
};
