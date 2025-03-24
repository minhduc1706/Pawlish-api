import express from "express";
import { authorized } from "../middleware/auth.middleware";
import { ContactHistoryController } from "../controllers/contact_history.controller";

const router = express.Router();
const ContactHistory = new ContactHistoryController();

router.get("/", authorized(["staff"]), ContactHistory.getContactHistory);
router.post(
  "/",
  authorized(["staff"]),
  ContactHistory.createContactHistory
);

export default router;
