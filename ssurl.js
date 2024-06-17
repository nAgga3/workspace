/* Thinfinity(c) Remote Desktop Server v7.0.3.114 */
function getOneTimeUrl(serverurl, apikey, model, passlen, expires, success,error) {
    if (!serverurl) serverurl = location.pathname.substr(0, location.pathname.lastIndexOf('/'));
    if (!passlen) passlen = 8;
    if (!expires) expires = 30;
    if (serverurl.lastIndexOf("/") == serverurl.length - 1) serverurl = serverurl.substring(0, serverurl.length - 1);
    var curdate = new Date();
    var currtime = curdate.getFullYear() + "- " + curdate.getMonth() + "- " + curdate.getDate() + "- " + curdate.getHours() + "- " + curdate.getMinutes() + "- " + curdate.getSeconds() + "- " + curdate.getMilliseconds();

    $.ajax({
        url: serverurl + "/ws/oturl/get?json=1&apikey=" + apikey + "&model=" + model + "&plen=" + passlen + "&expires=" + expires + "&t=" + currtime,
        dataType: "json",
        statusCode: {
            200: function(data) {
                success(data.key,data.pass);
            },
            401: function () {
                error("401 - Unauthorized: Access is denied due to invalid credentials.")
            }
        }
    });
}

function getGatewayAccessKey(serverurl, key, pass, success, error) {
    if (!serverurl) serverurl = location.pathname.substr(0, location.pathname.lastIndexOf('/'));

    $.ajax({
        url: serverurl + "/ws/oturl/getGatewayAccessKey?key=" + key + "&pkey=" + pass,
        dataType: "json",
        statusCode: {
            200: function (data) {
                if (data.rc==0) success(data.gak)
                else error("No active session.");
            },
            401: function () {
                error("401 - Unauthorized: Access is denied due to invalid credentials.");
            },
            404: function () {
                error("404 - Not found.");
            }
        }
    });
}

function createSharedSession(serverurl, gak, key, pass, viewonly, success, error) {
    if (!serverurl) serverurl = location.pathname.substr(0, location.pathname.lastIndexOf('/'));

    var pgak = "";
    if (gak != "") pgak = "/" + gak;

    $.ajax({
        url: serverurl + pgak + "/ws/oturl/createSharedSession?key=" + key + "&pkey=" + pass + "&viewonly=" + viewonly,
        dataType: "json",
        statusCode: {
            200: function(data) {
                if (data.rc==0) success(pgak + "/oturl.html?skey=" + data.key + "&pkey=" + data.pass)
                else error("OTURL session not found.");
            },
            401: function () {
                error("401 - Unauthorized: Access is denied due to invalid credentials.");
            },
            404: function () {
                error("404 - Not found.");
            }
        }
    });
}
