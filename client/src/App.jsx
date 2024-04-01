import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
// import Fyro from "./Fyro";
// import SubscribeCard from "./SubscribeCard";
import CreateRoom from "./components/CreateRoom";
import { Route, Routes } from "react-router-dom";
import JoinRoom from "./components/JoinRoom";
import io from "socket.io-client";
import RoomPage from "./components/Room";
const servers = "http://localhost:5000";

function App() {
  const socket = useMemo(() => io(servers), []);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState("");
  const [roomId, setRoomId] = useState(null);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <CreateRoom
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
