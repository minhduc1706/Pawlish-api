import mongoose, { Schema } from "mongoose";
import { IChatMessage } from "../interfaces/chat_message.interface";

const ChatSchema: Schema = new Schema(
  {
    senderId: { type: Schema.Types.Mixed, required: true },
    receiverId: { type: Schema.Types.Mixed, required: true },
    message: { type: String, required: true },
    image: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ChatMessageModel = mongoose.model<IChatMessage>(
  "Chat",
  ChatSchema
);
