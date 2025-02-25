import { Schema, Document, model } from 'mongoose';
import { INotification } from '../interfaces/notification.interface';


const notificationSchema:Schema<INotification> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = model<INotification>('Notification', notificationSchema);

