import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";


function GameRoom(props) {
  const [players, setPlayers] = useState([])
  const [room, setRoom] = useState('')
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const navigate = useNavigate()
  
  // const socket = useSelector((state) => state.socket);
  const socket = props.socket
  // const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    socket.emit('enter-game-room', (playerArray, roomName)=>{
      if (playerArray.length === 0) {
        navigate('/lobby')
      }
      setPlayers(playerArray)
      setRoom(roomName)
    })
  }, [])

  socket.on('update-player-list', (playerArray)=>{
    setPlayers(playerArray)
  })

  const sendMessage = ()=>{

    if (messageText.length === 0) return
    
    const messageObj = {
      text: messageText,
        user: 'currentUser'
    }

    socket.emit('new-message', messageObj)

    setMessages([...messages, messageObj])

    setMessageText('')

  }

  socket.on('message-data', (message)=>{
    console.log('reciveing message-data', message);
    setMessages([...messages, message])
  })
  
  return (
    <div>
      <h1>{room}</h1>
      <div>
        <h2>Player list</h2>
        <ul>
          {players.map(player=> <li key={player}>{player}</li> )}
        </ul>
        <ChatBox 
          setMessageText={setMessageText} 
          messageText={messageText}
          sendMessage={sendMessage}
          messages={messages} 
        />
      </div>

    </div>
  )
}

export default GameRoom