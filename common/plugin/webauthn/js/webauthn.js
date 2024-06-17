if (document.readyState != 'loading') {
    ready();
} else {
    document.addEventListener('DOMContentLoaded', ready);
}

var appMessages = {
    connectionError: 'Something went wrong, please try again.',
};

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


var tfdata = null;
var messenger = null;
var username = "unknown";
function ready() {
    var webAuthnAuthentication = Thinfinity.global.variables.webAuthnAuthentication;
	// var data = (totpauthentication.length > 0) ? totpauthentication : '<%=data%>';
    // tfdata = (data) ? JSON.parse(data) : {};
    tfdata = (webAuthnAuthentication) ? JSON.parse(webAuthnAuthentication) : {};    
    if (Array.isArray(tfdata) && (tfdata.length == 2))
    {
        username = tfdata[0].username;
        //debugger;
    } else 
    if (typeof(tfdata.publicKey) != "undefined") 
    {   
        username = tfdata.username;             
        tfdata.publicKey.challenge = bufferDecode(tfdata.publicKey.challenge);
        if (tfdata.credAssertion) 
        {
            for (let i=0; i < tfdata.publicKey.allowCredentials.length; i++)
                tfdata.publicKey.allowCredentials[i].id = _base64ToArrayBuffer(tfdata.publicKey.allowCredentials[i].id);
            navigator.credentials.get({publicKey: tfdata.publicKey}).then(function (res) {
                //debugger;
                AssertCredentials(tfdata, res);
                //console.log(res);
            })
        } else {
            tfdata.publicKey.user.id = bufferDecode(tfdata.publicKey.user.id);
        
            navigator.credentials.create({
                publicKey: tfdata.publicKey
            }).then(function (newCredential) {
                console.log("PublicKeyCredential Created");
                console.log(newCredential);
                //state.createResponse = newCredential;
                registerNewCredential(tfdata, newCredential);
            }).catch(function (err) {
                console.error(err);
            });
        }
    }

    document.getElementById('btnRegister').addEventListener('click', registerClick);
    document.getElementById('btnAssert').addEventListener('click', assertClick);
    document.getElementById('btnCancel').addEventListener('click', cancelClick);

    document.getElementById('two_factor_recovery_username').value = username;
    document.getElementById('two_factor_recovery_username').addEventListener('click', function () { this.select(); });
    document.getElementById('show_recovery_options_button').addEventListener('click', showRecoveryOptions);
    document.getElementById('recovery_instructions_back').addEventListener('click', hideRecoveryOptions);
    document.getElementById('recovery_instructions_close').addEventListener('click', cancelClick);

    document.getElementById('tfa-recovery-options').style.display = "none";
    document.getElementById('tfa-code').style.display = "inline-block";

    if (!(Array.isArray(tfdata) && (tfdata.length == 2)))
        showRecoveryOptions();
}

// Encode an ArrayBuffer into a base64 string.
function bufferEncode(buffer) {
	if (buffer == null) return null;
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

// Don't drop any blanks
// decode
function bufferDecode(value) {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

function postResponse(path, code)
{
    try {
        var request = new XMLHttpRequest();

        request.open('POST', '/' + path, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
 
        request.onload = function () {
            try {
                if (this.status === 200 && typeof this.response == "string" && this.response.length > 0) {
                    var data = JSON.parse(this.response);
                    var result = (data && data.Result != undefined && data.Result != null) ? data.Result : 2;
                    var description = (data && typeof data.Description == "string") ? data.Description : appMessages.connectionError;

                    switch (result) {
                        case 0:
                            //success
                            window.location = "/";
                            break;
                        case 2:
                            //internal error
                            showMessage(description);
                            helper.console.error("Internal error:"+description);
                            break;
                        case 3:
                            //locked: too many incorrect codes
                            setTimelimit(tfdata.precision);
                            showMessage(description);
                            helper.console.error(description);
                            codeElem.value = "";
                            break;
                    }
                } else {
                    helper.console.error(appMessages.connectionError);
                    showMessage(appMessages.connectionError);
                }
            } catch (error) {
                helper.console.error(error);
                showMessage(appMessages.connectionError);
            }
        };

        request.onerror = function () {
            helper.console.error(appMessages.connectionError);
            showMessage(appMessages.connectionError);
        };

        request.send(encodeURI('authjson=' + code));
    } catch (error) {
        helper.console.error(error);
    }
}


function AssertCredentials(tfdata, assertCredential) {
    let authenticatorData = new Uint8Array(assertCredential.response.authenticatorData);
    let clientDataJSON = new Uint8Array(assertCredential.response.clientDataJSON);
    let signature = new Uint8Array(assertCredential.response.signature);
    let rawId = new Uint8Array(assertCredential.rawId);
    let userHandle = null;
    if (assertCredential.response.userHandle != null)
        userHandle = new Uint8Array(assertCredential.response.userHandle);

    var code = JSON.stringify({
            id: assertCredential.id,
            rawId: bufferEncode(rawId),
            type: assertCredential.type,
            isRegistration: false,
            response: {
                authenticatorData: bufferEncode(authenticatorData),
                clientDataJSON: bufferEncode(clientDataJSON),
                signature: bufferEncode(signature),
                userHandle: bufferEncode(userHandle),
            },
        });
    
    postResponse(tfdata.path, code);

    return false;
}

function registerNewCredential(tfdata, newCredential) {
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);

    var agentData = ""
    if (agentInfo.isMobile)
        agentData += "Mobile "
    if (agentInfo.isWindows)
        agentData += "Windows "
    else if (agentInfo.isMac)
        agentData += "Mac "
    else if (agentInfo.isLinux)
        agentData += "Linux "

    var code = JSON.stringify({
        id: newCredential.id,
        rawId: bufferEncode(rawId),
        type: newCredential.type,
        isRegistration: true,
        agentData: agentData,
        response: {
            attestationObject: bufferEncode(attestationObject),
            clientDataJSON: bufferEncode(clientDataJSON),
        },
    });

    try {
        var request = new XMLHttpRequest();

        request.open('POST', '/' + tfdata.path, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onload = function () {
            try {
                if (this.status === 200 && typeof this.response == "string" && this.response.length > 0) {
                    var data = JSON.parse(this.response);
                    var result = (data && data.Result != undefined && data.Result != null) ? data.Result : 2;
                    var description = (data && typeof data.Description == "string") ? data.Description : appMessages.connectionError;

                    switch (result) {
                        case 0:
                            //success
                            window.location = "/";
                            break;
                        case 1:
                            //invalid code
                            showMessage(description);
                            //selecting all text in code to allow easy retry
                            codeElem.select();
                            break;
                        case 2:
                            //internal error
                            showMessage(description);
                            break;
                        case 3:
                            //locked: too many incorrect codes
                            setTimelimit(tfdata.precision);
                            showMessage(description);
                            codeElem.value = "";
                            break;
                    }
                } else {
                    showMessage(appMessages.connectionError);
                }
            } catch (error) {
                showMessage(appMessages.connectionError);
            }
        };

        request.onerror = function () {
            showMessage(appMessages.connectionError);
        };

        request.send(encodeURI('authjson=' + code));
    } catch (error) {
    }

    return false;
}

function registerClick(event)
{
    var webAuthnAuthentication = Thinfinity.global.variables.webAuthnAuthentication;
	// var data = (totpauthentication.length > 0) ? totpauthentication : '<%=data%>';
    // tfdata = (data) ? JSON.parse(data) : {};
    tfdata = (webAuthnAuthentication) ? JSON.parse(webAuthnAuthentication) : {};
    if (Array.isArray(tfdata) && (tfdata.length == 2))
    {
        vals = tfdata[0];
        if (tfdata[0].credAssertion) vals = tfdata[1];

        vals.publicKey.challenge = bufferDecode(vals.publicKey.challenge);
        vals.publicKey.user.id = bufferDecode(vals.publicKey.user.id);
        
        navigator.credentials.create({
            publicKey: vals.publicKey
        }).then(function (newCredential) {
            console.log("PublicKeyCredential Created");
            console.log(newCredential);
            //state.createResponse = newCredential;
            registerNewCredential(vals, newCredential);
        }).catch(function (err) {
            console.info(err);
        });
    }
}

function assertClick(event)
{
    var webAuthnAuthentication = Thinfinity.global.variables.webAuthnAuthentication;
	// var data = (totpauthentication.length > 0) ? totpauthentication : '<%=data%>';
    // tfdata = (data) ? JSON.parse(data) : {};
    tfdata = (webAuthnAuthentication) ? JSON.parse(webAuthnAuthentication) : {};
    if (Array.isArray(tfdata) && (tfdata.length == 2))
    {
        vals = tfdata[0];
        if (!tfdata[0].credAssertion) vals = tfdata[1];


        vals.publicKey.challenge = bufferDecode(vals.publicKey.challenge);
        for (let i=0; i < vals.publicKey.allowCredentials.length; i++)
        vals.publicKey.allowCredentials[i].id = _base64ToArrayBuffer(vals.publicKey.allowCredentials[i].id);
        navigator.credentials.get({publicKey: vals.publicKey}).then(function (res) {
            //debugger;
            AssertCredentials(vals, res);
            //console.log(res);
        })

        vals.publicKey.user.id = bufferDecode(vals.publicKey.user.id);
        
        navigator.credentials.create({
            publicKey: vals.publicKey
        }).then(function (newCredential) {
            console.log("PublicKeyCredential Created");
            console.log(newCredential);
            //state.createResponse = newCredential;
            registerNewCredential(vals, newCredential);
        }).catch(function (err) {
            console.info(err);
        });
    }
}

function cancelClick(event)
{
    window.location = "/?signin";
}

function setTimelimit(time) {
    try {
        var self = this;
        time = typeof time == "number" ? time : 30;

        var codeElem = document.getElementById("code");
        var continueBtn = document.getElementById("btnContinue");

        codeElem.setAttribute("disabled", "disabled");
        continueBtn.setAttribute("disabled", "disabled");

        setProgress(time, 100, function () {
            self.showMessage('');
            codeElem.removeAttribute("disabled");
            continueBtn.removeAttribute("disabled");
            codeElem.focus();
        });
    } catch (error) {
        console.log("Error while trying to set time limit lock on input. Error: " + error);
    }
}

function setProgress(time, step, callback, val, minus) {
    var progressBar = document.getElementById("locked-input-progress");
    try {
        var currentProgress = val;
        var newProgress = val;
        step = (typeof step == "number") ? step : 1000;

        if (time != null) {
            //time != null means the progress is starting
            currentProgress = newProgress = 100;
            minus = (step * 100) / (time * 1000);
        } else {
            newProgress = currentProgress - minus;
        }

        if (newProgress > 0) {
            progressBar.style.width = newProgress + '%';
            setTimeout(function () { setProgress(null, step, callback, newProgress, minus); }, step);
        } else {
            progressBar.style.width = '0%';
            if (typeof callback == "function") callback.call();
        }
    } catch (error) {
        progressBar.style.width = '0%';
        if (typeof callback == "function") callback.call();
        console.log("Error while displaying progressbar. Error: " + error);
    }
}

function showMessage(message) {
    var messageElem = document.getElementById("message");
    messageElem.innerText = message;
}

function showRecoveryOptions() {
    document.getElementById('tfa-code').style.display = "none";
    document.getElementById('tfa-recovery-options').style.display = "inline-block";
}

function hideRecoveryOptions() {
    document.getElementById('tfa-recovery-options').style.display = "none";
    document.getElementById('tfa-code').style.display = "inline-block";
}