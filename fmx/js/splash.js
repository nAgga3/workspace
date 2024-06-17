// =========================================================================================================================
// Copyright 2014, CybeleSoft
// CYBELESOFT
// 20141125.1
// info@cybelesoft.com
// =========================================================================================================================
// Required:
// *************************************************************************************************************************
// SPLASH CLASS ************************************************************************************************************
// *************************************************************************************************************************

function Splash(args) {
    // -- PRIVATE VARIABLES ************************************************************************************************
    var _args = {
        'parentObject':null
    };
    // -- END PRIVATE VARIABLES ********************************************************************************************
    // -- PRIVATE METHODS **************************************************************************************************
    function initialize(args) {
        if ((args != null) && (args != undefined)) {
            for (var arg in _args) {
                if (args[arg] != undefined) {
                    _args[arg] = args[arg];
                }
            }
        }
        if ((_args['parentObject'] == null) || (_args['parentObject'] == undefined)) {
            _args['parentObject'] = document.body;
        }
        if (_args['parentObject'] != null){
            createSplashScreen();
        }
    };
    function showSplash(title, text, animated, closeButton) {
        (animated) ? $("#splashgif").show(): $("#splashgif").hide();
        (closeButton) ? $("#closeButton").show() : $("#closeButton").hide();
        $("#splashTitle").html(title);
        $("#splashMessage").html(text);
        $("#splash").fadeIn("fast");
    };
    function hidePopupMessage() {
        $("#splashTitle").html("");
        $("#splashMessage").html("");
        $("#splashgif").hide();
        $("#closeButton").hide();
        $("#splash").fadeOut("slow");
    };
    function onClose() {
        // tries to close the window/tab
        window.close();
        // else returns to the calling page
        if (document.referrer && (location.href != document.referrer)) {
            location.href = document.referrer;
        }

        // else shows the splash
        showSplash("Application closed", "", false, false);
    };
    function createSplashScreen() {
        var div = $("<div/>").attr({ "id": "splash" }).addClass("app-splash").append("<br/>").append("<br/>");
        var row = $("<div/>").addClass("row");
        div.append(row);
        row.append($("<h1/>").attr({ "id": "splashTitle" }));
        row.append($("<h3/>").attr({ "id": "splashMessage" }));
        row.append($("<img/>").attr({ "id": "splashgif", "src": Thinfinity.global.variables.basePath + "images/loading.gif" }));
        row.append($("<a/>").attr({ "id": "closeButton", "href": "#" }).on("click", function (e) {
            // -- code.
            onClose();
        }).html("Close"));

        $(_args['parentObject']).prepend(div);
    };
    // -- END PRIVATE METHODS **********************************************************************************************

    // -- PUBLIC METHODS ***************************************************************************************************
    //Object.defineProperty(this, 'initialize', { 'enumerable': false, 'configurable': false, 'value': initialize });
    Object.defineProperty(this, 'hide', { 'enumerable': false, 'configurable': false, 'value': hidePopupMessage });
    Object.defineProperty(this, 'show', { 'enumerable': false, 'configurable': false, 'value': showSplash });
    // -- END PUBLIC METHODS ***********************************************************************************************
    initialize(args);
    return this;
};

// *************************************************************************************************************************
// END SPLASH CLASS ********************************************************************************************************
// *************************************************************************************************************************


