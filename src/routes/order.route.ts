import express from "express";
import { OrderController } from "../controllers/order.controller";

const router = express.Router();
const orderController = new OrderController();

router.get("/", orderController.getOrders.bind(orderController));
router.post("/", orderController.createOrder.bind(orderController));
router.get("/:id", orderController.getCustomerOrders.bind(orderController));

export default router;