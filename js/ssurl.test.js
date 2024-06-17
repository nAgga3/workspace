
function getOtUrl() {
    getOneTimeUrl(null, document.getElementById('apikey').value, document.getElementById('model').value, null, null,
        function (key, pass) {
            oturl.key = key;
            oturl.pass = pass;
            var surl = helper.url.parseUrl(location.href).toUrl("-r");
            document.getElementById('oturl').innerText = document.getElementById('oturl').href = surl + 'oturl.html?key=' + key + '&pkey=' + pass;
        },
        function (msg) {
            alert(msg);
        });
}

function getGAK() {
    getGatewayAccessKey(null, oturl.key, oturl.pass,
        function (gak) {
            oturl.gak = gak;
            document.getElementById('gak').value = gak;
        },
        function (msg) {
            alert(msg);
        })
}

function createSSUrl() {
    createSharedSession(null, oturl.gak, oturl.key, oturl.pass, document.getElementById('viewonly').checked,
        function (url) {
            var surl = helper.url.parseUrl(location.href).toUrl("-r");
            if (surl.endsWith("/")) surl = surl.substr(0, surl.length - 1);
            document.getElementById('ssn').innerText = document.getElementById('ssn').href = surl + url;
        },
        function (msg) {
            alert(msg);
        })
}

var oturl = { key: "", pass: "", gak: "" };
helper.dom.ready(function () {
    helper.dom.addEvent(document.getElementById('btnGetOtURL'), 'click', getOtUrl, false);
    helper.dom.addEvent(document.getElementById('btnGetGAK'), 'click', getGAK, false);
    helper.dom.addEvent(document.getElementById('btnGetSSN'), 'click', createSSUrl, false);
});