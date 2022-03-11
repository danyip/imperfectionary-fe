import React, { useEffect, useRef, useState } from "react";
import "../stylesheets/DrawingCanvas.css";

function DrawingCanvas() {
  const canvas = useRef();

  const [drawing, setDrawing] = useState(false);

  const resize = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  };

  const startDraw = (e) => {
    console.log("mouse down: start drawing", e);
    setDrawing(true);
    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();
  };

  const stopDraw = (e) => {
    console.log("mouse up: stop drawing");
    setDrawing(false);
  };

  const draw = (e) => {
    if (!drawing) return;

    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);

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
