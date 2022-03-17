import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";

function GameRoom() {
  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  
  const navigate = useNavigate();

  const socket = useSelector((state) => state.socket);
  const currentUser = useSelector((state) => state.currentUser);


  useEffect(() => {

    if (!socket) {
      navigate('/lobby')
      return
    }

    socket.emit("enter-game-room", (playerArray, roomName) => {
      if (playerArray.length === 0) {
        navigate("/lobby");
      }
      setPlayers(playerArray);
      setRoom(roomName);
    });

    socket.on("update-player-list", updatePlayerList);

    socket.on("message-data", handleMessageData);

    return ()=> {
      socket.removeListener("message-data", handleMessageData);
      socket.removeListener("update-player-list", updatePlayerList);
    }
  
  }, [])

  const handleMessageData = (message) => {
      setMessages( (prevState)=>{
        return [...prevState, message]
      })
  }

  const updatePlayerList = (playerArray) =>{
    setPlayers(playerArray)
  }
  
  
  const sendMessage = () => {
    if (messageText.length === 0) return;

    const messageObj = {
      text: messageText,
      user: currentUser,
    };

    socket.emit("new-message", messageObj);

    setMessages([...messages, messageObj]);

    setMessageText("");
  };

  return (
    <div>
      <h1>{room}</h1>
      <div>
        <h2>Player list</h2>
        <ul>
          {players.map((player) => (
            <li key={player}>{player}</li>
          ))}
        </ul>
        <ChatBox
          setMessageText={setMessageText}
          messageText={messageText}
          sendMessage={sendMessage}
          messages={messages}
        />
      </div>
    </div>
  );
}

export default GameRoom;
