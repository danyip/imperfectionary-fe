import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";


function GameRoom() {
  
  const socket = useSelector((state) => state.socket);

  useEffect(() => {
    socket.emit('enter-game-room', (arg)=>{
      console.log(arg);
    })
  }, [])
  
  return (
    <div>
      <h1>Game Room</h1>

    </div>
  )
}

export default GameRoom