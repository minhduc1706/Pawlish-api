import jwt from 'jsonwebtoken';
import { Server, Socket } from "socket.io";
import { NextFunction, Request, Response } from "express";
import { IChatMessage } from "../interfaces/chat_message.interface";
import { saveMessage, getChatHistory, markMessagesAsRead } from "../services/chat.service";
import { AppError } from "../errors/AppError";
import multer from "multer";
import { ChatMessageModel } from "../models/chat_message.model";
import { jwtConfig } from "../config/jwtConfig";
import { Staff } from "../models/staff.model";

const upload = multer({ dest: "uploads/" });

export class ChatController {
  private io: Server | null = null;

  initializeSocket(io: Server) {
    this.io = io;

    io.on("connection", (socket: Socket) => {
      const user = (socket as any).user;
      const staffId = (socket as any).staffId;
      console.log(`User connected: ${user?.id || socket.id}${user?.role ? ` (${user.role})` : " (guest)"}${staffId ? `, Staff ID: ${staffId}` : ""}`);

      if (user?.role === "staff" && staffId) {
        socket.join(staffId);
      } else {
        socket.on("startChat", async (data: { cskhStaffId: string }) => {
          const { cskhStaffId } = data;
          const roomId = `room-${socket.id}-${cskhStaffId}`;
          socket.join(roomId);
          (socket as any).currentRoom = roomId;
        
          const messages = await ChatMessageModel.find({
            $or: [
              { senderId: socket.id, receiverId: cskhStaffId },
              { senderId: cskhStaffId, receiverId: socket.id },
            ],
          }).sort({ createdAt: 1 });
        
          socket.emit("chatStarted", { roomId, cskhStaffId, messages });
        
          const staffSocket = Array.from(io.sockets.sockets.values()).find(
            (s) => (s as any).staffId === cskhStaffId
          );
          if (staffSocket) {
            staffSocket.join(roomId);
            (staffSocket as any).currentRoom = roomId;
            staffSocket.emit("guestJoined", { roomId, guestId: socket.id, messages });
            console.log(`Staff ${cskhStaffId} joined room ${roomId} for guest ${socket.id}`);
          }
        });
      }

      socket.on("sendMessage", async (data: { message: string; receiverId: string; image?: string }) => {
        const senderId = user?.id || socket.id;
        const { message, receiverId, image } = data;
        const roomId = (socket as any).currentRoom;
      
        if (!roomId) {
          socket.emit("error", { message: "Chưa bắt đầu chat" });
          return;
        }
      
        const messageData = { senderId, receiverId, message, image, isRead: false };
        const savedMessage = await ChatMessageModel.create(messageData);
        io.to(roomId).emit("receiveMessage", savedMessage);
        console.log(`Message sent to room ${roomId}:`, savedMessage);
      });

      socket.on("joinStaffRoom", (data: { staffId: string }) => {
        socket.join(data.staffId);
        console.log(`Staff ${data.staffId} joined their own room`);
      });

      socket.on("joinRoom", (data: { roomId: string }) => {
        socket.join(data.roomId);
        console.log(`Staff ${staffId || user?.id} joined room: ${data.roomId}`);
      });

      socket.on("disconnect", () => {
        const roomId = (socket as any).currentRoom;
        if (roomId) io.to(roomId).emit("chatEnded");
        console.log(`User disconnected: ${user?.id || socket.id}`);
      });
    });
  }

  uploadImage = upload.single("image");

  async handleUploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("No image uploaded", 400);
      }
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      res.status(200).json({ imageUrl });
    } catch (error) {
      next(error);
    }
  }

  async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // User._id nếu là staff
      const guestId = req.query.guestId as string || req.headers["x-guest-id"] as string;
  
      if (userId) {
        const staff = await Staff.findOne({ user_id: userId });
        if (!staff) throw new Error("Staff not found");
        const staffId = staff._id.toString();
  
        if (guestId) {
          const history = await ChatMessageModel.find({
            $or: [
              { senderId: staffId, receiverId: guestId },
              { senderId: guestId, receiverId: staffId },
            ],
          }).sort({ createdAt: 1 });
          res.status(200).json(history);
        } else {
          const chats = await ChatMessageModel.aggregate([
            { $match: { $or: [{ senderId: staffId }, { receiverId: staffId }] } },
            { $group: { _id: { $cond: [{ $eq: ["$senderId", staffId] }, "$receiverId", "$senderId"] }, messages: { $push: "$$ROOT" } } },
            { $project: { guestId: "$_id", messages: 1 } },
          ]);
          res.status(200).json(chats);
        }
      } else if (guestId) {
        const history = await ChatMessageModel.find({
          $or: [
            { senderId: guestId },
            { receiverId: guestId },
          ],
        }).sort({ createdAt: 1 });
        res.status(200).json(history);
      } else {
        throw new Error("Guest ID or User ID required");
      }
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ message: "Please use Socket.IO to send messages" });
  }
}