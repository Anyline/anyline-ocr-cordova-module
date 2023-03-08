/*
 * Anyline Cordova Plugin
 * anyline.general.js
 *
 * Copyright (c) 2023 Anyline GmbH
 */

/**
 * Add a result div object to the Results area, pushing all older result divs down
 * and removing ones which are too old (as dermined by the `keepAmount` constant)
 * 
 * @param {Object} result the result object from the scan
 * @param {string} resultText a result text obtained another way from the result (the value
 * @param {boolean} includeFullImage indicate whether the full image should be shown or not (default)
 * is typically plugin-dependent). If present, it will be used in a "result" line in the
 * returned div object.
 */
function insertScanResult(result, resultText = "", includeFullImage = false) {
    // keep all but the last X and remove the rest (older ones). Should be defined
    // in a constants somewhere
    const keepAmount = 20;

    // we assume that pluginID and cropRect are properties of object. Otherwise,
    // this object is assumed to come from a composite scan (with each key itself
    // being a result object)
    if (!(result['pluginID'] && result['cropRect'])) {
        for (key in result) {
            insertScanResult(result[key], resultText, includeFullImage);
        }
        return;
    }

    var div = document.getElementById('results');
    if (div.childElementCount >= keepAmount) {
        div.removeChild(div.childNodes[div.childElementCount - 1]);
    }

    var filename = getFileNameFromPath(result.imagePath);
    var tagID = 'cropImg_' + filename;

    var fullFilename = getFileNameFromPath(result.fullImagePath);
    var tagFullID = 'fullImg_' + fullFilename;

    div.innerHTML = getResultHTML(result, resultText, tagID, includeFullImage ? tagFullID : "") + div.innerHTML;

    console.log("resolveLocalFileSystemURL:");
    var cachePath = "cdvfile://localhost/cache/";
    // set the img attributes using scheme (https://stackoverflow.com/a/64708261)
    window.resolveLocalFileSystemURL(cachePath, function (entry) {
        console.log("inside resolveLocalFileSystemURL");
        var nativeUrl = entry.toURL(); // will be "file://...."
        var schemeUrl = window.WkWebView.convertFilePath(nativeUrl);  // Will be "app://..."

        console.log(nativeUrl);
        console.log(schemeUrl);
        document.getElementById(tagID).src = schemeUrl + filename;
        if (includeFullImage) {
            document.getElementById(tagFullID).src = schemeUrl + fullFilename;
        }
    });
    document.getElementById(tagID).src = result.imagePath;
    if (includeFullImage) {
        document.getElementById(tagFullID).src = result.fullImagePath;
    }

    document.getElementById("details_scan_modes").removeAttribute("open");
    document.getElementById("details_results").setAttribute("open", "");
    window.scrollTo(0, 0);
}

/**
 * Get a <div>...</div> for a single result.
 * @param {string} resultText: a result text obtained another way from the result (the value
 * should be plugin-dependent). If present, it will be used in a "result" line.
 * @param {string} imgID: a string identifying the cropImage, to be used as the img ID attribute
 * @param {string} fullImgID: a string identifying the fullImage. Optional. If supplied, a fullImg
 * tag will be added.
 */
function getResultHTML(result, resultText, imgID, fullImgID = "") {
    var JSONString = JSON.stringify(result, ' ', 2);
    JSONString = safe_tags(JSONString);

    var cropRectX = result.cropRect.x;
    var cropRectY = result.cropRect.y;
    var cropRectWidth = result.cropRect.width;
    var cropRectHeight = result.cropRect.height;
    var cropRectStr = "(" + cropRectX + ", " + cropRectY + ", " + cropRectWidth + ", " + cropRectHeight + ")";

    var preStyle = "background-color:#ffffff20;" +
        "overflow-x:scroll;overflow-y:auto;" +
        "max-height:15em;" +
        "padding-top:10px;padding-left:10px;padding-bottom:10px;padding-right:10px;" +
        "overscroll-behavior:none";

    // img tags are left empty, to be resolved asynchronously
    return "<div style='margin-bottom:4em'>"
        + "<img id='" + imgID + "' src='' width=\"100%\" height=\"auto\"/>"
        + (fullImgID.length > 0 ? ("<img id='" + fullImgID + "' src='' width=\"100%\" height=\"auto\"/>") : "")
        + "<br/><br/><b>Plugin ID:</b> " + result.pluginID
        + (resultText.length > 0 ? ("<br/><b>Result: </b>" + resultText) : "")
        + (result.confidence > 0 ? ("<br/><b>Confidence: </b>" + result.confidence) : "")
        // + "<br/><b>Crop Rect: </b><pre>" + cropRectStr + "</pre></p>"
        + "<br/><b>Crop Rect: </b>" + cropRectStr + "</pre>"
        + "<div><b>Full result:</b><br/>"
        + "<pre style='" + preStyle + "'>" + JSONString + "</pre>"
        + "</div>"
        + "</div>";
}

function getFileNameFromPath(str) {
    return str.split('\\').pop().split('/').pop();
}

// https://stackoverflow.com/q/5499078
function safe_tags(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}