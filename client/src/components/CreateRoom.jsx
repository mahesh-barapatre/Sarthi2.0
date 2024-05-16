import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
const server = "http://localhost:5000";

// var randomToken = require("random-token");

const CreateRoom = ({ setUser, socket, setRoomIdProp }) => {
  const navig = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [joinRoom, setJoinRoom] = useState();
  const [name, setName] = useState("");
  const [nameJoin, setNameJoin] = useState("");

  const handleRoomJoin = (e) => {

    if (!nameJoin || !joinRoom) return;

    e.preventDefault();
    socket.emit("userJoined", {
      roomId: joinRoom,
    });
    setUser(nameJoin);
    setRoomIdProp(joinRoom);
    navig(`/${joinRoom}`);
  };

  const joinGlobal = async(e) => {
    e.preventDefault();
    const roomNum = await axios.get("http://localhost:5000/check");
    console.log(roomNum.data.roomNum);
    socket.emit("userJoined", {
      roomId: roomNum.data.roomNum,
    });
    setUser(nameJoin);
    setRoomIdProp(roomNum.data.roomNum);
    navig(`/${roomNum.data.roomNum}`);
  };


  return (
  <div className="flex flex-col items-center justify-center h-screen">
  <div className="w-10/12 max-w-xs bg-white rounded-lg shadow-lg p-8 bg-opacity-60">
    <h1 className="text-center text-3xl font-bold text-blue-600 mb-6">Join Room</h1>
    <form className="flex flex-col space-y-4">
      <div className="relative">
        <input
          value={nameJoin}
          onChange={(e) => setNameJoin(e.target.value)}
          type="text"
          placeholder="Your Alias"
          className="input-field bg-transparent"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
      </div>
      <div className="relative">
        <input
          placeholder="Room ID"
          value={joinRoom}
          onChange={(e) => setJoinRoom(e.target.value)}
          type="text"
          className="input-field bg-transparent"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">🏠</span>
      </div>
      <button
        onClick={handleRoomJoin}
        className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-all duration-300"
      >
        Join Room
      </button>
      <button
        onClick={joinGlobal}
        className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-all duration-300"
      >
        Global Join
      </button>
    </form>
  </div>
</div>

  );
};

export default CreateRoom;
