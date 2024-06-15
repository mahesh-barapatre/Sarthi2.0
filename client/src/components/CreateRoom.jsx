import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import {CopyToClipboard} from 'react-copy-to-clipboard';
// const server = "http://localhost:5000";

// var randomToken = require("random-token");

const CreateRoom = ({ setUser, socket, setRoomIdProp, server }) => {
  const navig = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [joinRoom, setJoinRoom] = useState();
  const [name, setName] = useState("");
  const [nameJoin, setNameJoin] = useState("");
  const [copied, setCopied] = useState(false);

  function generateHexId(length) {
    const hexChars = '0123456789abcdef&$#';
    let hexId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * hexChars.length);
        hexId += hexChars[randomIndex];
    }
    return hexId;
}

  useEffect(()=>{
    setJoinRoom(generateHexId(8));
  },[]);

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

    if(!nameJoin){
      alert("Please enter your name");
      return;
    }

    e.preventDefault();
    const roomNum = await axios.get(`${server}/check`);
    console.log(roomNum.data.roomNum);
    socket.emit("userJoined", {
      roomId: roomNum.data.roomId,
    });
    setUser(nameJoin);
    setRoomIdProp(roomNum.data.roomId);
    navig(`/${roomNum.data.roomId}`);
  };


  return (
  <div className="flex items-center justify-center h-screen flex-row">
    <div className="flex flex-col items-center justify-center w-1/2 h-screen">

    <h1 className="w-full">
      <span className="text-9xl font-bold text-blue-600 mb-6">Sarthi</span>
      <span className="text-3xl font-bold text-blue-600 mb-6">2.0</span>
      <span className="text-3xl font-bold text-blue-600 mb-6">🎉</span>
    </h1>
    <h2 className="flex flex-wrap">
      <span className="text-3xl font-bold text-blue-600 mb-6">Your Collaborative Companion...</span>
    </h2>
    <h2 className="flex flex-wrap">
      <span className="text-5xl font-bold text-black mb-6">Collaborate,</span>
      <span className="text-7xl font-bold text-purple-600 mb-6">Innovate,</span>
      <span className="text-5xl font-bold text-green-600 mb-6">Succeed</span>
    </h2>
    </div>
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

      {/* copy to clipborad button */}
      <CopyToClipboard text={joinRoom} onCopy={() => setCopied(true)}>
          <img className="bg-slate-200 size-8" src="https://www.svgrepo.com/show/3110/copy.svg" alt="copy" />
      </CopyToClipboard>
      {copied && <span className="text-sm text-green-500">Copied!</span>}


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
