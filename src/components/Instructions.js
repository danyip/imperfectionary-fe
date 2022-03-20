import React from "react";
import "../stylesheets/Instructions.css";

function Instructions() {
  return (
    <div className="instructions-wrapper">
      <h2>How to draw with the webcam</h2>

      <div className="instructions-grid">
        <img
          src="/images/open-hand.svg"
          alt="right hand open palm"
          className="rhs-icon"
        />
        <p className="instruction-text" >Start drawing by showing the camera an open right hand. </p>
        <img
          src="/images/fist.svg"
          alt="right hand fist"
          className="rhs-icon"
        />
        <p className="instruction-text">Stop drawing by making a fist with your right hand.</p>
        <img
          src="/images/open-hand.svg"
          alt="left hand open palm"
          className="lhs-icon"
        />
        <p className="instruction-text">Change colours by showing your open left palm and moving from side to side.</p>
        <img
          src="/images/space.svg"
          alt="left hand open palm"
          className="space-icon"
        />
        <p className="instruction-text">Clear canvas with space bar.</p>
        <img
            src="/images/mouse.svg"
            alt="right hand open palm"
            className="rhs-icon"
          />
        <p className="instruction-text">You can also draw with the mouse, but only in black.</p>
      </div>

    </div>
  );
}

export default Instructions;
