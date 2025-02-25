import express from "express";
import { CartController } from "../controllers/cart.controller";

const router = express.Router();
const cartController = new CartController();
const {
  addToCart,
  clearCart,
  removeFromCart,
  getCart,
  bulkAddToCart,
} = cartController;

router.post("/", addToCart);
router.delete("/remove/:productId", removeFromCart);
router.get("/", getCart);
router.delete("/clear", clearCart);
router.post("/bulk-add", bulkAddToCart);

export default router;
