import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

function Lobby() {
  const [roomName, setRoomName] = useState("");
  const [leaveRoomName, setLeaveRoomName] = useState("");
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket);
  const [roomList, setRoomList] = useState([]);

  socket.on('new-rooms', data =>{
    console.log(data);
    setRoomList(data)
  })

  useEffect(() => {
    socket.emit('enter-lobby')
  }, [])
  

  const createRoom = () => {
    socket.emit("join-room", roomName);
  };

  return (
    <div>
      <h1>Lobby</h1>
      <ul>
        {roomList.map((room) => (
          <li key={room}>{room}</li>
        ))}
      </ul>

      <input
        type="text"
        value={roomName}
        onChange={(e) => {
          setRoomName(e.target.value);
        }}
      />
      <button onClick={createRoom}>Create Room</button>

    </div>
  );
}

export default Lobby;
