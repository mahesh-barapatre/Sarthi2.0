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

  //auto generate the room id
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     setRoomId(socket.id);
  //     console.log("connected", socket.id);
  //   });
  // }, []);

  
  const handleCreateRoom = async () => {
    try {
      const data = {
        name,
        roomId: roomId,
        userId: randomToken(10),
        host: true,
      };
      // setUser(name);
      // setRoomIdProp(roomId);

      // socket.emit("userJoined", {
      //   roomId: roomId,
      // });
      // navig(`/${roomId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const generate = () => {
    setRoomId(randomToken(20));
  };

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

  //   const handleSubmitForm = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     socket.emit("room:join", { email, room });
  //   },
  //   [email, room, socket]
  // );

  // const handleJoinRoom = useCallback(
  //   (data) => {
  //     const { email, room } = data;
  //     navigate(`/room/${room}`);
  //   },
  //   [navigate]
  // );

  // useEffect(() => {
  //   socket.on("room:join", handleJoinRoom);
  //   return () => {
  //     socket.off("room:join", handleJoinRoom);
  //   };
  // }, [socket, handleJoinRoom]);

  // useEffect(() => {
  //   socket.on("userIsJoined", (data) => {
  //     if (data.success) {
  //       console.log("user joined hurray");
  //     } else {
  //       console.log("UserJoined Error");
  //     }
  //   });
  // }, []);

  return (
    <div className="mt-5 w-full h-screen">
      <h1 className="font-thin text-center  widht text-2xl">
        Welcome To Realtime Whiteboard Sharing App
      </h1>
      <div className=" flex flex-row w-100vh  !h-full items-center justify-evenly">
        <div className="w-5/12 h-3/5 border-4 border-black/5 rounded-lg flex flex-col mx-auto">
          <h1 className="text-center min-w-full mt-4 font-bold text-blue-600/90 text-3xl">
            Create Room
          </h1>
          <div>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className=" placeholder:pl-2 min-w-[90%] mb-3 ml-4 my-[100px] h-[40px] focus:border-blue-400 focus:border-3 outline-none bg-transparent border-black/5 border-2 rounded-lg"
            />
            <div className="min-w-[90%] flex flex-row">
              <input
                disabled
                value={roomId}
                placeholder="Generate Room Code"
                className=" placeholder:pl-2 min-w-[70%] mb-3 ml-4 h-[40px] focus:border-blue-400 focus:border-3 outline-none placeholder:bg-white/40 border-black/5 border-2 rounded-lg"
              />
              <button
                className="bg-blue-600 text-white ml-2 rounded-lg w-[15%] h-[40px]"
                onClick={generate}
              >
                Generate
              </button>
              <button className="bg-red-600 text-white ml-2 rounded-lg w-[8%] h-[40px]">
                Copy
              </button>
            </div>
          </div>
          <button
            onClick={handleCreateRoom}
            className="min-w-[90%] mt-[50px] h-[50px] bg-black hover:bg-white hover:text-black transition-all duration-300 border-3 hover:border-3 border-transparent !hover:border-blac text-white mx-[13px]"
          >
            <span className="animate-puls transition-all">Create Room </span>
          </button>
        </div>
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


// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSocket } from "../context/SocketProvider";

// const LobbyScreen = () => {
//   const [email, setEmail] = useState("");
//   const [room, setRoom] = useState("");

//   const socket = useSocket();
//   const navigate = useNavigate();

//   const handleSubmitForm = useCallback(
//     (e) => {
//       e.preventDefault();
//       socket.emit("room:join", { email, room });
//     },
//     [email, room, socket]
//   );

//   const handleJoinRoom = useCallback(
//     (data) => {
//       const { email, room } = data;
//       navigate(`/room/${room}`);
//     },
//     [navigate]
//   );

//   useEffect(() => {
//     socket.on("room:join", handleJoinRoom);
//     return () => {
//       socket.off("room:join", handleJoinRoom);
//     };
//   }, [socket, handleJoinRoom]);

//   return (
//     <div>
//       <h1>Lobby</h1>
//       <form onSubmit={handleSubmitForm}>
//         <label htmlFor="email">Email ID</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <br />
//         <label htmlFor="room">Room Number</label>
//         <input
//           type="text"
//           id="room"
//           value={room}
//           onChange={(e) => setRoom(e.target.value)}
//         />
//         <br />
//         <button>Join</button>
//       </form>
//     </div>
//   );
// };

// export default LobbyScreen;