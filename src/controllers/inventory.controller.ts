import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { StockMovementService } from "../services/admin/stock_movement.service";

export class InventoryController {
  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getAllProducts(); 
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async addToInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const newProduct = await ProductService.addProduct(req.body); 
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  async updateInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductService.updateProduct(id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  async useInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { quantityUsed, serviceId, date } = req.body;

      const product = await ProductService.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.stock_quantity < quantityUsed) {
        return res.status(400).json({ message: "Insufficient stock quantity" });
      }

      const updatedProduct = await ProductService.updateProduct(id, {
        stock_quantity: product.stock_quantity - quantityUsed,
      });

      await StockMovementService.addStockMovement({
        productId: id,
        date: date || new Date(),
        type: "out",
        quantity: quantityUsed,
        reason: `Used for service ${serviceId || "unknown"}`,
        performedBy: "System",
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  async deleteFromInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      res.status(200).json({ message: "Product removed from inventory successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getStockMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const movements = await StockMovementService.getStockMovementsByProductId(id);
      res.status(200).json({ data: movements });
    } catch (error) {
      next(error);
    }
  }
}