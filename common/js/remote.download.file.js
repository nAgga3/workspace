// =============================================================================================================================
// Copyright 2021, CybeleSoft
// CYBELESOFT
// 202100901.1
// info@cybelesoft.com
// =============================================================================================================================
// -- Required:
// -- helper.js

// -- TK-1471 - Let me choose download folder.
function saveFilePrompt(name) {
    let ext = MimeType.getExtension(name);
    // -- Force "known" mimeType to not block "saveFilePicker" prompt.
    let mt = MimeType.getMimeType("text");//ext
    const opts = {
        suggestedName: name,
        excludeAcceptAllOption: false,
        types: [{
            description: name,
            accept: { [mt]: [`.${ext}`] },
        }],
    };

    return window.showSaveFilePicker(opts);
}

async function writeFile(fileHandle, contents) {
    try {
        // Create a FileSystemWritableFileStream to write to.
        const writable = await fileHandle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(contents);
        // Close the file and write the contents to disk.
        await writable.close();
        return true;
    } catch (e) {
        return e;
    }
}

async function saveFileTo(data) {
    // -- TK-1503 - Allow the user to download report file.
    let blob = null;
    if (data.url) blob = await fetch(data.url).then(r => r.blob());
    else if (data.base64) blob = await base64ToBlob(data.base64, MimeType.getMimeType(data.downloadName));
    if ("showSaveFilePicker" in window) {
        let fileHandle = await saveFilePrompt(data.downloadName);
        return await writeFile(fileHandle, blob);
    } else {
        helper.console.warning(consts.saveFilePickerNotSupported);
        return await createLink(blob, data.downloadName);
    }
}
// -- TK-1471 - Let me choose download folder.
// -- TK-1503 - Allow the user to download report file.
async function createLink(file, name) {
    var tempLink = document.createElement('a');
    tempLink.download = name;
    tempLink.href = window.URL.createObjectURL(file);
    tempLink.style.display = "none";
    tempLink.click();
    return true;
}
// -- TK-1503 - Allow the user to download report file.
async function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

window.onload = function () {
    //var _iframe = document.getElementById("ifrRemoteDownloadFile");
    var _parentWnd = null;
    window.onmessage = function (e) {
        if (e) {
            if (!_parentWnd) _parentWnd = e.source;
            if (e.data) {
                switch (e.data.cmd) {
                    case "downloadFile":
                        // -- Check is available in the current context. (only for secure protocols)
                        // -- TK-1471 - Let me choose download folder.
                        var downloadLink = false;
                        if (e.data.saveAs) {
                            // -- TK-1503 - Support http download with Save File Picker
                            saveFileTo(e.data).then(result => {
                                _parentWnd.postMessage({ "cmd": "downloadFileStatus", result, }, "*");
                            }).catch(err => {
                                _parentWnd.postMessage({ "cmd": "downloadFileStatus", result: err, }, "*");
                                downloadLink = true;
                            });
                        } else downloadLink = true;
                        // -- TK-1471 - Let me choose download folder.
                        if (downloadLink) {
                            var link = document.createElement('a');
                            link.href = e.data.url;
                            link.target = "_blank";
                            // -- IN05442 - Use downloadName instead URL name
                            link.download = e.data.downloadName;
                            var result = false;
                            try {
                                if (link.click) {
                                    link.click();
                                    result = true;
                                } else if (document.createEvent) {
                                    var e = document.createEvent('MouseEvents');
                                    e.initEvent('click', true, true);
                                    link.dispatchEvent(e);
                                    result = true;
                                } else {

                                }
                            } catch (error) {

                            }
                            _parentWnd.postMessage({ "cmd": "downloadFileStatus", result: result, }, "*");
                        }
                        break;
                }
            }
        }
    };

};