(function () {
    var intervalId = null;
    var checkIntervalTime = null;
    function start(value) {
        checkIntervalTime = value;
        clearInterval(intervalId);
        intervalId = setInterval(function () {
            postMessage({ 'cmd': 'send' });
        }, checkIntervalTime);
        postMessage({ 'cmd': 'send' });
    }
    function stop() {
        clearInterval(intervalId);
    }
    onmessage = function (e) {
        if (e.data && e.data.cmd) {
            switch (e.data.cmd) {
                case 'start':
                    start(e.data.value);
                    break;
                case 'stop':
                    stop();
                    break;
            }
        }
    };
})();