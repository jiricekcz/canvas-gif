"use strict";
var canvas = document.getElementById("gif-canvas");
var ctx = canvas.getContext("2d");
var states = new Set();
var state = { x: 128, y: 0, vx: 4, vy: 4 };
var objectWidth = 64;
var objectHeight = 64;
var objectURL = "../DVD_logo.svg.png";
var img = new Image();
img.src = objectURL;
function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, state.x, state.y, objectWidth, objectHeight);
}
function move() {
    state.x += state.vx;
    state.y += state.vy;
    if (state.x + objectWidth > canvas.width || state.x < 0) {
        state.vx *= -1;
    }
    if (state.y + objectHeight > canvas.height || state.y < 0) {
        state.vy *= -1;
    }
}
function frame() {
    if (states.has(getStateString()))
        return false;
    states.add(getStateString());
    move();
    draw();
    return true;
}
function getStateString() {
    return JSON.stringify(state);
}
function startRecording() {
    var chunks = []; // here we will store our recorded media chunks (Blobs)
    // @ts-ignore
    var stream = canvas.captureStream(); // grab our canvas MediaStream
    var rec = new MediaRecorder(stream); // init the recorder
    // every time the recorder has new data, we will store it in our array
    rec.ondataavailable = function (e) { return chunks.push(e.data); };
    // only when the recorder stops, we construct a complete Blob from all the chunks
    rec.onstop = function () { return exportVid(new Blob(chunks, { type: "video/webm" })); };
    rec.start();
    return rec;
}
function exportVid(blob) {
    var vid = document.createElement("video");
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    document.body.appendChild(vid);
}
var recoreder = startRecording();
var loop = setInterval(function () {
    if (!frame()) {
        recoreder.stop();
        clearInterval(loop);
    }
    console.log(getStateString());
}, 1000 / 60);
