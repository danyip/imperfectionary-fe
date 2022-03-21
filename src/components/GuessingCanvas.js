import React, { useEffect, useRef} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../stylesheets/DrawingCanvas.css";

function GuessingCanvas() {
  const navigate = useNavigate();
  const canvas = useRef();
  const socket = useSelector((state) => state.socket);

  useEffect(() => {
    // if there is no socket go to homepage
    if (!socket) {
      navigate("/");

    } else {
      
      // Set the canvas size
      const ctx = canvas.current.getContext("2d");
      ctx.canvas.width = 640;
      ctx.canvas.height = 480;

      // Setup socket handlers
      socket.on("canvas-data", handleCanvasData);
      socket.on("clear", handleClear);

      return () => {
        // Remove socket handlers on dismount
        socket.removeListener("canvas-data", handleCanvasData);
        socket.removeListener("clear", handleClear);
      };
    }
  }, []);

  // Clears the canvas
  const handleClear = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  };

  // Draws on the canvas using the supplied data
  const handleCanvasData = (data) => {
    // exit if there is no canvas
    if (!canvas.current) return;

    // draw an image with the data (base64 dataURL)
    const image = new Image();
    const ctx = canvas.current.getContext("2d");
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
    image.src = data;
  };

  return (
    <div className="draw-container ">
      <canvas className="canvas" ref={canvas}></canvas>
    </div>
  );
}

export default GuessingCanvas;
