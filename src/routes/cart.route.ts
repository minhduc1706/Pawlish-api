import express from "express";
import { CartController } from "../controllers/cart.controller";
import { authorized } from "../middleware/auth.middleware";

const router = express.Router();
const cartController = new CartController();
const { addToCart, clearCart, removeFromCart, getCart, bulkAddToCart } =
  cartController;

router.post("/", addToCart);
router.delete("/remove/:productId", removeFromCart);
router.get("/", authorized(["customer"]), getCart);
router.delete("/clear", clearCart);
router.post("/bulk-add", authorized(["customer"]), bulkAddToCart);

export default router;
