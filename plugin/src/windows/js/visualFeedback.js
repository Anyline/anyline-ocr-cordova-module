"use strict";

class ALColor {
    constructor(hex) {
        this.initColor = hex;
        this.color = getColorFromHexString(hex);
    }

    getColor() {
        return this.color;
    }
}

class ALSquareInput {
    constructor(squares, textRect, points) {
        this.squares = squares;
        this.textRect = textRect;
        this.points = points;
    }
}

class ALModifier {
    constructor() {
        this.alphaModifier = [];
        this.sizeModifierX = [];
        this.sizeModifierY = [];
        this.index = 0;
        this.dir = 1;
    }
}

class ALDrawnElement {
    constructor(x, y, width, height, strokeColor, fillColor) {
        this.opacity = 1;
        this.xi = x;
        this.yi = y;
        this.wi = width;
        this.hi = height;
        this.scalex = 1;
        this.scaley = 1;
        this.strokeColor = new ALColor(strokeColor);
        this.fillColor = new ALColor(fillColor);
    }

    w() {
        return this.wi * this.scalex;
    }

    x() {
        return this.xi + (this.wi - this.w());
    }

    y() {
        return this.yi + (this.hi - this.h());
    }

    h() {
        return this.hi * this.scaley;
    }

}

class ALDrawnPoint {
    constructor(x, y, strokeColor, fillColor) {
        this.opacity = 1;
        this.xi = x;
        this.yi = y;
        this.scalex = 1;
        this.scaley = 1;
        this.strokeColor = new ALColor(strokeColor);
        this.fillColor = new ALColor(fillColor);
    }


    x() {
        return this.xi;
    }

    y() {
        return this.yi;
    }


}


var gmodifs = [];
var lastUpdate = new Date();

var ALUIFeedbackStyle = Object.freeze({
    "ALUIFeedbackStyleRect": 0,
    "ALUIFeedbackStyleContourRect": 1,
    "ALUIFeedbackStyleContourUnderline": 2,
    "ALUIFeedbackStyleContourPoint": 3,
    "ALUIFeedbackStyleNone": 4,
});

var ALUIVisualFeedbackAnimation = Object.freeze({
    "ALUIVisualFeedbackAnimationTraverseSingle": 0,
    "ALUIVisualFeedbackAnimationTraverseMulti": 1,
    "ALUIVisualFeedbackAnimationKitt": 2,
    "ALUIVisualFeedbackAnimationBlink": 3,
    "ALUIVisualFeedbackAnimationResize": 4,
    "ALUIVisualFeedbackAnimationPulse": 5,
    "ALUIVisualFeedbackAnimationPulseRandom": 6,
    "ALUIVisualFeedbackAnimationNone": 7,
});

function drawOverlayIntern(config, inSquares, modifier, clear) {
    if (typeof config == 'undefined') {
        return;
    }
    var lsquares = inSquares.squares;
    var textRect = inSquares.textRect;
    var lpoints = inSquares.points;

    var now = new Date();
    var lastToNow = now - lastUpdate;

    if (clear) {
        clearContext();
    }

    if (fromAppDebug) {
        var can = document.getElementById("anylineCanvas");
        var ctx = can.getContext("2d");
        ctx.strokeStyle = "#FF0000";
        ctx.strokeRect(1, 1, can.width - 2, can.height - 2);
    }

    if (lsquares != null && lsquares != 'undefined') {
        applyModifiers(config, modifier, lsquares);
    }
    switch (config.feedbackStyle) {
        case ALUIFeedbackStyle.ALUIFeedbackStyleRect:
            roundedPath(config, lpoints);
            break;
        case ALUIFeedbackStyle.ALUIFeedbackStyleContourRect:

            drawContourRectOverlay(config, lsquares);
            break;
        case ALUIFeedbackStyle.ALUIFeedbackStyleContourUnderline:
            drawContourUnderlineOverlay(config, lsquares);
            break;
        case ALUIFeedbackStyle.ALUIFeedbackStyleContourPoint:
            drawContourPointOverlay(config, lsquares);
            break;
        case ALUIFeedbackStyle.ALUIFeedbackStyleNone:
            break;
    }
    lastUpdate = new Date();
}

function initArray(size, val) {
    var array = [];
    while (size--) array.push(val);
    return array;
}

function applyModifiers(config, inModifier, lsquares) {
    if (typeof inModifier == 'undefined') {
        return;
    }
    var size = lsquares.length;

    var alphaModifier = initArray(size, 1);
    var sizeModifierX = initArray(size, 1);
    var sizeModifierY = initArray(size, 1);

    switch (config.visualFeedbackAnimation) {
        case ALUIVisualFeedbackAnimation.ALUIVisualFeedbackAnimationTraverseSingle:
            alphaModifier = mod_traverseSingle(lsquares.length, inModifier);
            break;
        case ALUIVisualFeedbackAnimation.ALUIVisualFeedbackAnimationTraverseMulti:
            alphaModifier = mod_sinus(lsquares.length, inModifier);
            break;
        case ALUIVisualFeedbackAnimation.ALUIVisualFeedbackAnimationKitt:
            alphaModifier = mod_traverseKitt(lsquares.length, inModifier);
            break;
        case ALUIVisualFeedbackAnimation.ALUIVisualFeedbackAnimationBlink:
            alphaModifier = mod_blink(lsquares.length, inModifier);
            break;

        case ALUIVisualFeedbackAnimation.ALUIVisualFeedbackAnimationPulse:
            alphaModifier = mod_pulse(lsquares.length, inModifier);
            break;
        case ALUIVisualFeedbackAnimation.ALUIVisualFeedbackAnimationResize:
            sizeModifierY = mod_sinus(lsquares.length, inModifier);
            alphaModifier = mod_sinus(lsquares.length, inModifier);

            var sizeModifierY = sizeModifierY.map(function (element) {
                return (element + 1) * 1.5;
            });

            alphaModifier = alphaModifier.map(function (element) {
                return element * 2.2;
            });
            break;
        case ALUIVisualFeedbackAnimation.ALUIVisualFeedbackAnimationPulseRandom:
            alphaModifier = mod_random(lsquares.length, inModifier);
            sizeModifierY = alphaModifier;
            break;
        default:
            return;
            break;
    }


    inModifier.alphaModifier = alphaModifier;
    inModifier.sizeModifierX = sizeModifierX;
    inModifier.sizeModifierY = sizeModifierY;

    for (var e in lsquares) {
        var elmnt = lsquares[e];
        elmnt.strokeColor.alpha = inModifier.alphaModifier[e];
        elmnt.scalex = inModifier.sizeModifierX[e];
        elmnt.scaley = inModifier.sizeModifierY[e];
    }
}


function mod_traverseKitt(n, inModifier) {

    var modifier = [];

    for (var i = 0; i < n; i++) {
        modifier[i] = 0
    }

    if (inModifier.dir == 1) {
        modifier[0] = 0.5;
        modifier[1] = 1;
    } else {
        modifier[n - 1] = 1;
        modifier[n] = 0.5;
    }

    modifier = modifier.concat(modifier.splice(0, n - inModifier.index));
    inModifier.index = inModifier.index + inModifier.dir;

    if (inModifier.index == n - 1) {
        inModifier.dir = -1;
    }

    if (inModifier.index == 0) {
        inModifier.dir = 1;
    }

    return modifier;
}

function mod_blink(n, inModifier) {
    var modifier = [];

    for (var i = 0; i < n; i++) {
        modifier[i] = inModifier.index / (n + 1);
    }

    inModifier.index = inModifier.index + inModifier.dir;
    if (inModifier.index == 0) {
        inModifier.dir = 1;
    }
    if (inModifier.index == n) {
        inModifier.dir = -1;
    }
    return modifier;
}

function mod_pulse(n, inModifier) {
    var modifier = [];

    for (var i = 0; i < n; i++) {
        if (inModifier.index % 6 === 0) {
            modifier[i] = 1;
        } else {
            modifier[i] = 0;
        }
    }

    inModifier.index = inModifier.index + inModifier.dir;
    return modifier;
}

function mod_random(n, inModifier) {
    var modifier = [];

    for (var i = 0; i < n; i++) {
        modifier[i] = Math.random();
    }

    inModifier.index = inModifier.index + inModifier.dir;
    if (inModifier.index >= n) {
        inModifier.index = 0;
    }
    return modifier;
}


function mod_resize(n, inModifier) {
    var modifier = [];
    var step = 32 / n;
    var idx = 0;
    for (var i = 16; i < 48; i = i + step) {
        var x = Math.abs(Math.sin(i / 10));
        modifier[idx] = 1 - x;
        idx = idx + 1;
    }
    modifier = modifier.concat(modifier.splice(0, n - inModifier.index));
    inModifier.index = inModifier.index + 1;
    if (inModifier.index >= n) {
        inModifier.index = 0;
    }
    return modifier;
}

function mod_sinus(n, inModifier) {
    var modifier = [];
    var step = 32 / n;
    var idx = 0;
    for (var i = 16; i < 48; i = i + step) {
        var x = Math.abs(Math.sin(i / 10));
        modifier[idx] = 1 - x;
        idx = idx + 1;
    }
    modifier = modifier.concat(modifier.splice(0, n - inModifier.index));
    inModifier.index = inModifier.index + 1;
    if (inModifier.index >= n) {
        inModifier.index = 0;
    }
    return modifier;
}

function mod_traverseSingle(n, inModifier) {
    var modifier = [];

    for (var i = 0; i < n; i++) {
        modifier[i] = 0
    }

    modifier[0] = 1;
    modifier = modifier.concat(modifier.splice(0, n - inModifier.index));
    inModifier.index = inModifier.index + 1;
    if (inModifier.index >= n) {
        inModifier.index = 0;
    }
    return modifier;
}

function drawRectOverlay(config, points) {

    if (typeof points == 'undefined') {
        return;
    }
    var sq = points;
    for (var i = 0; i < points.length; i++) {
        var sq = points[i];
        // drawPolygon(config, sq.x(), sq.y());
    }
}

function drawContourRectOverlay(config, lsquares) {
    if (typeof lsquares == 'undefined') {
        return;
    }
    for (var i = 0; i < lsquares.length; i++) {
        var sq = lsquares[i];
        roundRect(config, sq.x(), sq.y(), sq.w(), sq.h());
    }
}

function roundedPath(config, points) {
    var context = document.getElementById('anylineCanvas').getContext("2d");
    var radius = config.visualFeedbackCornerRadius;
    if (typeof points == 'undefined') {
        return;
    }
    context.beginPath();


    //compute the middle of the first line as start-stop-point:
    var deltaY = (points[1].y() - points[0].y());
    var deltaX = (points[1].x() - points[0].x());
    var xPerY = deltaY / deltaX;
    var startX = points[0].x() + deltaX / 2;
    var startY = points[0].y() + xPerY * deltaX / 2;

    //walk around using arcTo:
    context.moveTo(startX, startY);
    var x1, y1, x2, y2;
    x2 = points[1].x();
    y2 = points[1].y();

    for (var i = 2; i < points.length; i++) {
        x1 = x2;
        y1 = y2;
        x2 = points[i].x();
        y2 = points[i].y();
        context.arcTo(x1, y1, x2, y2, radius);
    }

    //finally, close the path:
    context.lineWidth = Math.floor(config.visualFeedbackStrokeWidth);
    context.arcTo(x2, y2, points[0].x(), points[0].y(), radius);
    context.arcTo(points[0].x(), points[0].y(), startX, startY, radius);
    context.closePath();

    context.fillStyle = getColorFromHexString(config.visualFeedbackFillColor);
    context.fill();
    context.strokeStyle = getColorFromHexString(config.visualFeedbackStrokeColor);
    context.stroke();
}

function drawPolygon(config, points) {
    var context = document.getElementById('anylineCanvas').getContext("2d");
    var radius = config.visualFeedbackCornerRadius;

    if (typeof points == 'undefined') {
        return;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    context.beginPath();

    context.lineWidth = Math.floor(config.visualFeedbackStrokeWidth);
    context.moveTo(points[0].x(), points[0].y());
    //
    //    context.moveTo(points[0].x() + radius.tl, points[0].y());
    //    context.lineTo(points[0].x() - radius.tr, points[0].y());
    //    context.quadraticCurveTo(points[0].x(), points[0].y(), points[0].x(), points[0].y() + radius.tr);
    //    context.lineTo(points[1].x(), points[1].y() - radius.br);
    //    context.quadraticCurveTo(points[1].x(), points[1].y(), points[1].x() - radius.br, points[1].y());
    //    context.lineTo(points[2].x() + radius.bl, points[2].y());
    //    context.quadraticCurveTo(points[2].x(), points[2].y(), points[2].x(), points[2].y() - radius.bl);
    //    context.lineTo(points[3].x(), points[3].y() + radius.tl);
    //    context.quadraticCurveTo(points[3].x(), points[3].y(), points[3].x() + radius.tl, points[3].y());
    for (var i = 1; i < points.length; i++) {
        var sq = points[i];
        context.lineTo(sq.x(), sq.y());
        //context.quadraticCurveTo(sq.x(), sq.y(), sq.x() + radius.tl, sq.y());
    }

    context.closePath();
    context.fillStyle = getColorFromHexString(config.visualFeedbackFillColor);
    context.fill();
    context.strokeStyle = getColorFromHexString(config.visualFeedbackStrokeColor);
    context.stroke();
}

function drawContourPointOverlay(config, lsquares) {
    if (typeof lsquares == 'undefined') {
        return;
    }
    for (var i = 0; i < lsquares.length; i++) {
        var sq = lsquares[i];
        var radius = Math.floor(config.visualFeedbackStrokeWidth);
        radius = radius * sq.scaley;
        var color = sq.strokeColor;
        drawCircle(config, sq.x() + sq.w() / 2, sq.y() + sq.h() + radius, radius, color.getColor());
    }
}

function drawContourUnderlineOverlay(config, lsquares) {
    if (typeof lsquares == 'undefined') {
        return;
    }

    for (var i = 0; i < lsquares.length; i++) {
        var sq = lsquares[i];
        var stroke = Math.floor(config.visualFeedbackStrokeWidth);
        stroke = stroke * sq.scaley;
        var color = sq.strokeColor;
        drawLine(
            config,
            sq.x(),
            sq.y() + sq.h() + stroke,
            sq.x() + sq.w(),
            sq.y() + sq.h() + stroke,
            stroke,
            color.getColor()
        );
    }
}

function drawLine(config, x1, y1, x2, y2, stroke, color) {
    var context = document.getElementById('anylineCanvas').getContext("2d");
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = stroke;
    context.stroke();
}

function clearContext() {
    if (!document.getElementById('anylineCanvas') && typeof document.getElementById('anylineCanvas').getContext("2d") == 'undefined') {
        return;
    }
    var context = document.getElementById('anylineCanvas').getContext("2d");
    var can = document.getElementById("anylineCanvas");
    context.clearRect(0, 0, can.width, can.height);
}

function drawCircle(config, x, y, radius, color) {
    var context = document.getElementById('anylineCanvas').getContext("2d");
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
}

function resizeCanvas(x, y) {
    const visualFeedbackCan = document.getElementById("anylineCanvas");

    visualFeedbackCan.width = x;
    visualFeedbackCan.height = y;

}

function roundRect(config, x, y, width, height) {
    var context = document.getElementById('anylineCanvas').getContext("2d");
    var radius = config.visualFeedbackCornerRadius;
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    context.beginPath();

    context.lineWidth = Math.floor(config.visualFeedbackStrokeWidth);
    context.moveTo(x + radius.tl, y);
    context.lineTo(x + width - radius.tr, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    context.lineTo(x + width, y + height - radius.br);
    context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    context.lineTo(x + radius.bl, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    context.lineTo(x, y + radius.tl);
    context.quadraticCurveTo(x, y, x + radius.tl, y);
    context.closePath();
    context.fillStyle = getColorFromHexString(config.visualFeedbackFillColor);
    context.fill();
    context.strokeStyle = getColorFromHexString(config.visualFeedbackStrokeColor);
    context.stroke();
}



function drawOverlayWithConfig(config, offset, modif) {
    var squares = [];
    for (var i = 0; i < 10; i++) {
        var de = new ALDrawnElement(
            50 + (i * 40),
            50 + offset,
            30,
            30,
            config.visualFeedbackStrokeColor,
            config.visualFeedbackFillColor
        );
        squares.push(de);
    }


    drawOverlayIntern(config, new ALSquareInput(squares, [10, 10, 300, 30], points), modif, false);

}

function updateFramesTest() {
    clearContext();

    drawOverlayWithConfig({
        "visualFeedbackCornerRadius": 10,
        "visualFeedbackStrokeColor": "#ff0000ff",
        "visualFeedbackFillColor": "#0000ffff",
        "visualFeedbackStrokeWidth": 3,
        "feedbackStyle": 2,
        "visualFeedbackAnimation": 0,
    }, 50, gmodifs[0]);
    drawOverlayWithConfig({
        "visualFeedbackCornerRadius": 10,
        "visualFeedbackStrokeColor": "#ff0000ff",
        "visualFeedbackFillColor": "#0000ffff",
        "visualFeedbackStrokeWidth": 3,
        "feedbackStyle": 2,
        "visualFeedbackAnimation": 1,
    }, 100, gmodifs[1]);
    drawOverlayWithConfig({
        "visualFeedbackCornerRadius": 10,
        "visualFeedbackStrokeColor": "#ff0000ff",
        "visualFeedbackFillColor": "#0000ffff",
        "visualFeedbackStrokeWidth": 3,
        "feedbackStyle": 3,
        "visualFeedbackAnimation": 2,
    }, 150, gmodifs[2]);
    drawOverlayWithConfig({
        "visualFeedbackCornerRadius": 10,
        "visualFeedbackStrokeColor": "#ff0000ff",
        "visualFeedbackFillColor": "#0000ffff",
        "visualFeedbackStrokeWidth": 3,
        "feedbackStyle": 3,
        "visualFeedbackAnimation": 3,
    }, 200, gmodifs[3]);
    drawOverlayWithConfig({
        "visualFeedbackCornerRadius": 10,
        "visualFeedbackStrokeColor": "#ff0000ff",
        "visualFeedbackFillColor": "#0000ffff",
        "visualFeedbackStrokeWidth": 3,
        "feedbackStyle": 3,
        "visualFeedbackAnimation": 5,
    }, 250, gmodifs[4]);
    drawOverlayWithConfig({
        "visualFeedbackCornerRadius": 10,
        "visualFeedbackStrokeColor": "#ff0000ff",
        "visualFeedbackFillColor": "#0000ffff",
        "visualFeedbackStrokeWidth": 3,
        "feedbackStyle": 3,
        "visualFeedbackAnimation": 4,
    }, 300, gmodifs[5]);
}

function updateFrames() {
    al_drawOverlay();
}

function testAppSetup() {
    al_loadConfig({
        "visualFeedbackStrokeWidth": 6,
        "visualFeedbackRedrawTimeout": 75,
        "visualFeedbackStrokeColor": "#110099FF",
        "visualFeedbackAnimationDuration": 0,
        "feedbackStyle": 0,
        "cornerRadius": 4,
        "visualFeedbackFillColor": "#110099FF",
        "visualFeedbackCornerRadius": 20
    });

    al_polygon([[635.40466, 895.5203], [659.7297, 895.5203], [659.7297, 936.5687], [635.40466, 936.5687]]);

    //  al_polygon([[137,9], [358,2], [358,43], [158,40]]);
    //al_loadSquares([[100,200,300,100]]);
}


// ***** PUBLIC API
var fromAppDebug = false;
var fromAppRunning = true;
var fromAppConfig = undefined;
var fromAppSquares = undefined;
var fromAppTextRect = undefined;
var fromAppPoints = undefined;
var globalModifier = new ALModifier();

function al_drawOverlay() {
    if (fromAppRunning == false) {
        clearContext();
        return;
    }
    drawOverlayIntern(fromAppConfig, new ALSquareInput(fromAppSquares, fromAppTextRect, fromAppPoints), globalModifier, true);
}

function al_cancelFeedback() {
    fromAppRunning = false;
}

function al_loadSquares(squares) {
    var sqarr = [];
    for (var i in squares) {
        const sq = squares[i];
        var de = new ALDrawnElement(sq[0], sq[1], sq[2], sq[3],
            fromAppConfig.visualFeedbackStrokeColor,
            fromAppConfig.visualFeedbackFillColor
        );
        sqarr.push(de);
    }
    fromAppSquares = sqarr;
}

function al_polygon(points) {
    var pnt = [];
    for (var i in points) {
        const sq = points[i];
        var de = new ALDrawnPoint(sq[0], sq[1],
            fromAppConfig.visualFeedbackStrokeColor,
            fromAppConfig.visualFeedbackFillColor
        );
        pnt.push(de);
    }
    fromAppPoints = pnt;
}

function al_loadTextRect(textRect) {
    var a = [];
    var de = new ALDrawnElement(textRect[0], textRect[1], textRect[2], textRect[3],
        fromAppConfig.visualFeedbackStrokeColor,
        fromAppConfig.visualFeedbackFillColor
    );
    a.push(de);
    fromAppTextRect = a;
}

function al_loadConfig(config) {
    fromAppConfig = config;
}

function al_debugView(debug) {
    fromAppDebug = debug;
}

function al_resizeCanvas(x, y) {
    resizeCanvas(x, y);
}

function clearVF() {
    fromAppSquares = undefined;
    fromAppTextRect = undefined;
    fromAppPoints = undefined;
    clearContext();
}
