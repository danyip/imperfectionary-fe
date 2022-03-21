import React from 'react'
import DrawingCanvas from './DrawingCanvas';
import Instructions from './Instructions';

import "../stylesheets/Home.css";

function Home() {

  return (
    <div className='home-wrapper'>
      <div>
      <h1>Practice Canvas</h1>
      <p>Use this canvas to learn and practice your skills.</p>
      <p>When you're ready to play with friends login and head to the lobby.</p>
      </div>
      <DrawingCanvas/>
      <Instructions/>
    </div>
  )
}

export default Home   
