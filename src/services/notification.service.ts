import { AppError } from "../errors/AppError";
import { INotification } from "../interfaces/notification.interface";
import { Notification } from "../models/notification.model";

export class NotificationService {
  static async getNotifications(): Promise<INotification[]> {
    const notifications = await Notification.find()
      .populate({
        path: "user_id",
        match: { role: "customer" },
        select: "full_name",
      })
      .populate("appointmentId", "date time service_id")
      .populate({
        path: "appointmentId",
        populate: { path: "service_id", select: "name" },
      })
      .sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      throw new AppError("No notifications found", 404);
    }

    return notifications;
  }

  static async markNotificationAsRead(id: string): Promise<INotification> {
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    )
      .populate({
        path: "user_id",
        match: { role: "customer" },
        select: "full_name",
      })
      .populate("appointmentId", "date time service_id")
      .populate({
        path: "appointmentId",
        populate: { path: "service_id", select: "name" },
      });

    if (!updatedNotification) {
      throw new AppError("Notification not found", 404);
    }

    return updatedNotification;
  }

  static async markAllNotificationsAsRead(): Promise<void> {
    const result = await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );
    if (result.modifiedCount === 0) {
      throw new AppError("No unread notifications to mark as read", 400);
    }
  }

  static async deleteNotification(id: string): Promise<void> {
    const result = await Notification.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Notification not found", 404);
    }
  }

  static async deleteAllReadNotifications(): Promise<void> {
    const result = await Notification.deleteMany({ isRead: true });
    if (result.deletedCount === 0) {
      throw new AppError("No read notifications to delete", 400);
    }
  }
}