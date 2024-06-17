if (typeof (GfxModule) === "undefined") {
    importScripts('gfx.module.js');
}

const CMD_CREATE_SURFACE = 1;
const CMD_DELETE_SURFACE = 2;
const CMD_FRAME = 3;
const CMD_REPAINT = 4;

var decoderInitialized = false;
var loopIsRunning = false;

var DecoderModule;
var enableLog;          //INT32 enableLog(CHAR* logFileName, UINT32 level)
var initSurface;        //INT32 initSurface(UINT32 surfaceId, UINT32 width, UINT32 height, UINT32 scanline, BYTE pixelFormat, BYTE* pDstData)
var gfxDecode;          //INT32 gfxDecode(UINT32 surfaceId, UINT32 cmdId, UINT32 left, UINT32 top, UINT32 width, UINT32 height, const BYTE* pSrcData, UINT32 SrcSize)
var gfxDecodeFrame;     //INT32 gfxDecodeFrame(const BYTE* pSrcData, UINT32 SrcSize)
var getSurfaceChanges;  //INT32 getSurfaceChanges(UINT32 surfaceId, RECTANGLE_16* changes, UINT32* changesCount)

var pixelData = null;
var surfaces = [];
var changesBuffSize = 1024 * 8;  //1024 * sizeof(RECTANGLE_16)
var pChangesBuff = 0;
var pChangesCount = 0;
var cmdQueue = [];
var frameBufferLen = 0;
var frameBufferPtr = 0;
var screenBuffers = [];

function decodeCmd(surfaceId, cmdId, left, top, width, height, dataLen, data) {
    var ptr = 0;
    if (dataLen > 0) {
        var cmdData = data.subarray(28);
        ptr = DecoderModule._malloc(dataLen);
        DecoderModule.HEAPU8.set(cmdData, ptr);
    }
    var res = gfxDecode(surfaceId, cmdId, left, top, width, height, ptr, dataLen);
    if (ptr != 0) DecoderModule._free(ptr);
    return res;
}

function decodeFrame(dataLen, data) {
    var res = null;
    if (dataLen > 0) {
        var cmdData = data.subarray(12);
        if (dataLen > frameBufferLen) {
            try {
                if (frameBufferPtr != 0) DecoderModule._free(frameBufferPtr);
                frameBufferPtr = DecoderModule._malloc(dataLen);
                frameBufferLen = dataLen;
            }
            catch(error) {
                console.error("GFX: malloc failed for decodeFrame", dataLen, error);
                return null;
            }
        }
        DecoderModule.HEAPU8.set(cmdData, frameBufferPtr);
    }
    try {
        res = gfxDecodeFrame(frameBufferPtr, dataLen);
    }
    catch(error) {
        console.error("GFX: decodeFrame failed", error);
    }
    return res;
}

function applyChanges(surface) {
    decoderData = DecoderModule.HEAPU8.subarray(surface.screenBuff, surface.screenBuff + surface.screenBuffSize);

	if ((pixelData != null) && ((decoderData.length == pixelData.length)))
		pixelData.set(decoderData);
	else {
		pixelData = new Uint8ClampedArray(decoderData);
	}

	var imgData = new ImageData(pixelData, surface.width, surface.height);
    var cnt = DecoderModule.HEAPU32[pChangesCount>>2];
    var regionL = surface.width;
    var regionT = surface.height;
    var regionR = 0;
    var regionB = 0;
    var ctx = surface.offscreen.getContext('2d');
    for (var i=0; i < cnt; i++) {
        var offset = (pChangesBuff >> 1) + (i*4);
        var left = DecoderModule.HEAPU16[offset];
        var top = DecoderModule.HEAPU16[offset+1];
        var right = DecoderModule.HEAPU16[offset+2];
        var bottom = DecoderModule.HEAPU16[offset+3];
        ctx.putImageData(imgData, 0, 0, left, top, right-left, bottom-top);
        if (left < regionL) regionL = left;
        if (top < regionT) regionT = top;
        if (right > regionR) regionR = right;
        if (bottom > regionB) regionB = bottom;
    }

    var bmp = surface.offscreen.transferToImageBitmap();
    postMessage({'type': 'paint', 'surface': surface.webId, 'bitmap': bmp, 't': regionT, 'l': regionL, 'r': regionR, 'b': regionB}, [bmp]);
}

function processQueue() {
    while (cmdQueue.length > 0) {
    	loopIsRunning = true;
        var cmd = cmdQueue[0];
        cmdQueue.splice(0,1);

        switch (cmd.type) {
            case CMD_CREATE_SURFACE:
                var scanline = cmd.data.width * 4;
                var screenBuffSize = scanline * cmd.data.height;
                var pScreenBuff = 0;
                if (screenBuffers[cmd.data.id]) {
                    if (screenBuffers[cmd.data.id].size >= screenBuffSize)
                        pScreenBuff = screenBuffers[cmd.data.id].buffer;
                    else {
                        DecoderModule._free(screenBuffers[cmd.data.id].buffer);
                    }
                }
                if (pScreenBuff == 0) {
                    try {
                        pScreenBuff = DecoderModule._malloc(screenBuffSize);
                        screenBuffers[cmd.data.id] = { buffer: pScreenBuff, size: screenBuffSize };
                    }
                    catch(error) {
                        console.error('GFX: _malloc failed for screen buffer', screenBuffSize, error);
                    }
                }
                var res = initSurface(cmd.data.id, cmd.data.width, cmd.data.height, scanline, cmd.data.pixelFormat, pScreenBuff);
                if (res == 0) {
                    surfaces[cmd.data.id] = {id: cmd.data.id,
                                             webId: cmd.data.webId,
                                             width: cmd.data.width,
                                             height: cmd.data.height,
                                             scanline: scanline,
                                             pixelFormat: cmd.data.pixelFormat,
                                             screenBuff: pScreenBuff,
                                             screenBuffSize: screenBuffSize,
                                             offscreen: new OffscreenCanvas(cmd.data.width, cmd.data.height),
                                             initialized: decoderInitialized}
                }
                else {
                    console.error("GFX: initSurface failed with code " + res);
                }
                break;
            case CMD_DELETE_SURFACE:
                if (surfaces[cmd.data.id]) surfaces[cmd.data.id] = null;
                break;
            case CMD_FRAME:
                var data = cmd.data;
                var res;
                var frameId = null;
                const view = new DataView(data.buffer);
                var surfaceId = view.getUint32(data.byteOffset, true);
                var cmdId = view.getUint32(data.byteOffset+4, true);
                if (cmdId == 255) {
                    var dataLen = view.getUint32(data.byteOffset+8, true);
                    res = decodeFrame(dataLen, data);
                    frameId = res;
                }
                else {
                    var left = view.getUint32(data.byteOffset+8, true);
                    var top = view.getUint32(data.byteOffset+12, true);
                    var width = view.getUint32(data.byteOffset+16, true);
                    var height = view.getUint32(data.byteOffset+20, true);
                    var dataLen = view.getUint32(data.byteOffset+24, true);
                    res = decodeCmd(surfaceId, cmdId, left, top, width, height, dataLen, data);
                }
                for (var i=0; i<surfaces.length; i++) {
                    if (surfaces[i] == null) {
                        //console.log("GFX: surface not assigned: " + i);
                        continue;
                    }
                    try {
                        getSurfaceChanges(surfaces[i].id, pChangesBuff, pChangesCount);
                    }
                    catch (error) {
                        console.error("GFX: getSurfaceChanges error", error);
                        continue;
                    }
                    if (DecoderModule.HEAPU32[pChangesCount>>2] > 0) {
                        applyChanges(surfaces[i]);
                    }
                }
                if (frameId != null) {
                    postMessage({'type': 'frameEnd', 'frameId': frameId});
                }
                break;

            case CMD_REPAINT:
                for (var i=0; i<surfaces.length; i++) {
                    if (surfaces[i] != null) {
                        let surface = surfaces[i];
                        decoderData = DecoderModule.HEAPU8.subarray(surface.screenBuff, surface.screenBuff + surface.screenBuffSize);

						if ((pixelData != null) && (decoderData.length == pixelData.length))
							pixelData.set(decoderData);
						else {
							pixelData = new Uint8ClampedArray(decoderData);
						}

                        var imgData = new ImageData(pixelData, surface.width, surface.height);
                        var ctx = surface.offscreen.getContext('2d');
                        ctx.putImageData(imgData, 0, 0, 0, 0, surface.width, surface.height);
                        var bmp = surface.offscreen.transferToImageBitmap();
                        postMessage({ 'type': 'paint', 'surface': surface.webId, 'bitmap': bmp, 't': 0, 'l': 0, 'r': surface.width, 'b': surface.height}, [bmp]);
                    }
                }
                break;
        }
    }
    loopIsRunning = false;
}

function onMessage(e) {
    var message = e.data;
    switch(message.type) {
	    case 'addSurface':
            cmdQueue.push({'type': CMD_CREATE_SURFACE, 'data': message});
	        break;

	    case 'deleteSurface':
            cmdQueue.push({'type': CMD_DELETE_SURFACE, 'data': message});
	        break;

        case 'process':
            cmdQueue.push({'type': CMD_FRAME, 'data': message.data});
            break;

        case 'repaint':
            cmdQueue.push({'type': CMD_REPAINT});
            break;
    }
    if (decoderInitialized && !loopIsRunning) {
		setTimeout(processQueue, 0);
	}
}

addEventListener('message', onMessage);

GfxModule().then(instance => {
    DecoderModule = instance;
    enableLog = DecoderModule.cwrap('enableLog', 'number', ['number','number']);
    initSurface = DecoderModule.cwrap('initSurface', 'number', ['number','number','number','number','number','number']);
    gfxDecode = DecoderModule.cwrap('gfxDecode', 'number', ['number','number','number','number','number','number','number','number']);
    gfxDecodeFrame = DecoderModule.cwrap('gfxDecodeFrame', 'number', ['number','number']);
    getSurfaceChanges = DecoderModule.cwrap('getSurfaceChanges', 'number', ['number','number','number']);

    enableLog(0, 3);  // 2=WLOG_INFO, 3=WLOG_WARN
    pChangesBuff = DecoderModule._malloc(changesBuffSize);
    pChangesCount = DecoderModule._malloc(4);
    decoderInitialized = true;
    if (!loopIsRunning && cmdQueue.length > 0) {
        setTimeout(processQueue, 0);
    }
});
