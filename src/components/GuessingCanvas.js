import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
import { useSelector } from "react-redux";

import "../stylesheets/DrawingCanvas.css";

function GuessingCanvas() {

  const canvas = useRef();

  const socket = useSelector((state) => state.socket);

  useEffect(() => {

    socket.on('canvas-data', handleCanvasData)
    socket.on('clear', handleClear)
    
    return () => {
      socket.removeListener('canvas-data', handleCanvasData)
      socket.removeListener('clear', handleClear)
    }
  }, [])
  
  const handleClear = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }

  const handleCanvasData = (data)=>{
    console.log('receiving canvas-data from socket');
    if(!canvas.current) return 
    
    const image = new Image();
    const ctx = canvas.current.getContext('2d');
    image.onload = ()=>{
      ctx.drawImage(image, 0, 0)
    };
    image.src = data;
  }
  
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
  }, []);

  return (
    <div>
      <canvas
        className="canvas"
        ref={canvas}
      >
      </canvas>
    </div>
  );
}

export default GuessingCanvas;