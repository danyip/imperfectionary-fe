import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import Webcam from "react-webcam";

import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";

import { drawHandKeypoints } from "../lib/drawHandKeypoints";
import { GestureEstimator } from "fingerpose";
import { FistGesture, OpenGesture } from "../gestures";

import "../stylesheets/DrawingCanvas.css";
import { useSelector } from "react-redux";

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

  const gestureEstimator = new GestureEstimator([FistGesture, OpenGesture]);

  const model = handPoseDetection.SupportedModels.MediaPipeHands;

  const detectorConfig = {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
    modelType: "full",
  };

  useEffect(() => {
    runHandpose();
    const ctx = canvas.current.getContext("2d");
    ctx.canvas.width = 640;
    ctx.canvas.height = 480;
    document.addEventListener('keyup', clearCanvas)
  }, []);

  const startDraw = () => {
    drawing = true;
    marker.current.style.backgroundColor = `hsl(${drawHue}, 100%, ${drawLightness})`;

    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();
  };

  const stopDraw = () => {
    drawing = false;
    marker.current.style.backgroundColor = ``;
  };

  const clearCanvas = (e) => {
    if (e.code !== 'Space') return 
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    if (socket) {
      socket.emit("clear-canvas");
    }
  };

  const mouseDraw = (e) => {
    if (!drawing) return;
    
    const xPos = e.clientX - canvas.current.offsetParent.offsetLeft; 
    const yPos = e.clientY - canvas.current.offsetParent.offsetTop;
    
    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);

    if (socket) {
      socket.emit("canvas-data", canvas.current.toDataURL("image/png"));
    }
    
  };

  const handDraw = (xPos, yPos) => {
    if (!drawing) return;

    marker.current.style.backgroundColor = `hsl(${drawHue}, 100%, ${drawLightness})`;
    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = `hsl(${drawHue}, 100%, ${drawLightness})`;

    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);

    if(socket){
      socket.emit("canvas-data", canvas.current.toDataURL("image/png"));
    }
  };

  const runHandpose = async () => {
    const handpose = await handPoseDetection.createDetector(
      model,
      detectorConfig
    );
    console.log("handpose loaded");

    setInterval(() => {
      detectHands(handpose);
    }, 16);
  };

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

    const rightHand = hands.find((handObj) => handObj.handedness === "Right");
    const leftHand = hands.find((handObj) => handObj.handedness === "Left");

    if (rightHand) {
      processRightHand(rightHand);
    }

    if (leftHand) {
      processLeftHand(leftHand);
    }
  };

  const processRightHand = (rightHand) => {
    if (rightHand.score < 0.93) return;

    const xPos = rightHand.keypoints[9].x;
    const yPos = rightHand.keypoints[9].y;

    handDraw(xPos, yPos);

    marker.current.style.left = `${xPos}px`;
    marker.current.style.top = `${yPos}px`;

    const rightHandGesture = gestureEstimator.estimate(
      mapForFingerpose(rightHand),
      8.5
    );
    const gesture = rightHandGesture.gestures[0];

    if (gesture && gesture.name === "open" && !drawing) {
      // console.log("open");
      startDraw();
    } else if (gesture && gesture.name === "fist") {
      // console.log("fist");
      stopDraw();
    }
  };

  const processLeftHand = (leftHand) => {
    if (leftHand.score < 0.93) return;

    const xPos = leftHand.keypoints[9].x;
    const yPos = leftHand.keypoints[9].y;

    const leftHandGesture = gestureEstimator.estimate(
      mapForFingerpose(leftHand),
      8.5
    );
    const gesture = leftHandGesture.gestures[0];

    if (gesture && gesture.name === "open") {
      console.log("open");
      if (xPos < 140) {
        drawLightness = "0%";
        marker.current.style.width = `10px`;
        marker.current.style.height = `10px`;
        marker.current.style.transform = 'translate(-5px, -5px)'
        lineWidth = 5;
      } else if (xPos < 500) {
        drawLightness = "50%";
        drawHue = xPos - 140;
        lineWidth = 5;
        marker.current.style.width = `10px`;
        marker.current.style.height = `10px`;
        marker.current.style.transform = 'translate(-5px, -5px)'
      } else {
        drawLightness = "100%";
        lineWidth = 30;
        marker.current.style.width = `30px`;
        marker.current.style.height = `30px`;
        marker.current.style.transform = 'translate(-15px, -15px)'
      }

      marker.current.style.borderColor = `hsl(${drawHue}, 100%, ${drawLightness})`;
    } else if (gesture && gesture.name === "fist") {
      console.log("fist");
    }
  };

  const mapForFingerpose = (hand) => {
    const keypointsArr = hand.keypoints3D;
    return keypointsArr.map((point) => {
      return [point.x, point.y, point.z];
    });
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
