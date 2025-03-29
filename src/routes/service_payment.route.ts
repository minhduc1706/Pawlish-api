import { Router } from "express";
import { ServicePaymentController } from "../controllers/service_payment.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
const servicePaymentController = new ServicePaymentController();

router.post(
  "/vnpay",
  authorized(["customer"]),
  servicePaymentController.createVNPayPayment.bind(servicePaymentController)
);
router.get("/vnpay_return", servicePaymentController.handleVNPayReturn);

export default router;