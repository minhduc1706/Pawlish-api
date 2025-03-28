import { Server, Socket } from "socket.io";
import { NextFunction, Request, Response } from "express";
import { IChatMessage } from "../interfaces/chat_message.interface";
import { saveMessage, getChatHistory, markMessagesAsRead } from "../services/chat.service";
import { AppError } from "../errors/AppError";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export class ChatController {
  private io: Server | null = null;

  initializeSocket(io: Server) {
    this.io = io;

    io.on("connection", (socket: Socket) => {
      const user = (socket as any).user;
      console.log(`User kết nối: ${user.id}${user.role ? ` với vai trò ${user.role}` : " (khách không đăng nhập)"}`);

      if (user.role === "staff") {
        socket.join(user.id); // Staff CSKH join room của chính họ
      } else {
        // Khách không đăng nhập
        socket.on("startChat", (data: { cskhStaffId: string }) => {
          const { cskhStaffId } = data;
          if (!cskhStaffId) {
            socket.emit("error", { message: "Thiếu ID của staff CSKH" });
            return;
          }

          const roomId = `room-${socket.id}-${cskhStaffId}`;
          socket.join(roomId);

          const staffSocket = Array.from(io.sockets.sockets.values()).find(
            (s) => (s as any).user?.id === cskhStaffId && (s as any).user?.role === "staff"
          );

          if (staffSocket) {
            staffSocket.join(roomId);
            (socket as any).currentRoom = roomId;
            (staffSocket as any).currentRoom = roomId;

            socket.emit("chatStarted", { roomId, cskhStaffId });
            staffSocket.emit("guestJoined", { roomId, guestId: socket.id });
          } else {
            socket.emit("noStaffAvailable", { message: "Staff CSKH hiện không online" });
          }
        });
      }

      socket.on("sendMessage", async (data: { message: string; image?: string }) => {
        const senderId = user.id;
        const { message, image } = data;
        const roomId = (socket as any).currentRoom;

        if (!roomId) {
          socket.emit("error", { message: "Chưa bắt đầu chat" });
          return;
        }

        const receiverId = user.role === "staff" 
          ? roomId.split("-")[1] // guestId
          : roomId.split("-")[2]; // cskhStaffId

        const messageData: IChatMessage = {
          senderId,
          receiverId,
          message,
          image,
          isRead: false,
        };

        try {
          const savedMessage = await saveMessage(messageData);
          io.to(roomId).emit("receiveMessage", savedMessage);
        } catch (error) {
          console.error("Lỗi khi gửi tin nhắn:", error);
          socket.emit("error", { message: "Gửi tin nhắn thất bại" });
        }
      });

      socket.on("disconnect", () => {
        const roomId = (socket as any).currentRoom;
        if (roomId) {
          io.to(roomId).emit("chatEnded");
        }
        console.log(`User ngắt kết nối: ${user.id}`);
      });
    });
  }

  uploadImage = upload.single("image");

  async handleUploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("Không có hình ảnh được tải lên", 400);
      }
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      res.status(200).json({ imageUrl });
    } catch (error) {
      next(error);
    }
  }

  async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { guestId } = req.query; // ID của khách từ query
      const staffId = req.user!.id; // ID của staff từ token

      if (!guestId || typeof guestId !== "string") {
        throw new AppError("Thiếu hoặc sai guestId", 400);
      }

      const history = await getChatHistory(staffId, guestId);
      await markMessagesAsRead(staffId, guestId);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ message: "Vui lòng dùng Socket.IO để gửi tin nhắn" });
  }
}