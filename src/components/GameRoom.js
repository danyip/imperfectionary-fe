import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";
import DrawingCanvas from "./DrawingCanvas";
import GuessingCanvas from "./GuessingCanvas";

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

  // const handleStartGame = (gameObj) => {
  //   console.log(gameObj);
  //   if (gameObj.drawPlayer === currentUser.username) {
  //     setDrawing(true);
  //   }
  //   setGameStarted(true);
  // };

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
  }

  const handleNextRound = (gameObj)=>{
    console.log('Triggering next round', gameObj);
  }

  // const startHandler = () => {
  //   console.log("startGame");
  //   socket.emit("start-trigger");
  // };

  // if (gameStarted)
  //   return drawing ? (
  //     <div>
  //       <ChatBox
  //         setMessageText={setMessageText}
  //         messageText={messageText}
  //         sendMessage={sendMessage}
  //         messages={messages}
  //       />
  //       <DrawingCanvas />
  //     </div>
  //   ) : (
  //     <div>
  //     <ChatBox
  //         setMessageText={setMessageText}
  //         messageText={messageText}
  //         sendMessage={sendMessage}
  //         messages={messages}
  //       />
  //       <GuessingCanvas />
  //     </div>
  //   );

  return (
    <div>
      <h1>{room}</h1>
      <h2>{word}</h2>
      {/* <button onClick={startHandler}>Start</button> */}
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
      {drawing? <DrawingCanvas /> : <GuessingCanvas />}
    </div>
  );
}

export default GameRoom;
