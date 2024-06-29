import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import JoinRoom from "./JoinRoom";
import Notes from "./Notes";
import Questions from "./Questions";
import { NavHashLink as NavLink } from "react-router-hash-link";
import MagnifyingGlassLoader from "./loader/MagnifyingGlassLoader";
import { Icon } from "@iconify/react";
import OnPauseScreen from "./OnPauseScreen";

const RoomPage = ({ socket, user, roomId, server }) => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const [other, setOther] = useState("connecting...");

  const handleUserJoined = useCallback(({ user, id }) => {
    console.log(`user ${user} joined room`);
    setOther(user);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { name: user, to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ name, from, offer }) => {
      setOther(name);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { receiver: { user }, to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    // for (const track of myStream.getTracks()) {
    //   console.log("this is my Stream", myStream.getTracks());
    //   console.log(track);
    // peer.peer.addTrack(track, myStream);
    // }
    myStream.getTracks().forEach((track) => {
      console.log(track);
      console.log(myStream);
      peer.peer.addTrack(track, myStream);
    });
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
      console.log(ev);
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      console.log(remoteStream);
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

  // const [sec, setSec] = useState("wb");

  const [isMutedmyStream, setIsMutedmyStream] = useState(true);
  const [isPlayingmyStream, setIsPlayingmyStream] = useState(true);
  const [isMutedremoteStream, setIsMutedremoteStream] = useState(true);
  const [isPlayingremoteStream, setIsPlayingremoteStream] = useState(true);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center bg-purple-300">
      <div className="w-full sm:w-1/4 h-screen flex flex-col items-center justify-around">
        {/* <h1>Room Page</h1> */}
        {
          // !remoteStream
          //   &&

          <div className="text-center flex">
            <h4 className="text-xl">
              {remoteSocketId ? "Connected" : "No one in room"}
            </h4>
            <div className="">
              {myStream && (
                <button
                  onClick={sendStreams}
                  className="font-bold bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                >
                  Send Stream
                </button>
              )}
              {!myStream && remoteSocketId && (
                <button
                  onClick={handleCallUser}
                  className="font-bold bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                >
                  Call
                </button>
              )}
            </div>
          </div>
        }

        {myStream && (
          <div className="mt-4">
            <h1 className="text-sm font-bold">{user}</h1>
            <div className="min-h-[100px] min-w-[200px]">
              {isPlayingmyStream ? (
                <ReactPlayer
                  playing={isPlayingmyStream} // The video is set to play automatically
                  muted={isMutedmyStream} // The video is muted by default
                  height="100px"
                  width="200px"
                  url={myStream} // The URL of the video stream
                />
              ) : (
                <OnPauseScreen name={user} theme={"white"} />
              )}
            </div>

            <div className="mt-4 flex justify-evenly">
              <button
                className="p-1 rounded-full bg-white text-purple-500"
                onClick={() => setIsMutedmyStream((prev) => !prev)}
              >
                {isMutedmyStream ? (
                  <Icon icon="fluent:mic-off-20-filled" width={25} />
                ) : (
                  <Icon icon="fluent:mic-20-filled" width={25} />
                )}
              </button>

              <button
                className="p-1 rounded-full bg-white text-purple-500"
                onClick={() => setIsPlayingmyStream((prev) => !prev)}
              >
                {isPlayingmyStream ? (
                  <Icon icon="bxs:video" width={25} />
                ) : (
                  <Icon icon="bxs:video-off" width={25} />
                )}
              </button>

              <button
                className="p-2 rounded-full bg-red-600 text-white font-bold"
                // onClick={() => setIsPlayingmyStream((prev) => !prev)}
              >
                <Icon icon="tdesign:call-off" width={19} />
              </button>
            </div>
          </div>
        )}

        {!remoteStream && <MagnifyingGlassLoader text={"Connecting..."} />}

        {remoteStream && (
          <div className="">
            <h1 className="text-sm font-bold">{other}</h1>
            <div className="min-h-[100px] min-w-[200px]">
              {isPlayingremoteStream ? (
                <ReactPlayer
                  playing={isPlayingremoteStream}
                  muted={isPlayingremoteStream}
                  height="100px"
                  width="200px"
                  url={remoteStream}
                />
              ) : (
                <OnPauseScreen name={other} theme={"purple-500"} />
              )}
            </div>

            <div className="mt-4 flex justify-evenly">
              <button
                className="p-1 rounded-full bg-white text-purple-500"
                onClick={() => setIsMutedremoteStream((prev) => !prev)}
              >
                {isMutedremoteStream ? (
                  <Icon icon="fluent:mic-off-20-filled" width={25} />
                ) : (
                  <Icon icon="fluent:mic-20-filled" width={25} />
                )}
              </button>

              <button
                className="p-1 rounded-full bg-white text-purple-500"
                onClick={() => setIsPlayingremoteStream((prev) => !prev)}
              >
                {isPlayingremoteStream ? (
                  <Icon icon="bxs:video" width={25} />
                ) : (
                  <Icon icon="bxs:video-off" width={25} />
                )}
              </button>
            </div>
          </div>
        )}

        <div className="w-2/3 sm:w-full text-center fixed sm:static top-0">
          <NavLink to={`/${roomId}/#whiteboard`}>
            <button className="font-bold border-purple-500 cursor-pointer border-2 px-2 py-1 transition-transform transform shadow-md hover:shadow-lg bg-slate-50 hover:bg-gray-200">
              WhiteBoard
            </button>
          </NavLink>
          <NavLink to={`/${roomId}/#notes`}>
            <button className="font-bold border-purple-500 cursor-pointer border-2 px-2 py-1 transition-transform transform shadow-md hover:shadow-lg bg-slate-50 hover:bg-gray-200">
              Code Editor
            </button>
          </NavLink>
          <NavLink to={`/${roomId}/#leetcode`}>
            <button className="font-bold border-purple-500 cursor-pointer border-2 px-2 py-1 transition-transform transform shadow-md hover:shadow-lg bg-slate-50 hover:bg-gray-200">
              Leetcode daily
            </button>
          </NavLink>
          <NavLink to={`/${roomId}/#gfg`}>
            <button className="font-bold border-purple-500 cursor-pointer border-2 px-2 py-1 transition-transform transform shadow-md hover:shadow-lg bg-slate-50 hover:bg-gray-200">
              gfg potd
            </button>
          </NavLink>
        </div>
      </div>

      <div className="w-full sm:w-3/4 overflow-auto h-full sm:h-screen justify-center items-center">
        <JoinRoom socket={socket} user={user} roomId={roomId} />
        <Notes socket={socket} />
        <Questions id={"leetcode"} type={"lc"} server={server} />
        <Questions id={"gfg"} type={"gfg"} server={server} />
      </div>
    </div>
  );
};

export default RoomPage;
