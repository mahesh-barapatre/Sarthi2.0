import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
// import Fyro from "./Fyro";
// import SubscribeCard from "./SubscribeCard";
import CreateRoom from "./components/CreateRoom";
import { Route, Routes } from "react-router-dom";
import JoinRoom from "./components/JoinRoom";
import io from "socket.io-client";
import RoomPage from "./components/Room";
// const server = "http://localhost:5000";
const server = "https://sarthi-1.onrender.com";

function App() {
  const socket = useMemo(() => io(servers), []);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState("");
  const [roomId, setRoomId] = useState(null);

  return (
    <div className= "bg-gray-200">
      <Routes>
        <Route
          path="/"
          element={
            <CreateRoom
              server = {server}
              socket={socket}
              setUser={setUser}
              setRoomIdProp={setRoomId}
            />
          }
        />
        {/* <Route
          path="/:roomId"
          element={<JoinRoom socket={socket} user={user} roomId={roomId} />}
        /> */}
        <Route
          path="/:roomId"
          element={<RoomPage socket={socket} user={user} roomId={roomId} />}
        />
      </Routes>
    </div>
  );
}

export default App;
