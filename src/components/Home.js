import React from 'react'
import DrawingCanvas from './DrawingCanvas';
import Instructions from './Instructions';

import "../stylesheets/Home.css";

function Home() {

  

  return (
    <div className='home-wrapper'>
      <h1>Practice Canvas</h1>
      <Instructions/>
      <DrawingCanvas/>
    </div>
  )
}

export default Home   