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
  
  const [drawing, setDrawing] = useState(false);

  const resize = () => {
    const ctx = canvas.current.getContext("2d");
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = 400;
    ctx.canvas.height = 300;
  };

  const startDraw = (e) => {
    console.log("mouse down: start drawing");
    setDrawing(true);
    
  };

  // TODO: figure out how to make this work to draw dots
  // useEffect((e) => {
  //   draw(e)
  // }, [drawing])
  

  const stopDraw = () => {
    console.log("mouse up: stop drawing");
    setDrawing(false);
    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();
  };

  const draw = (e) => {
    // console.log('draw', e);
    if (!drawing) return;

    const xPos = e.clientX - canvas.current.offsetLeft; //TODO: may need to account for scroll position here
    const yPos = e.clientY -canvas.current.offsetTop; //TODO: may need to account for scroll position here

    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    // console.log(canvas.current.toDataURL("image/png"));

    ctx.lineTo(xPos, yPos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xPos, yPos);
    // console.log(xPos, yPos, canvas);

    socket.emit("canvas-data", canvas.current.toDataURL("image/png"))
  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);


  return (
    <canvas
      className="canvas"
      ref={canvas}
      onMouseMove={draw}
      onMouseDown={startDraw}
      onMouseUp={stopDraw}
    ></canvas>
  );
}

export default DrawingCanvas;
