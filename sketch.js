/*
facial detection of baroque portraits
by steven taylor wood 

attempted to implement an image slideshow
however the faceapi is having some trouble reading the iages after the first one
seems to work somewhat but the outlines of the facial detection arent in line with the faces on the canvas...
...however this accident i believe creates an interesting output from an aritstic standpoint, despite it not working as intended.
I really like the sylistic qualities of the face sillouette over old paintings such as these..
..combining the old and the new
*/


let faceapi;
// let img;
let detections;

const NUM_IMGS = 5,
      imgs = [];
let currentImg = 0;

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload(){
    imgs[0] = loadImage('assets/1.jpeg')
    imgs[1] = loadImage('assets/2.jpg')
    imgs[2] = loadImage('assets/3.jpg')
    imgs[3] = loadImage('assets/4.jpg')
    imgs[4] = loadImage('assets/5.jpg')
}

function setup() {
    createCanvas(400, 400);

    //for (let i = 0; i < imgs.length; i++){
      imgs[currentImg].resize(width, height);
    //}

    faceapi = ml5.faceApi(detection_options, modelReady);
    textAlign(RIGHT);

    setupButtons();
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    //for (let i = 0; i < imgs.length; i++){
      faceapi.detectSingle(imgs[currentImg], gotResults)
    //}
}

function draw() {
    // background(220);
    background(255);
    // image(img, 0,0, width, height)
    image(imgs[currentImg],0, 0, width, height);
    if (detections) {
        // console.log(detections)
        drawBox(detections)
        drawLandmarks(detections)
    }
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;
}

function drawBox(detections){
    const alignedRect = detections.alignedRect;
    const {_x, _y, _width, _height} = alignedRect._box;
    noFill();
    stroke(161, 251, 91);
    strokeWeight(2)
    rect(_x, _y, _width, _height)
}

function drawLandmarks(detections){
    noFill();
    stroke(161, 251, 91);
    strokeWeight(2)
    
    push()
    // mouth
    beginShape();
    detections.parts.mouth.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // nose
    beginShape();
    detections.parts.nose.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // left eye
    beginShape();
    detections.parts.leftEye.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // right eye
    beginShape();
    detections.parts.rightEye.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // right eyebrow
    beginShape();
    detections.parts.rightEyeBrow.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape();

    // left eye
    beginShape();
    detections.parts.leftEyeBrow.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape();

    pop();
}

const setupButtons = _ => {
  previous = createButton('Prev');
  previous.position(width*0.5 - 100, height + 20);
  
  previous.mouseClicked(_ => {
    if (currentImg > 0) currentImg--;
    faceapi.detectSingle(imgs[currentImg], gotResults)
  });

  next = createButton('Next');
  next.position(width*0.5 + 100, height + 20);
  
  next.mouseClicked(_ => {
    if (currentImg < imgs.length - 1) currentImg++;
    faceapi.detectSingle(imgs[currentImg], gotResults)
    console.log(currentImg)
  });
};