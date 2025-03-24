import express from "express";
import { RatingController } from "../controllers/rating.controller";
import { authorized } from "../middleware/auth.middleware";

const router = express.Router();
const controller = new RatingController();

router.get("/", authorized(["staff","admin"]),controller.getRatingsByStaffId.bind(controller));
router.get("/service/:serviceId",  authorized(["staff","admin"]), controller.getRatingsByServiceId.bind(controller));
router.get("/service",  authorized(["staff","admin"]),controller.getAllRatings.bind(controller));

export default router;