import React from 'react'

function Participants({players, room}) {


  return (
    <div className='participants-wrapper' >
        <h2>Room: {room}</h2>
        <h4>Players List</h4>
        <ul>
          {players.map((player) => (
            <li key={player}>{player}</li>
          ))}
        </ul>
    </div>
  )
}

export default Participants