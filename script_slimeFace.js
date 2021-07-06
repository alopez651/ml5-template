let video;
let latestPrediction = null;
let modelIsLoading = true;
let slimeImage;


const FOREHEAD_POINT = 168;
const LIPSTICK_COLOR = "#FFFFFF";
const CENTER_POINTUPPER = 164;
const CENTER_POINTLOWER = 18;
// p5 function
function preload() {
  slimeImage = loadImage("assets/gu.png");
}
// p5 function
function setup() {
  bg = loadImage("assets/concrete.jpg");
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // ml5 function
  let facemesh = ml5.facemesh(video, () => {
    console.log("Model is ready!");
    modelIsLoading = false;
  });
  // ml5 function
  facemesh.on("predict", (results) => {
 
    latestPrediction = results[0];
  });
  video.hide();
}

// p5 function
function draw() {
  image(video, 0, 0, width, height);
  if (latestPrediction == null) return; // don't draw anything else
  // get forhead location
  let foreheadLocation = latestPrediction.scaledMesh[FOREHEAD_POINT];
  console.log(foreheadLocation);

  image(
    slimeImage,
    foreheadLocation[0] - 300,   //x
    foreheadLocation[1] - 300,   //y
    600,
    600
  );

  let eyeholeMask = createEyeholeMask();
 lipSound();

  let webcamCopy = video.get(); // get a new copy of the webcam image
  webcamCopy.mask(eyeholeMask); // apply the eyehole mask
  image(webcamCopy, 0, 0, width, height); // draw eye on top of the full face covering

  noStroke();
  fill(color(LIPSTICK_COLOR));
  drawUpperLip();
  drawLowerLip(); 
}

//Frog eyes
function createEyeholeMask() {
  let eyeholeMask = createGraphics(width, height); // draw into a "graphics" object instead of the canvas directly
  eyeholeMask.background("rgba(255,255,255,0)"); // transparent background (zero alpha)
  eyeholeMask.noStroke();

  // get the eyehole points from the facemesh
  let rightEyeUpper = latestPrediction.annotations.rightEyeUpper1;
  let rightEyeLower = [
    ...latestPrediction.annotations.rightEyeLower1,
  ].reverse(); /* note that we have to reverse one of the arrays so that the shape draws properly */
  
  let leftEyeUpper = latestPrediction.annotations.leftEyeUpper1;
  let leftEyeLower = [
    ...latestPrediction.annotations.leftEyeLower1,
  ].reverse();
  
  // draw the actual shape
  eyeholeMask.beginShape();
  // draw from left to right along the top of the eye
  rightEyeUpper.forEach((point) => {
    eyeholeMask.curveVertex(point[0], point[1]); 
  });
  // draw back from right to left along the bottom of the eye
  rightEyeLower.forEach((point) => {
    eyeholeMask.curveVertex(point[0], point[1]);
  });
  
  //left eye hole 
  leftEyeUpper.forEach((point) => {
    eyeholeMask.curveVertex(point[0], point[1]); 
  });
  //point error 
  leftEyeLower.forEach((point) => {
    eyeholeMask.curveVertex(point[0], point[1]);
  });

  eyeholeMask.endShape(CLOSE); 

  return eyeholeMask;
}
function drawUpperLip(){
 // get the points on the facemesh
 let lipsUpperOuter = latestPrediction.annotations.lipsUpperOuter;
 let lipsUpperInner = [
   ...latestPrediction.annotations.lipsUpperInner,
 ].reverse(); /* note that we have to reverse one of the arrays so that the shape draws properly */

 // draw the actual shape
 beginShape();
 // draw from left to right along the top of the upper lip
 lipsUpperOuter.forEach((point) => {
   curveVertex(point[0], point[1]); // using curveVertex for smooth lines
 });

 // draw back from right to left along the bottom of the upper lip
 lipsUpperInner.forEach((point) => {
   curveVertex(point[0], point[1]);
 });
 endShape(CLOSE); // CLOSE makes sure we join back to the beginning
}
function drawLowerLip() {
  // get the points on the facemesh
  let lipsLowerOuter = latestPrediction.annotations.lipsLowerOuter;
  let lipsLowerInner = [
    ...latestPrediction.annotations.lipsLowerInner,
  ].reverse(); /* note that we have to reverse one of the arrays so that the shape draws properly */

  // draw the actual shape
  beginShape();
  
  lipsLowerOuter.forEach((point) => {
    curveVertex(point[0], point[1]); // using curveVertex for smooth lines
  });
  lipsLowerInner.forEach((point) => {
    curveVertex(point[0], point[1]);
  });
  endShape(CLOSE);
}
//adding commit to git
//lip voice 
function lipSound(){
  if(drawUpperLip == CENTER_POINTUPPER){
    var audio= Audio("https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3");
    audio.play();
  }
  else {
    if(drawLowerLip == CENTER_POINTLOWER){
      var audio= Audio("https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3");
      audio.play();
  }
}
}