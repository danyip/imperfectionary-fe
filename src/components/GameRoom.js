import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";
import DrawingCanvas from "./DrawingCanvas";
import GuessingCanvas from "./GuessingCanvas";
import Participants from "./Participants";
import "../stylesheets/GameRoom.css";

function GameRoom() {
  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [word, setWord] = useState('')

  // const [gameStarted, setGameStarted] = useState(false);

  const [drawing, setDrawing] = useState(false);

  const navigate = useNavigate();

  const socket = useSelector((state) => state.socket);
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (!socket) {
      navigate("/lobby");
      return;
    }

    socket.emit("enter-game-room", (gameObj, roomName) => {
      if (!gameObj) {
        navigate("/lobby");
      }
      setPlayers(gameObj.players);
      setRoom(roomName);
      if (gameObj.drawPlayer === currentUser.username) {
        setDrawing(true);
        setWord(gameObj.word)
      }else{
        const secretWord = gameObj.word.split('').map(char => char === ' ' ? char : '_ ' )
        setWord(secretWord)
      }
      
    });

    socket.on("update-player-list", updatePlayerList);
    socket.on("message-data", handleMessageData);
    // socket.on("start-game", handleStartGame);
    socket.on("correct-guess", handleCorrectGuess);
    socket.on("next-round", handleNextRound)
    
    return () => {
      socket.removeListener("message-data", handleMessageData);
      socket.removeListener("update-player-list", updatePlayerList);
      // socket.removeListener("start-game", handleStartGame);
      socket.removeListener("correct-guess", handleCorrectGuess);
      socket.removeListener("next-round", handleNextRound)
    };
  }, []);

  const handleMessageData = (message) => {
    setMessages((prevState) => {
      return [...prevState, message];
    });
  };

  const updatePlayerList = (playerArray) => {
    setPlayers(playerArray);
  };


  const sendMessage = () => {
    if (messageText.length === 0) return;

    const messageObj = {
      text: messageText,
      user: currentUser.username,
    };

    socket.emit("new-message", messageObj);

    setMessages([...messages, messageObj]);

    setMessageText("");
  };

  const handleCorrectGuess = (name, word)=>{
    console.log(`Correct guess by ${name} with ${word}`);
    setWord(`Correct guess by ${name} with ${word}. The next round will begin shortly.`)
  }

  const handleNextRound = (gameObj)=>{
    console.log('Triggering next round', gameObj);
    
      if (gameObj.drawPlayer === currentUser.username) {
        setDrawing(true);
        setWord(gameObj.word)
      }else{
        const secretWord = gameObj.word.split('').map(char => char === ' ' ? char : '_ ' )
        setDrawing(false);
        setWord(secretWord)
      }
  }

  return (
    <div className="game-room-wrapper" >
      <h1 className="secret-word" >{word}</h1>

      <div className="game-grid-wrapper">
        {drawing? <DrawingCanvas /> : <GuessingCanvas />}
        
        <div className="participants-chat-wrapper">
          <Participants room={room} players={players} />
          <ChatBox
            setMessageText={setMessageText}
            messageText={messageText}
            sendMessage={sendMessage}
            messages={messages}
          />
        </div>
      </div>

    </div>
  );
}

export default GameRoom;
