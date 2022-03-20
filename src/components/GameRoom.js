import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";
import DrawingCanvas from "./DrawingCanvas";
import GuessingCanvas from "./GuessingCanvas";
import Participants from "./Participants";
import "../stylesheets/GameRoom.css";
import Instructions from "./Instructions";
import DrawingPlayer from "./DrawingPlayer";

function GameRoom() {
  const [players, setPlayers] = useState([]);
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [word, setWord] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [drawPlayer, setDrawPlayer] = useState("")

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
      setDrawPlayer(gameObj.drawPlayer)
      if (gameObj.drawPlayer === currentUser.username) {
        setDrawing(true);
        setWord(gameObj.word);
      } else {
        const secretWord = gameObj.word
          .split("")
          .map((char) => (char === " " ? "  " : "_ "));
        setWord(secretWord);
      }
    });

    socket.on("update-player-list", updatePlayerList);
    socket.on("message-data", handleMessageData);
    socket.on("correct-guess", handleCorrectGuess);
    socket.on("next-round", handleNextRound);

    return () => {
      socket.removeListener("message-data", handleMessageData);
      socket.removeListener("update-player-list", updatePlayerList);
      socket.removeListener("correct-guess", handleCorrectGuess);
      socket.removeListener("next-round", handleNextRound);
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

  const handleCorrectGuess = (name, word) => {
    console.log(`Correct guess by ${name} with ${word}`);
    setWord(
      `Correct guess by ${name} with ${word}. The next round will begin shortly.`
    );
  };

  const handleNextRound = (gameObj) => {
    console.log("Triggering next round", gameObj);
    setDrawPlayer(gameObj.drawPlayer)
    if (gameObj.drawPlayer === currentUser.username) {
      setDrawing(true);
      setWord(gameObj.word);
    } else {
      const secretWord = gameObj.word
        .split("")
        .map((char) => (char === " " ? char : "_ "));
      setDrawing(false);
      setWord(secretWord);
    }
  };

  return (
    <div className="game-room-wrapper">

      <div className="game-grid-wrapper">
      <DrawingPlayer drawPlayer={drawPlayer}/>
      <Participants room={room} players={players} />

      </div>
      
      <h1 className="secret-word">{word}</h1>

      <div className="game-grid-wrapper">
        {drawing ? <DrawingCanvas /> : <GuessingCanvas />}
        <ChatBox
          setMessageText={setMessageText}
          messageText={messageText}
          sendMessage={sendMessage}
          messages={messages}
        />
      </div>
      {drawing && <Instructions/>}
    </div>
  );
}

export default GameRoom;
