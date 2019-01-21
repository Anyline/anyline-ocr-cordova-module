'use strict';


function setupCutout(config) {
    var cutoutDiv = document.getElementById('anylineCutout');
    var backgroundDiv = document.getElementById('anylineBackground');
    var canvas = document.getElementById('anylineCanvas');
    document.body.style.overflow = 'hidden';

    if (cutoutDiv == null || backgroundDiv == null || canvas == null)
        return;

    var cornerRadius = config.cornerRadius,
        strokeWidth = config.strokeWidth,
        strokeColor = config.strokeColor,
        outerAlpha = config.outerAlpha,
        maxWidthPercent = config.maxWidthPercent,
        maxHeightPercent = config.maxHeightPercent,
        offset = config.offset,
        rect = config.rect;

    // size
    cutoutDiv.style.width = rect.right - rect.left + 'px';
    cutoutDiv.style.height = rect.bottom - rect.top + 'px';

    // alignment

    cutoutDiv.style.top = rect.top + 'px';
    cutoutDiv.style.marginLeft = rect.left + 'px';
    //}
    //cutoutDiv.style.marginLeft = 20 + 'px';
    cutoutDiv.style.borderRadius = cornerRadius ? cornerRadius * 2 + 'px' : '16px';
    cutoutDiv.style.borderWidth = strokeWidth ? strokeWidth + 'px' : '2px';
    cutoutDiv.style.borderStyle = 'solid';
    cutoutDiv.style.maxWidth = maxWidthPercent ? maxWidthPercent : '100%';
    cutoutDiv.style.maxHeight = maxHeightPercent ? maxHeightPercent : '100%';
    // borderColor
    cutoutDiv.style.borderColor = getColorFromHexString(strokeColor);
    // background
    cutoutDiv.style.boxShadow = `0 0 0 99995px ${getColorFromHexString(outerAlpha)}`;

    // Check if cutout is out of the View and put it back if so

    var _cutoutDiv$getBoundin = cutoutDiv.getBoundingClientRect(),
        left = _cutoutDiv$getBoundin.left,
        right = _cutoutDiv$getBoundin.right,
        top = _cutoutDiv$getBoundin.top,
        bottom = _cutoutDiv$getBoundin.bottom;
}

function setCutoutBorders(feedbackColor) {
    var cutoutDiv = document.getElementById('anylineCutout');
    if (cutoutDiv == null)
        return;

    cutoutDiv.style.borderColor = getColorFromHexString(feedbackColor);
}