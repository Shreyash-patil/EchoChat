import { Server } from "socket.io";
import express from "express";
import http from "http";


const app = express();
const SocketServer = http.createServer(app);



//used to store online users
const userSocketMap = {}; //userId:socket.id

const io = new Server(SocketServer, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  //io.emit() used to send events to all connected users
  io.emit("getOnlineUsers",Object.keys(userSocketMap));
  
  socket.on("disconnect", () => {
      // console.log("A user disconnected", socket.id);
      delete userSocketMap[userId]
      io.emit("getOnlineUsers",Object.keys(userSocketMap));
  });
});

export { io, SocketServer, app };
export function getReceiverSocketId(userId){
  return userSocketMap[userId]
}
