import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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


  return (
    <div className="mt-5 w-full h-screen">
      <h1 className="font-thin text-center  widht text-2xl">
        Welcome To Realtime Whiteboard Sharing App
      </h1>
      <div className=" flex flex-row w-100vh  !h-full items-center justify-evenly">
        
        <div className="w-5/12 h-3/5 border-black/5 border-4 rounded-lg  mx-auto">
          <h1 className="text-center min-w-full mt-4 font-bold text-blue-600/90 text-3xl">
            Join Room
          </h1>
          <div>
            <input
              value={nameJoin}
              onChange={(e) => setNameJoin(e.target.value)}
              placeholder="Name"
              className=" placeholder:pl-2 min-w-[90%] mb-3 ml-4 my-[100px] h-[40px] focus:border-blue-400 focus:border-3 outline-none bg-transparent border-black/5 border-2 rounded-lg"
            />
            <input
              placeholder="Room Id"
              value={joinRoom}
              onChange={(e) => setJoinRoom(e.target.value)}
              className=" placeholder:pl-2 min-w-[90%] mb-3 ml-4 h-[40px] focus:border-blue-400 focus:border-3 outline-none bg-transparent border-black/5 border-2 rounded-lg"
            />
          </div>
          <button
            onClick={handleRoomJoin}
            className="min-w-[90%] mt-[50px] h-[50px] bg-black hover:bg-white hover:text-black transition-all duration-300 !hover:border-6 !hover:border-black text-white mx-[13px]"
          >
            <span className="animate-puls transition-all">Join Room</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
