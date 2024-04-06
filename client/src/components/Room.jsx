import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import JoinRoom from "./JoinRoom";
import Notes from "./Notes";

const RoomPage = ({socket, user, roomId}) => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ user, id }) => {
    console.log(`user ${user} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

return (
  <div className="flex items-center justify-center">
      <div className="w-1/4 h-screen flex flex-col items-center justify-around">
      {/* <h1>Room Page</h1> */}
    <div className="p-4 border shadow-md transition-transform transform hover:shadow-lg bg-gray-100 hover:bg-gray-200 rounded-lg">
  <h4 className="font-bold text-xl">{remoteSocketId ? "Connected" : "No one in room"}</h4>
  <div className="mt-4 space-x-2">
    {myStream && <button onClick={sendStreams} className="button bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Send Stream</button>}
    {remoteSocketId && <button onClick={handleCallUser} className="button bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Call</button>}
  </div>
  {myStream && (
    <div className="mt-4">
      <h1 className="text-lg font-bold">My Stream</h1>
      <ReactPlayer
        playing
        muted
        height="100px"
        width="200px"
        url={myStream}
      />
    </div>
  )}
  {remoteStream && (
    <div className="mt-4">
      <h1 className="text-lg font-bold">Remote Stream</h1>
      <ReactPlayer
        playing
        muted
        height="100px"
        width="200px"
        url={remoteStream}
      />
    </div>
  )}
</div>


      <div className="w-full text-center">
            <button className="font-bold border-black cursor-pointer border-2 px-2 py-1 transition-transform transform shadow-md hover:shadow-lg bg-slate-50 hover:bg-gray-200">
      WhiteBoard
    </button>
            <button className="font-bold border-black cursor-pointer border-2 px-2 py-1 transition-transform transform shadow-md hover:shadow-lg bg-slate-50 hover:bg-gray-200">
      Code Editor
    </button>
            <button className="font-bold border-black cursor-pointer border-2 px-2 py-1 transition-transform transform shadow-md hover:shadow-lg bg-slate-50 hover:bg-gray-200">
      Leetcode daily
    </button>
            <button className="font-bold border-black cursor-pointer border-2 px-2 py-1 transition-transform transform shadow-md hover:shadow-lg bg-slate-50 hover:bg-gray-200">
      gfg potd
    </button>
      {/* <Notes socket={ socket } /> */}
      </div>
      </div>
      <div className="w-3/4 h-screen flex justify-center items-center">
      {/* <Notes socket={ socket } /> */}
        <JoinRoom socket={socket} user={user} roomId={roomId} />
      </div>
  
  </div>
);



};

export default RoomPage;