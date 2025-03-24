import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getNotifications();
      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedNotification = await NotificationService.markNotificationAsRead(id);
      res.status(200).json(updatedNotification);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllNotificationsAsRead();
      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await NotificationService.deleteNotification(id);
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async deleteAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.deleteAllReadNotifications();
      res.status(200).json({ message: "All read notifications deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}