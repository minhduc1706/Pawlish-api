import { IChatMessage } from "../interfaces/chat_message.interface";
import { ChatMessageModel } from "../models/chat_message.model";
import { AppError } from "../errors/AppError";

export const saveMessage = async (messageData: IChatMessage): Promise<IChatMessage> => {
  try {
    const message = new ChatMessageModel(messageData);
    return await message.save();
  } catch (error) {
    throw new AppError("Lỗi khi lưu tin nhắn", 500);
  }
};

export const getChatHistory = async (senderId: string, receiverId: string): Promise<IChatMessage[]> => {
  try {
    return await ChatMessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });
  } catch (error) {
    throw new AppError("Lỗi khi lấy lịch sử chat", 500);
  }
};

export const markMessagesAsRead = async (senderId: string, receiverId: string): Promise<void> => {
  try {
    await ChatMessageModel.updateMany(
      { senderId: receiverId, receiverId: senderId, isRead: false },
      { $set: { isRead: true } }
    );
  } catch (error) {
    throw new AppError("Lỗi khi đánh dấu tin nhắn đã đọc", 500);
  }
};