import express from "express";
import { authorized } from "../middleware/auth.middleware";
import { NotificationController } from "../controllers/notification.controller";

const router = express.Router();
const notification = new NotificationController();

router.get("/", authorized(["admin", "staff"]), notification.getNotifications);
router.patch(
  "/:id/read",
  authorized(["admin", "staff"]),
  notification.markAsRead
);
router.patch(
  "/read-all",
  authorized(["admin", "staff"]),
  notification.markAllAsRead
);
router.delete(
  "/:id",
  authorized(["admin", "staff"]),
  notification.deleteNotification
);
router.delete(
  "/read",
  authorized(["admin", "staff"]),
  notification.deleteAllRead
);

export default router;
