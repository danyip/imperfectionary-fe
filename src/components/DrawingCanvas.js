import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import Webcam from "react-webcam";

import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

import { drawHand } from "../utils";
import { GestureEstimator } from "fingerpose";
import { FistGesture, OpenGesture } from "../gestures";

import "../stylesheets/DrawingCanvas.css";

let markerPos = []

function DrawingCanvas() {
  const canvas = useRef(null);
  const webcamRef = useRef(null);
  const webcamCanvasRef = useRef(null);
  const marker = useRef(null)
  const socket = io.connect("http://localhost:9090");

  // const [drawing, setDrawing] = useState(true);
  // const [markerPos, setMarkerPos] = useState([0,0])

  let drawing = false
  
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
    ctx.canvas.width = 800;
    ctx.canvas.height = 600;
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
    console.log(marker.current);
    marker.current.style.backgroundColor = `green`
    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();
  };

  const stopDraw = () => {
    console.log("mouse up: stop drawing");
    // setDrawing(false);
    drawing = false
    marker.current.style.backgroundColor = `red`
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

    // socket.emit("canvas-data", canvas.current.toDataURL("image/png"));
  };

  const handDraw = (x, y) => {

    if (!drawing) return;

    const xPos = x  //TODO: may need to account for scroll position here
    const yPos = y //TODO: may need to account for scroll position here

    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);

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

      const context = canvas.current.getContext("2d");
      // const videoWidth = webcamRef.current.video.videoWidth;
      // const videoHeight = webcamRef.current.video.videoHeight;

      const videoWidth = context.canvas.width * 0.3;
      const videoHeight = context.canvas.height * 0.3;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas size to match the video
      webcamCanvasRef.current.width = videoWidth;
      webcamCanvasRef.current.height = videoHeight;

      // Make detections
      const hand = await net.estimateHands(video, {flipHorizontal: true});

      // Draw mesh
      const ctx = webcamCanvasRef.current.getContext("2d");

      drawHand(hand, ctx);
      // drawHand(hand, canvas.current.getContext('2d'));

      
      if (hand.length > 0) {
        handDraw(hand[0].keypoints[9].x, hand[0].keypoints[9].y)
        markerPos = [
          (hand[0].keypoints[9].x + canvas.current.offsetLeft), 
          hand[0].keypoints[9].y + canvas.current.offsetTop
        ]

        marker.current.style.left = `${markerPos[0]}px`
        marker.current.style.top = `${markerPos[1]}px`
        
        const gestureEstimations = gestureEstimator.estimate(
          mapForFingerpose(hand),
          9.8
        );
        const  gesture = gestureEstimations.gestures[0];
        
        if (gesture && gesture.name === 'open' && !drawing){
          console.log('open');
          startDraw()
          
        } else if (gesture && gesture.name === 'fist'){
          console.log('fist');
          stopDraw()
        }
      }
    }
  };

  const mapForFingerpose = (hand)=>{
    const keypointsArr = hand[0].keypoints3D
    return keypointsArr.map(point=>{
      return [point.x, point.y, point.z]
    })
  }

  return (
    <div className="draw-container">
      <div className="marker" ref={marker}/>
      <div>
      <canvas
        className="canvas"
        ref={canvas}
        onMouseMove={draw}
        onMouseDown={startDraw}
        onMouseUp={stopDraw}
        // onMouseDown={clearCanvas}
      />
        <Webcam
        className="webcam"
          ref={webcamRef}
          muted={true}
        />
        <canvas
          className="webcamCanvas"
          ref={webcamCanvasRef}
        />
      </div>
    </div>
  );
}

export default DrawingCanvas;
