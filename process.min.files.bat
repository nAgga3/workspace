type ^
	%cd%\common\js\thinfinity.files.environment.js ^
	%cd%\common\js\thinfinity.identification.js ^
	%cd%\wag\injections\thinfinity.wag.identification.js ^
	%cd%\wag\injections\thinfinity.wag.activation.js ^
	%cd%\wag\injections\thinfinity.wag.rule.js ^
	%cd%\wag\injections\thinfinity.jsxss.bundle.js ^
	%cd%\wag\injections\thinfinity.espree.bundle.js ^
	%cd%\wag\injections\thinfinity.wag.utils.js ^
	%cd%\wag\injections\thinfinity.proxy.cookie.js ^
	%cd%\wag\injections\thinfinity.wag.proxies.js ^
	%cd%\wag\injections\thinfinity.proxy.createElement.js ^
	%cd%\wag\injections\thinfinity.wag.ping.js ^
	%cd%\wag\injections\thinfinity.proxy.websocket.js ^
	%cd%\wag\injections\thinfinity.wag.fetch.js ^
	%cd%\wag\injections\thinfinity.wag.xmlhttprequest.js ^
	%cd%\wag\injections\thinfinity.wag.history.js ^
	%cd%\wag\injections\thinfinity.wag.script.js ^
	%cd%\wag\injections\thinfinity.wag.stylesheet.js ^
	%cd%\wag\injections\thinfinity.wag.images.js ^
	%cd%\wag\injections\thinfinity.wag.dom.js > ^
thinfinity.injections.rules.min.js

type ^
	%cd%\wag\injections\thinfinity.wag.environment.js ^
	%cd%\wag\injections\thinfinity.wag.rule.js ^
	%cd%\wag\injections\thinfinity.wag.script.js ^
	%cd%\wag\injections\thinfinity.wag.utils.js ^
	%cd%\wag\injections\thinfinity.parse5.bundle.js ^
	%cd%\wag\injections\thinfinity.jsxss.bundle.js ^
	%cd%\wag\injections\thinfinity.espree.bundle.js > ^
thinfinity.wag.sw.dependencies.min.js

type ^
	%cd%\common\js\thinfinity.files.environment.js ^
    %cd%\js\thinfinity.service.worker.registration.js ^
    %cd%\js\thinfinity.service.worker.initialization.js ^
    %cd%\js\thinfinity.service.worker.unsubscribe.js > ^
thinfinity.service.worker.registration.min.js

type ^
    %cd%\common\plugin\protobuf\protobuf.min.js ^
    %cd%\common\js\thinfinity.messaging.service.js ^
    %cd%\js\thinfinity.sw.notification.service.js > ^
SWNotificationService.min.js