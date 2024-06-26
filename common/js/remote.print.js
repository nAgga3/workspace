// =============================================================================================================================
// Copyright 2021, CybeleSoft
// CYBELESOFT
// 202100901.1
// info@cybelesoft.com
// =============================================================================================================================
// -- Required:
// -- helper.js
// *****************************************************************************************************************************
// THINFINITY REMOTE PRINT CLASS ***********************************************************************************************
// *****************************************************************************************************************************
//(function () {
//    (function RemotePrint() {
//        // -- PRIVATE VARIABLES ************************************************************************************************
//        var _ref = this;
//        var _iframe = null;
//        var _args = {};
//        // -- END PRIVATE VARIABLES ********************************************************************************************
//        // -- PRIVATE METHODS **************************************************************************************************
//        function initialize() {
//            debugger;
//            helper.dom.ready(ready);
//        }
//        function ready(e) {
//            _iframe = helper.dom
//        }
//        // -- END PRIVATE METHODS **********************************************************************************************
//        initialize();
//        // -- PUBLIC METHODS ***************************************************************************************************
//        //Object.defineProperty(_ref, '', { 'enumerable': true, 'configurable': false, 'value':  });
//        // -- END PUBLIC METHODS ***********************************************************************************************
//        return _ref;
//    })();
//})();

window.onload = function () {
    var _iframe = document.getElementById("ifrRemotePrint");
    var _parentWnd = null;
    window.onmessage = function (e) {
        if (e) {
            if (!_parentWnd) _parentWnd = e.source;
            if (e.data) {
                switch (e.data.cmd) {
                    case "setDocument":
                        _iframe.src = e.data.url;
                        break;
                    case "print":
                        _iframe.contentWindow.document.body.focus();
                        _iframe.contentWindow.focus();
                        _iframe.focus();
                        _iframe.contentWindow.print();
                        break;
                }
            }
        }
    };

};
// *****************************************************************************************************************************
// END THINFINITY REMOTE PRINT CLASS *******************************************************************************************
// *****************************************************************************************************************************