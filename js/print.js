function requirePrint() {
    let wnd = window.opener || window.parent;
    if (wnd) wnd.postMessage("{ \"evt\": \"PRINT_SCREEN\" }", "*");
}
function printDocument(img) {
    function printLoadedImage() {
        var ifrm = null;
        if (agentInfo.isMobile && agentInfo.isChrome) {
            ifrm = window.parent.document.getElementById('iframeToPrint');
            ifrm.style.left = "0px";
            ifrm.style.top = "0px";
            ifrm.style.width = '100%';
            ifrm.style.height = '100%';
            ifrm.style.position = 'absolute';
            window.focus();
            window.print();
            console.log("remove iframe print");
            window.parent.document.body.focus();
            window.parent.document.body.removeChild(ifrm);
        } else {
            window.focus();
            window.print();
            window.parent.document.body.focus();
        }
    }
    if (typeof img.complete == "undefined" || img.complete) printLoadedImage();
    else {
        // Image data is not completed but it is loaded.
        var maxTimes = 30;
        var countTimes = 0;
        function retryLoadImage() {
            setTimeout(function () {
                if (countTimes > maxTimes) {
                    // Cannot process this image.
                    return;
                } else {
                    if (img.complete) printLoadedImage();
                    else retryLoadImage();
                }
                countTimes++;
            }, 100);
        };
    }
    // -- Detecting print end;
    let intervalId = null;
    let intervalTime = 500;
    let startPrinting = 0;
    let maxTime = 120000;
    let isPrinting = null;
    let done = () => {
        clearInterval(intervalId);
        isPrinting = false;
        window.focus();
        window.close();
    };
    startPrinting = new Date().getTime();
    clearInterval(intervalId);
    intervalId = setInterval(function () {
        if (document.activeElement && (!document.hasFocus())) isPrinting = true;
        else done();
        if ((new Date().getTime() - startPrinting) > maxTime) {
            clearInterval(intervalId);
            isPrinting = false;
            done();
        }
    }, intervalTime);
}

function fillData(e) {
    var obj = null;
    obj = JSON.parse(e.data);
    if (obj["evt"] == "PRINT") {
        // -- In some versions of IE Egde, cssText (write method) is not implemented.
        try {
            document.styleSheets[0].rules[0].cssText = document.styleSheets[0].rules[0].cssText.replace("#title#", obj["title"]);
        } catch (error) {
            // -- Not implemented.
        }
        document.getElementById("screenImg").src = obj["src"];
    }
}
if (window.addEventListener) addEventListener("message", fillData, false);
else attachEvent("onmessage", fillData);

window.onload = function () {
    document.getElementById('screenImg').onload = function () {
        printDocument(this);
    };
    requirePrint();
};