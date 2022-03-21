import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Lobby.css"

function Lobby() {
  const [roomName, setRoomName] = useState("");
  const [roomList, setRoomList] = useState([]);

  const navigate = useNavigate();
  const socket = useSelector((state) => state.socket);

  useEffect(() => {
    //If there is no socket connection go to home
    if (!socket) {
      navigate("/");
      return;
    } else {
      // Tell the server we are in the lobby
      socket.emit("enter-lobby");

      // Setup socket listener
      socket.on("new-rooms", newRoomsHandler);
    }

    return () => {

      // Remove socket listener
      socket.removeListener("new-rooms", newRoomsHandler);
    };
  }, []);

  // Display room list
  const newRoomsHandler = (data) => {
    setRoomList(data);
  };

  // Join a room based on the input
  const joinRoom = (e) => {
    e.preventDefault();

    // If no room name has been entered return early
    if (roomName.length === 0) return;

    // Tell the server the roomName we want to join
    socket.emit("join-room", roomName);

    // Navigate to the game room
    navigate("/play");
  };

  // Join a room that is clicked on
  const joinExistingRoom = (room)=>{
    
    // Tell the server the room
    socket.emit("join-room", room);
    
    // go to the game room
    navigate("/play");
  }

  return (
    <div className="lobby-wrapper">
      <h1>Lobby</h1>
      <form className="form-container" onSubmit={joinRoom}>
        <input
          type="text"
          placeholder="Game name"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
        />
        <button>Create Game</button>
      </form>

      <div className="game-list-wrapper">
        <h2>Games in progress: {roomList.length}</h2>
        <ul>
          {roomList.map((roomName) => (
            <li
              key={roomName}
              onClick={(e) => joinExistingRoom(e.target.dataset.name)}
              data-name={roomName}
              className="game-link"
            >
              {roomName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Lobby;
