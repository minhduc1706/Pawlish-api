import express from "express";
import { authorized } from "../middleware/auth.middleware";
import { CommissionController } from "../controllers/commission.controller";

const router = express.Router();
const commissionController = new CommissionController();

router.get(
  "/monthly",
  authorized(["admin", "staff"]),
  commissionController.getMonthlyCommission
);

router.post(
  "/",
  authorized(["admin"]),
  commissionController.addCommission
);

export default router;