import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import { drawHand } from "../utils";
import { GestureEstimator } from "fingerpose";
import { FistGesture } from "../gestures";



const gestureEstimator = new GestureEstimator([FistGesture]) 


function ImageDetection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("handpose loaded");

    setInterval(() => {
      detect(net);
    }, 16);
  };

  useEffect(() => {
    runHandpose();
  }, [])
  

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

      // Set canvas size to match the video feed
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const hand = await net.estimateHands(video);
      
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      drawHand(hand, ctx);

      // console.log(predictions);
      if (hand.length > 0) {
        console.log(hand);
        const gestureEstimations = gestureEstimator.estimate(
          hand[0].landmarks, 9.5
        )
        const gesture = gestureEstimations.gestures
        console.log(gesture, gesture[0]);
      }
    }
  };


  return (
    <div>
      <Webcam
        ref={webcamRef}
        muted={true}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 8,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          border: '1px solid green',
          zIndex: 10
        }}  
      >
      Drawing
      </div>
    </div>
  );
}

export default ImageDetection;
