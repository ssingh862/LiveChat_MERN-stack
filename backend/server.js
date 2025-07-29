const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
require("dotenv").config();
const { Server } = require("socket.io");
const Message = require("./Models/Message");

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

connectDB();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send({ message: "Hello" });
});

//Socket.io
io.on("connection", (socket) => {
  console.log(`User connected:${socket.id}`);
  Message.find()
    .sort({ createAt: 1 })
    .limit(100)
    .then((msgs) => {
      socket.emit("load_message", msgs);
    });

  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Message({
        name: data.name,
        message: data.message,
      });
      await newMessage.save();
      io.emit("receive_message", newMessage);
    } catch (err) {
      console.log("Message save Error", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
