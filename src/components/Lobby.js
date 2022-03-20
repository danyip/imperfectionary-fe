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
    if (!socket) {
      navigate("/");
      return;
    } else {
      socket.emit("enter-lobby");
      socket.on("new-rooms", newRoomsHandler);
    }

    return () => {
      socket.removeListener("new-rooms", newRoomsHandler);
    };
  }, []);

  const newRoomsHandler = (data) => {
    setRoomList(data);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomName.length === 0) return;
    socket.emit("join-room", roomName);
    navigate("/play");
  };

  const joinExistingRoom = (room)=>{
    socket.emit("join-room", room);
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
