import { Types } from "mongoose";

export interface IChatMessage {
  _id?: Types.ObjectId;
  senderId: string | Types.ObjectId;
  receiverId: string | Types.ObjectId;
  message: string;
  isRead: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
