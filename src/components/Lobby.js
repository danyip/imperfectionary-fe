import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [roomName, setRoomName] = useState("");
  const [roomList, setRoomList] = useState([]);

  const navigate = useNavigate();

  const socket = useSelector((state) => state.socket);

  
  useEffect(() => {
    if (!socket) {
      navigate("/login");
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

  const joinRoom = (room) => {
    socket.emit("join-room", room);
    navigate("/play");
  };

  return (
    <div>
      <h1>Lobby</h1>
      <ul>
        {roomList.map((roomName) => (
          <li
            key={roomName}
            onClick={(e) => joinRoom(e.target.dataset.name)}
            data-name={roomName}
          >
            {roomName}
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={roomName}
        onChange={(e) => {
          setRoomName(e.target.value);
        }}
      />
      <button onClick={() => joinRoom(roomName)}>Create Room</button>
    </div>
  );
}

export default Lobby;
