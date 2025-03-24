import express from "express";
import { reviewController } from "../controllers/review.controller";
import { authorized } from "../middleware/auth.middleware";

const router = express.Router();

router.get(
  "/average",
  authorized(["admin", "staff"]),
  reviewController.getAverageRating
);

router.post(
  "/",
  authorized(["customer"]),
  reviewController.addReview
);

export default router;