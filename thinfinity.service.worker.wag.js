/* Thinfinity(c) Remote Desktop Server v7.0.3.114 */
/// <reference path="wag/injections/thinfinity.wag.environment.js" />
// =============================================================================================================================
// Copyright 2023, CybeleSoft
// CYBELESOFT
// 20230809.1
// info@cybelesoft.com
// =============================================================================================================================

// *****************************************************************************************************************************
// THINFINITY WAG SERVICE WORKER CLASS *****************************************************************************************
// *****************************************************************************************************************************

(function ServiceWorker() {
    console.warn("Service worker loaded");
    var _ref = new Object();
    var _rule = null;
    //const _customHeaders = {
    //    navigationPage: "X-Thinfinity-WAG"
    //};
    const dismissStatus = (status) => {
        return (
            status >= 201 && status <= 226 ||
            status >= 300 && status <= 303 ||
            status >= 305 && status <= 308 ||
            status === 400 || status === 403 || status >= 405 && status <= 451 ||
            status >= 500
        );
    };
    var _messageChannels = null;
    const _injectionsLocation = "wag/injections/";
    //const _wagJsLocation = "wag/js/";
    //const _commonLocation = "common/js/";
    //const _SSKey = "__#thinfinity.wag.name__";
    const _minFiles = location.pathname.indexOf("min.js") != -1;
    const _log = { headers: false, document: false, resources: false, errors: true };
    const _isDefaultProfile = false;
    const _settings = {
        rewriteScripts: true
    };
    const _requiredFiles = _minFiles ?
        [`${""}thinfinity.wag.sw.dependencies.min.js`] :
        [
            `${_injectionsLocation}thinfinity.wag.environment.js`,
            `${_injectionsLocation}thinfinity.wag.rule.js`,
            `${_injectionsLocation}thinfinity.wag.script.js`,
            `${_injectionsLocation}thinfinity.wag.utils.js`,
            `${_injectionsLocation}thinfinity.parse5.bundle.js`,
            `${_injectionsLocation}thinfinity.jsxss.bundle.js`,
            `${_injectionsLocation}thinfinity.espree.bundle.js`
        ];
    const getHeaderRule = (response) => {
        let rule = null;
        if (response?.headers) {
            let base64 = response.headers.get(_utils.xCustomHeaders.rule);
            if (base64) {
                try {
                    rule = atob(decodeURIComponent(base64));
                    rule = JSON.parse(rule);
                    // -- Missing pathname in the rule (JSON)
                    let pathname = new URL(rule.url).pathname;
                    if (pathname.length > 1) {
                        pathname = pathname.substring(0, pathname.lastIndexOf("/") + 1);
                    } else pathname = "/";
                    rule.pathname = pathname;
                    rule = Thinfinity.WAG.Rules.buildRule(rule, { location: new URL(response.url) });
                } catch (err) {

                }
            }
        }
        return rule;
    };
    let _utils = null;
    var _wagging = false;

    function initialize() {
        addEventListeners(self);
        loadScripts(_requiredFiles);
    }
    function loadScripts(urls) {
        urls.forEach(url => loadScript(url));
        _utils = Thinfinity.Service.WAG.Utils;
        _oRule = Thinfinity.WAG.Rules;
        let filterXss = new jsxss.FilterXSS({ stripIgnoreTag: true, stripIgnoreTagBody: true });
        _purifier = filterXss.process.bind(filterXss);
    }
    function loadScript(url) {
        try {
            importScripts(url);
        } catch (err) {
            console.warn(`Load failed: ${err.message || err}`);
        }
    }
    async function processRequest(request, url, { accessKey = null, purify = true, reqOrigin = null, gateway = null } = {}) {
        let newRequest = null;
        let options = null;
        var clonedRequest = request.clone();
        let body = null;
        let cloned = !!url && request.url !== url;
        url = (!url) ? request.url : url;
        let fd = false;

        if (!["GET", "HEAD"].includes(clonedRequest.method.toUpperCase())) {
            try {
                if (purify) {
                    fd = await _utils.purifyFormData(clonedRequest, _purifier);
                    if (fd) body = new URLSearchParams(fd);
                }
                if (fd === false) body = await clonedRequest.arrayBuffer();
            } catch (err) {
                body = null;
            }
        }

        if (purify) {
            let mUrl = _utils.purifyQueryParams(url, _purifier);
            if (mUrl !== url) { cloned = true; url = mUrl; }
        }

        if (cloned || accessKey || reqOrigin) {
            newRequest = new Request(url, {
                method: clonedRequest.method,
                headers: clonedRequest.headers,
                body: body ?? undefined,
                mode: "cors",
                credentials: clonedRequest.credentials,
                cache: clonedRequest.cache,
                redirect: clonedRequest.redirect,
                referrer: clonedRequest.referrer,
                integrity: clonedRequest.integrity
            });

            if (accessKey) newRequest.headers.set(_utils.xCustomHeaders.accessKey, accessKey);
            if (reqOrigin) newRequest.headers.set(_utils.xCustomHeaders.origin, reqOrigin);
            //if (gateway && url.startsWith(gateway)) {
            //    newRequest.headers.set("X-Thinfinity-Referrer", gateway);
            //}
        }

        if (url.match(_utils.regExp.manifest)) {
            options = { credentials: "include" };  //crossorigin="use-credentials"
        }

        return { request: newRequest || request, options };
    }
    function redirectToPath(path, { hadAccessKey = false } = {}) {
        path = path ?? '/';
        new Response(`
            <script type="text/javascript">
                // Added on purpose, to avoid infinity loop
                if (${hadAccessKey} || location.pathname.toLowerCase() !== "${path.toLowerCase()}" ) {
                    location = "${path}";
                } else {
                    location = "/";
                }
            </script>`, { headers: { 'Content-Type': 'text/html' } });
    }
    function addEventListeners(self) {
        self.addEventListener("install", function (event) {
            /*
                The parameter passed into the oninstall handler, the InstallEvent interface represents an install action that is dispatched on the ServiceWorkerGlobalScope
                of a ServiceWorker. As a child of ExtendableEvent, it ensures that functional events such as FetchEvent are not dispatched during installation.
            */
            console.warn(`Service worker was installed`);
            event.waitUntil(self.skipWaiting());
        });
        self.addEventListener('activate', function (event) {
            console.warn(`Service worker was activated`);
            event.waitUntil(self.clients.claim());
        });
        //console.warn("attach message handler");
        self.addEventListener("message", function (event) {
            //console.warn("message received", event);
            if (event?.data?.cmd) {
                switch (event.data.cmd.toUpperCase()) {
                    case "INIT-PORT":
                        _messageChannels = event.ports[0];
                        console.warn(`Initializing port... New source window: ${event.source.id}`);
                        _messageChannels.postMessage({ "cmd": "PORT-REGISTERED" });
                        break;
                    case "REGISTER-RULE":
                        if (event.source.id && _messageChannels) {
                            let d = event.data;
                            if (d) {
                                _rule = d;
                                if (typeof Thinfinity != "undefined" && Thinfinity.WAG?.Rules) Thinfinity.WAG?.Rules.applyRule(_rule);
                                _messageChannels.postMessage({ "cmd": "DONE" });
                            } else {
                                console.warn(`Rule is not defined`);
                                _messageChannels.postMessage({ "cmd": "DONE" });
                            }

                        }
                        break;
                }
            }
        });
        //var _clients = false;
        self.addEventListener("fetch", fetchHandler);
    }
    function getVirtualPath(url) {
        try {
            if (_isDefaultProfile) return '/';
            else {
                url = (!(url instanceof URL)) ? new URL(url) : url;
                let vPath = url.pathname.substr(1).split("/")[0].trim();
                vPath = vPath.length > 0 ? `/${vPath}/` : '/';
                return vPath.toLowerCase();
            }
        } catch (error) {
            return url;
        }
    }

    function respondError(err = "Unknown") {
        return new Response(
            `Error fetching proxy resource. Error: ${err.toString()}`,
            {
                headers: { "Content-Type": "text/html", status: 500 },
            }
        );
    }
    async function fetchHandler(event) {
    /*
      The parameter passed into the ServiceWorkerGlobalScope.onfetch handler, FetchEvent represents a fetch action that is dispatched on the ServiceWorkerGlobalScope
      of a ServiceWorker. It contains information about the request and resulting response, and provides the FetchEvent.respondWith() method, which allows us to provide
      an arbitrary response back to the controlled page.
    */
        const requestUrl = event.request.url;
        // -- Only catch valid protocols
        const purl = new URL(requestUrl);
        if (purl.protocol.match(_utils.regExp.protocols) && (!(_utils.containsi(purl.pathname, 'thinfinity.') && ["script", "worker"].indexOf(event.request.destination) !== -1))) {
            let vPath = getVirtualPath(purl);
            if (_log.headers) for (const pair of event.request.headers.entries()) { console.log(`${pair[0]}: ${pair[1]}`); }

            if (["document", "iframe", "frame"].indexOf(event.request.destination) !== -1) {
                if (_log.document) console.log(`Requesting URL: ${requestUrl}`);
                event.respondWith((async () => {
                    //let reqObj = await processRequest(event.request, newUrl, { accessKey, purify: rule?.sanitizeInput, reqOrigin: rule?.baseUrl?.origin, gateway: rule?.gateway });
                    return fetch(event.request).then(async response => {
                        if (_log.headers) for (const pair of response.headers.entries()) { console.log(`${pair[0]}: ${pair[1]}`); }
                        const basicAuthen = response.headers.get("www-authenticate") || "";
                        if (basicAuthen) return response;
                        let sourceHeader = response.headers.get(_utils.xCustomHeaders.source)?.toUpperCase();
                        if (response.type == "opaqueredirect") {
                            // -- A string of data, specified by the server, which should be returned by the client unchanged.
                            // -- An opaque response is for a request made for a resource on a different origin that doesn't return CORS headers.
                            // -- With an opaque response we won't be able to read the data returned or view the status of the request, meaning we can't check if the request was successful or not
                            return response;
                            //return await processResponse(response);
                        } else if (["WAG", "WVPN"].indexOf(sourceHeader) !== -1) {
                            const ct = response.headers.get("content-type") || "";
                            _wagging = true;
                            if (!_rule) _rule = getHeaderRule(response);
                            if (!_rule) return redirectToPath("/");
                            if (_log.document) console.log(`Intercepting HTML Page... ${requestUrl}`);
                            if (ct.match(_utils.regExp.htmlDocument)) {
                                if (_log.document) console.log(`    Valid HTML Document ${requestUrl}, status: ${response.status}`);
                                if (!dismissStatus(response.status)) {
                                    if (_rule) {
                                        let newEncoding = false;
                                        if (_log.document) console.log(`    Adding HTML Rules... ${requestUrl}`);
                                        let ab = await response.clone().arrayBuffer();
                                        let dt = "utf-8";
                                        if (ct.match(_utils.regExp.charset)) {
                                            let ndt = _utils.regExp.charset.exec(ct)[2];
                                            // -- TK-1411 - TextDecoder Error, cannot use type within quotes.
                                            if (ndt) ndt = ndt.replaceAll(/\"|\'/g, "");
                                            newEncoding = (ndt !== dt);
                                            dt = ndt;
                                        }
                                        let td = new TextDecoder(dt);
                                        text = td.decode(ab);
                                        if (text !== "") {
                                            // -- Inject scripts and rules
                                            let dynScripts = "";
                                            let navigRules = "";
                                            if (_rule.scripts && _rule.scripts.length > 0) {
                                                navigRules += `window["__#thinNavigationRules__"] = ${JSON.stringify(_rule)};\n`;
                                                _rule.scripts.forEach(sUrl => { dynScripts += `<script src="${sUrl}" type="text/javascript" ></script>\n\r`; });
                                            }
                                            navigRules = `<script type="text/javascript" localResource="true">${navigRules}</script>\n`;
                                            let parsed = parse5.parse(text);
                                            let html = parsed.childNodes.find(t => t.tagName == "html");
                                            let head = html.childNodes.find(t => t.tagName == "head");
                                            if (_settings.rewriteScripts) parsed = parseAndProxyDocument(parsed);
                                            let pf = parse5.parseFragment(`${navigRules}\n${dynScripts}\n`);
                                            head.childNodes.splice(0, 0, ...pf.childNodes);
                                            text = parse5.serialize(parsed);
                                            let pResponse = { response, text };
                                            if (newEncoding) pResponse.headers = { "content-type": "text/html; charset=utf-8" };
                                            return await processResponse(pResponse);
                                        } else return response;
                                    } else {
                                        if (_log.errors) console.warn(`Rule is null or undefined for ${requestUrl}`);
                                        return response;
                                    }
                                } else return response;
                            } else return response;
                        } else {
                            _wagging = false;
                            if (_rule && requestUrl !== _rule.proxy.origin + _rule.path) {
                                // -- WAG Server is not respoding, back to main page
                                //_rule.proxy.origin + _rule.path
                                return redirectToPath(_rule.proxy.origin + _rule.path);
                            } else return response;
                        }
                    });
                })());
            } else {
                // -- Waiting for WAG activation.
                if (!_wagging) return;
                if (!_rule) _rule = getHeaderRule(response);
                if (!_rule) return redirectToPath("/");
                if (_rule) {
                    let newUrl = _utils.processUrl(requestUrl, _rule, { useGateway: _rule.remote });
                    if (newUrl != requestUrl) {
                        event.respondWith((async () => {
                            let reqObj = await processRequest(event.request, newUrl, { accessKey: _rule.remote ? _rule.accessKey : null, purify: _rule.sanitizeInput, reqOrigin: _rule.baseUrl.origin, gateway: _rule?.gateway });
                            return fetch(reqObj.request, reqObj.options).then(async response => {
                                let pResponse = { response };
                                let ct = response.headers.get("content-type");
                                try {
                                    if (_settings.rewriteScripts && (ct?.match(_utils.regExp.javascriptCType) || (event.request.destination === "script"))) {
                                        let { text, newEncoding } = await _utils.decodeText(response, ct);
                                        text = _utils.parseAndProxyCode(text);
                                        pResponse.text = text;
                                        if (newEncoding) pResponse.headers = { "content-type": "application/javascript; charset=utf-8" };
                                    }
                                } catch (err) {
                                    /*console.log("err", err);*/
                                    // -- Not valid JS
                                }
                                return await processResponse(pResponse);

                            }).catch((err) => {
                                if (_log.errors) console.warn(`Error when fetching html resource. ${requestUrl} `, err);
                                return respondError(err);
                            });
                        })());
                    }
                }
            }
        } else return;
    }
    async function processResponse({ response, text, headers = {}, overrideHeaders = false }) {
        let newResponse = null;
        //destination,text
        if (response.redirected || text) {
            // Resulted in a network error response: a redirected response was used for a request whose redirect mode is not "follow".
            const clonedResponse = response.clone();
            let body = text || await ('body' in clonedResponse ? Promise.resolve(clonedResponse.body) : clonedResponse.blob());

            let currentHeaders = {};
            if (!overrideHeaders) {
                for (let e of response.headers.entries()) {
                    currentHeaders[e[0]] = e[1];
                }
            }

            try {
                newResponse = new Response(body, {
                    headers: { ...currentHeaders, ...headers },
                    status: clonedResponse.status,
                    statusText: clonedResponse.statusText
                });
            } catch (err) {
                newResponse = null;
            }
        }
        return newResponse || response;
    }
    function parseAndProxyDocument(parsed) {
        try {
            let html = parsed.childNodes.find(t => t.tagName == "html");

            const findTagsThroughoutTree = (node, filter, acc = []) => {
                if (node?.childNodes) {
                    node?.childNodes.forEach(cn => {
                        findTagsThroughoutTree(cn, filter, acc);
                    });
                }

                acc.push(...filter.call(this, node));
                return acc;
            }

            const treeTagFilters = [
                (t) => {
                    if (t?.tagName == "script" && t.childNodes?.length > 0) {
                        return t.childNodes?.filter(cn => cn?.nodeName == "#text");
                    }
                    return [];
                },
                (t) => {
                    if (t?.attrs) {
                        return t.attrs.filter(at => at.name.startsWith("on") || (at.name == "href" && at.value.toLowerCase().startsWith("javascript:")) || (at.name === "style" && at.value.toLowerCase().startsWith("background")));
                    }

                    return [];
                }
            ];

            let tagsFiltered = findTagsThroughoutTree(html, (t) => {
                return treeTagFilters.map(f => f(t)).flat();
            });

            tagsFiltered.forEach(t => {
                try {
                    t.value = _utils.parseAndProxyCode(t.value);
                } catch (err) { }
            });
        } catch (err) {
            if (_log.errors) console.log(`[parse5] Error while parsing document ${err} - Fallback adding scripts to top: `);
        }

        return parsed;
    }


    // -- END PRIVATE METHODS **********************************************************************************************
    initialize();
    // -- PUBLIC METHODS ***************************************************************************************************

    // -- END PUBLIC METHODS ***********************************************************************************************
    return _ref;
})();

// *****************************************************************************************************************************
// END THINFINITY WAG SERVICE WORKER CLASS *************************************************************************************
// *****************************************************************************************************************************