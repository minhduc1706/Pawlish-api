import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const newProduct = await ProductService.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedProduct = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      if (!updatedProduct) {
        res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
