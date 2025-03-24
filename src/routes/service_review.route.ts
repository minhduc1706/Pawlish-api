import { Router } from "express";
import { ServiceReviewController } from "../controllers/service_review.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
const serviceReviewController = new ServiceReviewController()

router.get("/average", authorized(["staff"]),serviceReviewController.getAverageRatingByStaff);


export default router;