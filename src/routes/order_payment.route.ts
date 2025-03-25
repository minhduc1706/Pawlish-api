import { Router } from "express";
import { OrderPaymentController } from "../controllers/order_payment.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
const orderPaymentController = new OrderPaymentController();

router.post(
  "/vnpay",
  authorized(["customer"]),
  orderPaymentController.createVNPayPayment.bind(orderPaymentController)
);
router.get("/vnpay_return", orderPaymentController.handleVNPayReturn);

export default router;
