import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as handpose from '@tensorflow-models/handpose'
import '@tensorflow/tfjs-backend-webgl';

function ImageDetection() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  
  const runHandpose = async ()=>{
    const net = await handpose.load()
    console.log('handpose loaded');

    setInterval(() => {
      detect(net)
    }, 1000);
  }

  runHandpose()

  const detect = async (net) => {
    // Only run detections if webcam is up and running
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width to match the video feed
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const hand = await net.estimateHands(video)
      console.log(hand);
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // drawHand(hand, ctx)  
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
  </div>
  )
}

export default ImageDetection;
