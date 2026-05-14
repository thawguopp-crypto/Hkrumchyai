import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Basic API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Socket.io Logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat: ${chatId}`);
    });

    socket.on("send-message", (data) => {
      // data: { chatId, message: { id, text, senderId, timestamp, type } }
      io.to(data.chatId).emit("receive-message", data.message);
    });

    socket.on("typing", (data) => {
      // data: { chatId, userId, isTyping }
      socket.to(data.chatId).emit("user-typing", data);
    });

    socket.on("read-receipt", (data) => {
      // data: { chatId, userId, lastMessageId }
      io.to(data.chatId).emit("message-read", data);
    });

    // WebRTC Signaling
    socket.on("call-user", (data) => {
      // data: { chatId, offer, from }
      socket.to(data.chatId).emit("incoming-call", data);
    });

    socket.on("answer-call", (data) => {
      // data: { chatId, answer, to }
      socket.to(data.chatId).emit("call-answered", data);
    });

    socket.on("ice-candidate", (data) => {
      // data: { chatId, candidate }
      socket.to(data.chatId).emit("receive-ice-candidate", data);
    });

    socket.on("end-call", (chatId) => {
      io.to(chatId).emit("call-ended");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
