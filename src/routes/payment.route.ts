import express from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authorized } from "../middleware/auth.middleware";

const router = express.Router();
const payment = new PaymentController();


router.post("/", authorized(["staff", "admin"]), payment.createPayment.bind(payment));
router.get("/customer", authorized(["staff", "admin"]),payment.getCustomerPayments.bind(payment));
router.get("/", authorized(["staff", "admin"]),payment.getAllPayments.bind(payment));
router.patch("/:id", authorized(["staff", "admin"]),payment.updatePayment.bind(payment));

export default router;
