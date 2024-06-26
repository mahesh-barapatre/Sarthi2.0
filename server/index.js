const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { Server } = require("socket.io");

const server = app.listen(5000, () => {
  console.log("App started at port 5000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const mongoURI =
  process.env.mongoURI ||
  "mongodb+srv://maheshbarapatre14:maheshAtlas2023@cluster0.tkhncfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Body parser middleware
app.use(express.json());
app.use(cors());

// MongoDB connection

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define a Mongoose Schema
const Schema = mongoose.Schema;

const ImgSchema = new Schema({
  name: {
    type: String,
    required: true, // Adding required validation
  },
  url: [
    {
      type: String,
      required: true, // Adding required validation
    },
  ],
});

const Img = mongoose.model("Img", ImgSchema);

app.get("/images/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const data = await Img.find({ name: name });
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).send("No images found");
    }
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

app.post("/images/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { imgsUrl } = req.body;

    const existingImage = await Img.findOne({ name: name });
    if (existingImage) {
      // Update existing image
      existingImage.url = imgsUrl;
      await existingImage.save();
      res.status(200).send("Updated successfully");
    } else {
      // Add new image
      await Img.create({ name: name, url: imgsUrl });
      res.status(201).send("Added successfully");
    }
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

const RoomSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
});

// Create a Mongoose model
// const fullRoom = mongoose.model('fullRoom', RoomSchema);
const vacantRoom = mongoose.model("vacantRoom", RoomSchema);

// Define routes

//Code to generate random number
const generateHexId = (length) => {
  const hexChars = "0123456789abcdef#&$%";
  console.log("1");
  let hexId = "";
  console.log("1");
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * hexChars.length);
    hexId += hexChars[randomIndex];
  }
  console.log("1");
  return hexId;
};

// Sample route - Get all samples
app.get("/check", async (req, res) => {
  try {
    // Check if there are any vacant rooms
    const vacantRooms = await vacantRoom.find();
    if (vacantRooms.length > 0) {
      // If there are vacant rooms, take out the first one
      const roomId = vacantRooms[0].id;

      // Remove the room from vacantRoom collection
      await vacantRoom.findOneAndDelete({ id: roomId });

      // Return the room number
      res.json({ roomId });
    } else {
      // If there are no vacant rooms, generate a random room id
      const randomRoomId = generateHexId(8); // Generate a random id
      console.log(randomRoomId);

      // Add the random room number to vacantRoom collection
      await vacantRoom.create({ id: randomRoomId });

      // Return the random room number
      res.json({ roomId: randomRoomId });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

io.on("connection", (socket) => {
  // console.log(`Socket Connected`, socket.id);
  socket.on("userJoined", (data) => {
    const { name, roomId } = data;
    io.to(roomId).emit("user:joined", { user: name, id: socket.id });
    socket.join(data?.roomId);
    socket.emit("userIsJoined", data.roomId, { success: true });
    console.log(name, "userIsJoined in room: ", data.roomId);
  });

  socket.on("user:call", ({ name, to, offer }) => {
    io.to(to).emit("incomming:call", { name, from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    // console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    // console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  let room, name;
  socket.on("newData", (data) => {
    // console.log(data.roomId);
    room = data.roomId;
    name = data.name;
    io.to(room).emit("test", {
      name: data.name,
      pic: data.pic,
    });
  });

  //notes socket logic
  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });

  socket.on("contentChange", (newContent) => {
    socket.broadcast.emit("contentChange", newContent);
  });
});
