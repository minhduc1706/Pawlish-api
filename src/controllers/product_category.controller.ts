import { Request, Response, NextFunction } from "express";
import { ProductCategoryService } from "../services/product_category.service";

export class ProductCategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ProductCategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const newCategory = await ProductCategoryService.addCategory(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await ProductCategoryService.getCategoryById(id);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedCategory = await ProductCategoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!updatedCategory) {
        res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductCategoryService.deleteCategory(req.params.id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
