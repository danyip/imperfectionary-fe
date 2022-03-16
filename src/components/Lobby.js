import { log } from "@tensorflow/tfjs-core/dist/log";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [roomName, setRoomName] = useState("");
  const dispatch = useDispatch();
  const [roomList, setRoomList] = useState([]);
  
  const socket = useSelector((state) => state.socket);

  const navigate = useNavigate()
  socket.on('new-rooms', data =>{
    console.log(data);
    setRoomList(data)
  })

  useEffect(() => {
    socket.emit('enter-lobby')
  }, [])
  
  const joinRoom = (room) => {
    socket.emit("join-room", room);
    navigate('/play')
  };

  return (
    <div>
      <h1>Lobby</h1>
      <ul>
        {roomList.map((roomName) => (
          <li 
            key={roomName}
            onClick={(e)=>joinRoom(e.target.dataset.name)}
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
      <button onClick={()=>joinRoom(roomName)}>Create Room</button>

    </div>
  );
}

export default Lobby;
