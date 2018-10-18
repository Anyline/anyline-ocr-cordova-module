'use strict';


function setupCutout(config) {
    var cutoutDiv = document.getElementById('anylineCutout');
    var backgroundDiv = document.getElementById('anylineBackground');
    var canvas = document.getElementById('anylineCanvas');
    document.body.style.overflow = 'hidden';

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
    // cutoutDiv.style.boxShadow = outerAlpha ? '0 0 0 99995px rgba(0, 0, 0, ' + outerAlpha + ')' : '0 0 0 99995px rgba(0, 0, 0, 0.0)';
    cutoutDiv.style.boxShadow = `0 0 0 99995px ${getColorFromHexString(outerAlpha)}`;

    // offset

    //  if (offset && offset.x) {
    //
    //    cutoutDiv.style.marginLeft = offset.x + 'px';
    //
    //  }
    //
    //  if (offset && offset.y) {
    //
    //    cutoutDiv.style.marginTop = offset.y + 'px';
    //
    //  }


    // Check if cutout is out of the View and put it back if so


    var _cutoutDiv$getBoundin = cutoutDiv.getBoundingClientRect(),
        left = _cutoutDiv$getBoundin.left,
        right = _cutoutDiv$getBoundin.right,
        top = _cutoutDiv$getBoundin.top,
        bottom = _cutoutDiv$getBoundin.bottom;
    /*
      if (left <= 0) {
        cutoutDiv.style.marginLeft = '0';
        backgroundDiv.style.justifyContent = 'flex-start';
      }
    
      if (top <= 0) {
        cutoutDiv.style.marginTop = '0';
        cutoutDiv.style.alignSelf = 'flex-start';
      }
    
      if (right >= document.documentElement.scrollWidth) {
        cutoutDiv.style.marginLeft = '0';
        backgroundDiv.style.justifyContent = 'flex-end';
      }
    
      if (bottom >= document.documentElement.scrollHeight) {
        cutoutDiv.style.marginTop = '0px';
        cutoutDiv.style.alignSelf = 'flex-end';
      }
      */
}

function setCutoutBorders(feedbackColor) {
    var cutoutDiv = document.getElementById('anylineCutout');
    cutoutDiv.style.borderColor = getColorFromHexString(feedbackColor);
}