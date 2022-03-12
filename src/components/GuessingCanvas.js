import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import "../stylesheets/DrawingCanvas.css";

function DrawingCanvas() {

  const canvas = useRef();
  const socket = io.connect('http://localhost:9090')
  
  socket.on('canvas-data', (data)=>{
    console.log('receiving canvas-data from socket');
    if(!canvas.current) return // TODO: Check with Luke about this...
    const image = new Image();
    const ctx = canvas.current.getContext('2d');
    image.onload = ()=>{
      ctx.drawImage(image, 0, 0)
    };
    image.src = data;
  })
  
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

export default DrawingCanvas;