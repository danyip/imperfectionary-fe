import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
// import "@tensorflow/tfjs-backend-webgl";
import { drawHand } from "../utils";
import { GestureEstimator } from "fingerpose";
import { FistGesture, OpenGesture } from "../gestures";

import "../stylesheets/DrawingCanvas.css";

function DrawingCanvas() {
  const canvas = useRef();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const socket = io.connect("http://localhost:9090");

  // const [drawing, setDrawing] = useState(true);

  const drawing = true
  const gestureEstimator = new GestureEstimator([FistGesture, OpenGesture]);
  
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  
  const detectorConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
  modelType: 'full'
  };
  
  useEffect(() => {
    runHandpose();
  }, []);

  const resize = () => {
    const ctx = canvas.current.getContext("2d");
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;
    
    ctx.canvas.width = 640;
    ctx.canvas.height = 480;
    

  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [webcamRef]);

  const startDraw = () => {
    console.log("mouse down: start drawing");
    // setDrawing(true);
    drawing = true
    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();
  };

  const stopDraw = () => {
    console.log("mouse up: stop drawing");
    // setDrawing(false);
    drawing = false
    // const ctx = canvas.current.getContext("2d");
    // ctx.beginPath();
  };

  const clearCanvas = () =>{
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
  }

  const draw = (e) => {
    // console.log('draw', e);
    if (!drawing) return;

    const xPos = e.clientX - canvas.current.offsetLeft; //TODO: may need to account for scroll position here
    const yPos = e.clientY - canvas.current.offsetTop; //TODO: may need to account for scroll position here

    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    // console.log(canvas.current.toDataURL("image/png"));

    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);
    // console.log(xPos, yPos, canvas);

    socket.emit("canvas-data", canvas.current.toDataURL("image/png"));
  };

  const handDraw = (x, y) => {
    // console.log('draw', e);
    // console.log('handDraw()', drawing);

    if (!drawing) return;

    // console.log('handDraw()');
    // console.log(x);

    const xPos = (x - canvas.current.width) * -1  //TODO: may need to account for scroll position here
    const yPos = y //TODO: may need to account for scroll position here

    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    // console.log(canvas.current.toDataURL("image/png"));

    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);
    // console.log(xPos, yPos, canvas);

    socket.emit("canvas-data", canvas.current.toDataURL("image/png"));
  };

  const runHandpose = async () => {
    const net = await handPoseDetection.createDetector(model, detectorConfig);
    // console.log(net);
    // const netOld = await handpose.load();
    console.log("handpose loaded");

    setInterval(() => {
      detect(net);
    }, 16);
  };

  const detect = async (net) => {
    // Only run detections if webcam is up and running
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video properties from the webcam component
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      // console.log(videoWidth);

      // Set canvas size to match the video feed
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const hand = await net.estimateHands(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      drawHand(hand, ctx);

      if (hand.length > 0) {
        // console.log(hand[0].keypoints[9].x);
        // handDraw(hand[0].landmarks[9][0], hand[0].landmarks[9][1])
        handDraw(hand[0].keypoints[9].x, hand[0].keypoints[9].y)

        console.log(hand[0].keypoints);
        console.log(mapForFingerpose(hand));

      }
      
      
      // if (hand.length > 0) {
      //   // console.log(hand[0].landmarks[9][0]);
      //   const gestureEstimations = gestureEstimator.estimate(
      //     hand[0].landmarks,
      //     9.8
      //   );
      //   const  gesture = gestureEstimations.gestures[0];
        
      //   if (gesture && gesture.name === 'open' && !drawing){
      //     startDraw()
          
      //   } else if (gesture && gesture.name === 'fist'){
      //     stopDraw()
      //   }
      //   // console.log(gesture, gesture[0]);
      // }
    }
  };

  const mapForFingerpose = (hand)=>{
    const keypointsArr = hand[0].keypoints
    return keypointsArr.map(point=>{
      return [point.x, point.y]
    })
  }

  return (
    <div>
      <canvas
        className="canvas"
        ref={canvas}
        // onMouseMove={draw}
        // onMouseDown={startDraw}
        // onMouseUp={stopDraw}
        onMouseDown={clearCanvas}
        style={{
          // transform: "scaleX(-1)",
        }}
      ></canvas>
      <div>
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            transform: "scaleX(-1)",
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            transform: "scaleX(-1)",
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
          }}
        />
      </div>
    </div>
  );
}

export default DrawingCanvas;
