import { Router } from "express";
import { ChatController } from "../controllers/chat_message.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
const chatController = new ChatController();

router.post(
  "/upload-image",
  chatController.uploadImage,
  chatController.handleUploadImage
);

router.get(
  "/history",
  authorized(["staff"]),
  chatController.getChatHistory
);

export default router;