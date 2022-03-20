import React from 'react'
import "../stylesheets/DrawingPlayer.css"

function DrawingPlayer({drawPlayer}) {
  return (
    <div className='drawing-player-wrapper'>
      <h3>Drawing Player</h3>
      <h1>{drawPlayer}</h1>
    </div>
  )
}

export default DrawingPlayer