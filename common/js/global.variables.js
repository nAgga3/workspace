try { Thinfinity != undefined; }
catch (e) { window.Thinfinity = {}; }
if (typeof Thinfinity.global == "undefined") Thinfinity.global = {};
if (typeof Thinfinity.global.variables == "undefined") Thinfinity.global.variables = {};
(function(){
    Thinfinity.global.variables.version = "<%=$VERSION%>";
    Thinfinity.global.variables.wse = Thinfinity.global.variables.edition == 'WORKSTATION';
    try {
        Thinfinity.global.variables.serverInfo = JSON.parse('<%=$SERVER_INFO%>');
    } catch (error) {
        Thinfinity.global.variables.serverInfo = null;
    }
    try {
        Thinfinity.global.variables.kblayouts = '<%=$KBLAYOUTS%>';
        Thinfinity.global.variables.kblayouts = JSON.parse(Thinfinity.global.variables.kblayouts.substring(1, Thinfinity.global.variables.kblayouts.length - 1));
    } catch (error) {
        Thinfinity.global.variables.kblayouts = null;
    };
    Thinfinity.global.variables.maximize_start_page = "<%=$MAXIMIZE_START_PAGE%>";
    Thinfinity.global.variables.profile = '<%=profile%>';
    Thinfinity.global.variables.processId = "<%=$PROCESSID%>";
    Thinfinity.global.variables.basePath = "<%=@BASEURL%>";
    Thinfinity.global.variables.gatewayPin = "<%=@GWPIN%>";
    Thinfinity.global.variables.gwsid = "<%=@GWSID%>";
    Thinfinity.global.variables.edition = "<%=@EDITION%>";
    Thinfinity.global.variables.license = "<%=$LICPROD%>";
    Thinfinity.global.variables.minFiles = Thinfinity?.Files?.Environment?.minFiles || false;
    Thinfinity.global.variables.GfxEnabled = "<%=#GfxEnabled%>";
    Thinfinity.global.variables.H264Enabled = "<%=#H264Enabled%>";
    Thinfinity.global.variables.totpAuthentication = '<%=#totpauthentication%>';
	Thinfinity.global.variables.webAuthnAuthentication = '<%=#webauthnauthentication%>';
    Thinfinity.global.variables.helpUrl = '<%=@HELP_URL%>';
    try {
        Thinfinity.global.variables.serverParams = '<%=@PARAMS%>';
        if (Thinfinity.global.variables.serverParams) Thinfinity.global.variables.serverParams = JSON.parse(Thinfinity.global.variables.serverParams);
    } catch (error) {
        Thinfinity.global.variables.serverParams = null;
    }
    try { Thinfinity.global.variables.edition = parseInt(Thinfinity.global.variables.edition, 10); } catch (error) { Thinfinity.global.variables.edition = 0; }
    var postdata = document.querySelectorAll('meta[name="thinfinity-postdata"]');
    for (let i = 0, len = postdata.length; i < len; i++) {
        try {
            var name = postdata[i].getAttribute('data-name');
            var value = postdata[i].getAttribute('data-value');
            Thinfinity.global.variables[name] = value;
            var type = postdata[i].getAttribute('data-type');
            if (type === 'json') try {
                if (value.substr(0) == '(' && value.substr(value.length - 1) == ')') value = value.substring(1, value.length - 1);
                value = JSON.parse(value);
            } catch (error) { console.log('error parsing JSON (' + name + '): ' + error.message); }
            document.head.removeChild(postdata[i]);
        } catch (error) { console.log(error.message); }
    }
    // -- Remove thinfinity-detections
    document.querySelectorAll('script[name="thinfinity-detection"]').forEach(elem => { document.head.removeChild(elem); });
})();
