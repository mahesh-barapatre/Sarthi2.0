const express = require("express");
const app = express();
const cors = require("cors");

const { Server } = require("socket.io");

const server = app.listen(5000, () => {
  console.log("App started at port 5000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//Route
// let roomGlobal, curr;
io.on("connection", (socket) => {


  console.log(`Socket Connected`, socket.id);
  // socket.on("room:join", (data) => {
  //   const { name, roomId } = data;
  //   // emailToSocketIdMap.set(email, socket.id);
  //   // socketidToEmailMap.set(socket.id, email);
  //   io.to(room).emit("user:joined", { name, id: socket.id });
  //   socket.join(roomId);
  //   io.to(socket.id).emit("room:join", data);
  // });
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    io.to(roomId).emit("user:joined", { name, id: socket.id });
    socket.join(data?.roomId);
    socket.emit("userIsJoined", data.roomId, { success: true });
    console.log("userIsJoined in room: ", data.roomId);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });




  let room, name;
  socket.on("newData", (data) => {
    console.log(data.roomId);
    room = data.roomId;
    name = data.name;
    io.to(room).emit("test", {
      name: data.name,
      pic: data.pic,
    });
    //console.log("Emitted newDataReceived event to room:", data.roomId);
  });

  //U3IxhA1QeZAC_r5wAABd
});

// const emailToSocketIdMap = new Map();
// const socketidToEmailMap = new Map();

// io.on("connection", (socket) => {
//   console.log(`Socket Connected`, socket.id);
//   socket.on("room:join", (data) => {
//     const { email, room } = data;
//     // emailToSocketIdMap.set(email, socket.id);
//     // socketidToEmailMap.set(socket.id, email);
//     io.to(room).emit("user:joined", { email, id: socket.id });
//     socket.join(room);
//     io.to(socket.id).emit("room:join", data);
//   });

//   socket.on("user:call", ({ to, offer }) => {
//     io.to(to).emit("incomming:call", { from: socket.id, offer });
//   });

//   socket.on("call:accepted", ({ to, ans }) => {
//     io.to(to).emit("call:accepted", { from: socket.id, ans });
//   });

//   socket.on("peer:nego:needed", ({ to, offer }) => {
//     console.log("peer:nego:needed", offer);
//     io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
//   });

//   socket.on("peer:nego:done", ({ to, ans }) => {
//     console.log("peer:nego:done", ans);
//     io.to(to).emit("peer:nego:final", { from: socket.id, ans });
//   });
// });