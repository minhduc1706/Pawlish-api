import { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service";

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const cart = await CartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;
      const updatedCart = await CartService.addItemToCart(userId, productId, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const userId = req.user.id;
      const updatedCart = await CartService.removeFromCart(userId, productId);
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      await CartService.clearCart(userId);
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      next(error);
    }
  }

  async bulkAddToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const itemsToSync = req.body;
      const updatedCart = await CartService.bulkAddToCart(userId, itemsToSync);
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  }

}
