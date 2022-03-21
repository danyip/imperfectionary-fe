import React, { useEffect, useRef} from "react";
import Webcam from "react-webcam";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { useSelector } from "react-redux";

import { mapForFingerpose } from "../lib/mapForFingerpose";
import { drawHandKeypoints } from "../lib/drawHandKeypoints";
import { GestureEstimator } from "fingerpose";
import { FistGesture, OpenGesture } from "../lib/gestures";
import "../stylesheets/DrawingCanvas.css";


function DrawingCanvas() {
  const canvas = useRef(null);
  const webcamRef = useRef(null);
  const webcamCanvasRef = useRef(null);
   const marker = useRef(null);

  const socket = useSelector((state) => state.socket);

  let drawing = false;
  let drawHue = 0;
  let drawLightness = "0%";
  let lineWidth = 5;

  // Make a gesture estimator and give it the gesture definitions
  const gestureEstimator = new GestureEstimator([FistGesture, OpenGesture]);

  // Grab the tensorflow model
  const model = handPoseDetection.SupportedModels.MediaPipeHands;

  // Define the detector config
  const detectorConfig = {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
    modelType: "full",
  };

  // Component did mount
  useEffect(() => {
    runHandpose();
    const ctx = canvas.current.getContext("2d");
    ctx.canvas.width = 640;
    ctx.canvas.height = 480;
    document.addEventListener('keydown', clearCanvas)

    return ()=>{document.removeEventListener('keydown', clearCanvas)}

  }, []);

  // Create handpose detector (this is to detect hands)
  const runHandpose = async () => {
    const handpose = await handPoseDetection.createDetector(
      model,
      detectorConfig
    );
    console.log("handpose loaded");
    
    // Trigger detectHands with the handpose detector every 16ms (approx 60fps)
    setInterval(() => {
      detectHands(handpose);
    }, 16);
  };

  // Deals with the detections made by the tensorflow model
  const detectHands = async (handpose) => {
    // Only run detections if webcam is up and running
    if (
      typeof webcamRef.current === "undefined" ||
      webcamRef.current === null ||
      webcamRef.current.video.readyState !== 4
    ) {
      return;
    }

    // Get Video properties from the webcam component
    const video = webcamRef.current.video;

    // Set canvas size to match the video
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    webcamCanvasRef.current.width = videoWidth;
    webcamCanvasRef.current.height = videoHeight;

    // Make detections
    const hands = await handpose.estimateHands(video, { flipHorizontal: true });

    // Draw keypoints
    const ctx = webcamCanvasRef.current.getContext("2d");
    drawHandKeypoints(hands, ctx);

    // Pull out each hand
    const rightHand = hands.find((handObj) => handObj.handedness === "Right");
    const leftHand = hands.find((handObj) => handObj.handedness === "Left");

    // Pass on the hands if they exist
    if (rightHand) {
      processRightHand(rightHand);
    }

    if (leftHand) {
      processLeftHand(leftHand);
    }
  };

  // Handle right hand detection data
  const processRightHand = (rightHand) => {

    // If the confidence score is too low, exit early
    if (rightHand.score < 0.93) return;

    // grab the coordinates of the hand in the video frame (keypoint of base middle finger)
    const xPos = rightHand.keypoints[9].x;
    const yPos = rightHand.keypoints[9].y;

    // pass these coordinates off to draw
    handDraw(xPos, yPos);

    // move the marker positin on the canvas to match
    marker.current.style.left = `${xPos}px`;
    marker.current.style.top = `${yPos}px`;

    // Run a gesture estimation on the right hand
    const rightHandGesture = gestureEstimator.estimate(
      mapForFingerpose(rightHand),
      8.5
    );

    // Grab the string name of the gesture
    const gesture = rightHandGesture.gestures[0];

    if (gesture && gesture.name === "open" && !drawing) {      
      startDraw();
    } else if (gesture && gesture.name === "fist") {
      stopDraw();
    }
  };

  // Handle left hand detection data
  const processLeftHand = (leftHand) => {
    // If the confidence score is too low, exit early
    if (leftHand.score < 0.93) return;

    // grab the X coordinate of the hand in the video frame (keypoint of base middle finger)
    const xPos = leftHand.keypoints[9].x;

    // Run a gesture estimation on the left hand
    const leftHandGesture = gestureEstimator.estimate(
      mapForFingerpose(leftHand),
      8.5
    );

    // Grab the string name of the gesture
    const gesture = leftHandGesture.gestures[0];

    if (gesture && gesture.name === "open") {
      
      if (xPos < 140) { // 0 - 140px results in BLACK
        drawLightness = "0%";
        marker.current.style.width = `10px`;
        marker.current.style.height = `10px`;
        marker.current.style.transform = 'translate(-5px, -5px)'
        lineWidth = 5;

      } else if (xPos < 500) { // 140 - 500 is mapped to hue
        drawLightness = "50%";
        drawHue = xPos - 140;
        lineWidth = 5;
        marker.current.style.width = `10px`;
        marker.current.style.height = `10px`;
        marker.current.style.transform = 'translate(-5px, -5px)'
      
      } else { // 500 - 640 results in WHITE and a larger size 
      
        drawLightness = "100%";
        lineWidth = 30;
        marker.current.style.width = `30px`;
        marker.current.style.height = `30px`;
        marker.current.style.transform = 'translate(-15px, -15px)'
      }

      // sets the border on the marker to match the selected color
      marker.current.style.borderColor = `hsl(${drawHue}, 100%, ${drawLightness})`;
    } 
  };

  // Triggered by mouse down or a RH open palm
  const startDraw = () => {
    drawing = true;
    
    // Set the fill colour of the marker
    marker.current.style.backgroundColor = `hsl(${drawHue}, 100%, ${drawLightness})`;

    // This make sure to start a new line insead of continuing an old line
    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();
  };

  // Triggered by mouse up of a RH fist
  const stopDraw = () => {
    drawing = false;

    // set the markers background to nil
    marker.current.style.backgroundColor = ``;
  };

  // Clears the canvas and tells other sockets in the room to do the same
  const clearCanvas = (e) => {
    // Exit early if not space
    if (e.code !== 'Space') return 

    // prevent space from auto scrolling the page
    e.preventDefault()

    // clear the canvas
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    // if there is a socket connection, tell the other sockets in the room to clear aswell
    if (socket) {
      socket.emit("clear-canvas");
    }
  };

  // Handle mouse drawing events
  const mouseDraw = (e) => {
    // Only run if we are drawing
    if (!drawing) return; 
    
    // Grab the mouse position and map it to the canvas size
    const xPos = e.clientX - canvas.current.offsetParent.offsetLeft; 
    const yPos = e.clientY - canvas.current.offsetParent.offsetTop + e.view.scrollY;
    
    // draw the line
    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);

    // If there is a socket connection send the canvas as base64 (ASCII string format) 
    if (socket) {
      socket.emit("canvas-data", canvas.current.toDataURL("image/png"));
    }
    
  };

  // Handle hand tracked drawing
  const handDraw = (xPos, yPos) => {
    // Only run if we are drawing
    if (!drawing) return;

    // set the marker background colour to the color we are drawing with
    marker.current.style.backgroundColor = `hsl(${drawHue}, 100%, ${drawLightness})`;
   
    // draw the line
    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = `hsl(${drawHue}, 100%, ${drawLightness})`;

    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);

    // If there is a socket connection send the canvas as base64 (ASCII string format) 
    if(socket){
      socket.emit("canvas-data", canvas.current.toDataURL("image/png"));
    }
  };

  return (
    <div className="draw-container">
      <div className="marker" ref={marker} />
      <canvas
        className="canvas"
        ref={canvas}
        onMouseMove={mouseDraw}
        onMouseDown={startDraw}
        onMouseUp={stopDraw}
      />
      <Webcam className="webcam" ref={webcamRef} muted={true} />
      <canvas className="webcamCanvas" ref={webcamCanvasRef} />
    </div>
  );
}

export default DrawingCanvas;
