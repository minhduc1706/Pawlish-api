import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { jwtConfig } from "./jwtConfig";
import { ChatMessageModel } from "../models/chat_message.model";

export const configureSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, jwtConfig.accessTokenSecret || "your-secret-key") as any;
        (socket as any).user = decoded;
        console.log("Socket authenticated:", decoded);
        next();
      } catch (err) {
        console.error("Socket auth error:", err.message);
        next(new Error("Authentication error"));
      }
    } else {
      console.log("No token provided, treating as guest");
      next();
    }
  });

  io.on("connection", (socket: Socket) => {
    if ((socket as any).user) {
      console.log(`Staff CSKH kết nối: ${(socket as any).user.id} (${(socket as any).user.email})`);
    } else {
      console.log(`Khách không đăng nhập kết nối: ${socket.id}`);
    }

    socket.on("startChat", async (data: { cskhStaffId: string }) => {
      const { cskhStaffId } = data;
      const roomId = `room-${socket.id}-${cskhStaffId}`;
      socket.join(roomId);
      console.log(`Client ${socket.id} started chat with staff ${cskhStaffId}, room: ${roomId}`);

      // Lấy lịch sử tin nhắn
      const messages = await ChatMessageModel.find({
        $or: [
          { senderId: socket.id, receiverId: cskhStaffId },
          { senderId: cskhStaffId, receiverId: socket.id },
        ],
      }).sort({ createdAt: 1 });

      socket.emit("chatStarted", { roomId, cskhStaffId, messages });

      // Thông báo cho staff nếu online
      const staffSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => (s as any).user?.id === cskhStaffId && (s as any).user?.role === "staff"
      );
      if (staffSocket) {
        staffSocket.join(roomId);
        staffSocket.emit("guestJoined", { roomId, guestId: socket.id, messages });
      }
    });

    socket.on("sendMessage", async (messageData: { message: string; receiverId?: string }) => {
      const roomId = Array.from(socket.rooms).find((room) => room.startsWith("room-"));
      if (roomId) {
        const cskhStaffId = roomId.split("-")[2];
        const newMessage = {
          senderId: (socket as any).user?.id || socket.id,
          receiverId: messageData.receiverId || cskhStaffId,
          message: messageData.message,
          isRead: false,
        };

        const savedMessage = await new ChatMessageModel(newMessage).save();
        console.log("Message saved:", savedMessage);

        io.to(roomId).emit("receiveMessage", savedMessage);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};