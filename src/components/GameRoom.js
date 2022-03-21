import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ChatBox from "./ChatBox";
import DrawingCanvas from "./DrawingCanvas";
import GuessingCanvas from "./GuessingCanvas";
import Participants from "./Participants";
import Instructions from "./Instructions";
import DrawingPlayer from "./DrawingPlayer";
import "../stylesheets/GameRoom.css";

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
    
    // If there is no socket, navigate to the lobby
    if (!socket) {
      navigate("/lobby");
      return;
    }

    // Tell the server that we entered the game and pass it a callback to run
    socket.emit("enter-game-room", (gameObj, roomName) => {

      // if the socket is not in the room somehow go back to the lobby
      if (!gameObj) {
        navigate("/lobby");
      }
      
      // setup the game state
      setPlayers(gameObj.players);
      setRoom(roomName);
      setDrawPlayer(gameObj.drawPlayer)

      // If currentUser is the drawPlayer
      if (gameObj.drawPlayer === currentUser.username) {
        
        setDrawing(true);

        // Set the word into state
        setWord(gameObj.word);
      
      } else { // If currentUser is not the drawPlayer
        
        // Set the word to underscores
        const secretWord = gameObj.word
          .split("")
          .map((char) => (char === " " ? "  " : "_ "));
        setWord(secretWord);
      }

    });

    // Setup socket listeners
    socket.on("update-player-list", updatePlayerList);
    socket.on("message-data", handleMessageData);
    socket.on("correct-guess", handleCorrectGuess);
    socket.on("next-round", handleNextRound);

    // Remove socket listeners
    return () => {
      socket.removeListener("message-data", handleMessageData);
      socket.removeListener("update-player-list", updatePlayerList);
      socket.removeListener("correct-guess", handleCorrectGuess);
      socket.removeListener("next-round", handleNextRound);
    };
  }, []);

  // Adds a new message to state
  const handleMessageData = (message) => {
    setMessages((prevState) => {
      return [...prevState, message];
    });
  };

  // Updates the player list
  const updatePlayerList = (playerArray) => {
    setPlayers(playerArray);
  };
  
  // Sends a message
  const sendMessage = () => {

    // If there is no message, return
    if (messageText.length === 0) return;

    // Construct message object
    const messageObj = {
      text: messageText,
      user: currentUser.username,
    };

    // Send the message
    socket.emit("new-message", messageObj);

    // Add the message to state
    setMessages([...messages, messageObj]);
    
    // Clear the text input field 
    setMessageText("");
  };

  // Handle a correct guess
  const handleCorrectGuess = (name, word) => {

    // Display the message.
    setWord(
      `Correct guess by ${name} with ${word}. The next round will begin shortly.`
    );
  };

  // When a new round is triggered
  const handleNextRound = (gameObj) => {
    console.log("Cheaters check the console!", gameObj.word);

    // Set the draw player into state
    setDrawPlayer(gameObj.drawPlayer)

    // If currentUser is the draw player
    if (gameObj.drawPlayer === currentUser.username) {
      // Render the drawing canvas
      setDrawing(true);
      
      // Show them the real word
      setWord(gameObj.word);

    } else { // If the currentUser is not the drawPlayer

      // Set the word to underscores
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
