import { Request, Response, NextFunction } from "express";
import { ServiceCategoryService } from "../services/service_category.service";

export class ServiceCategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = req.query;
      const filters = {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
      };
      const categories = await ServiceCategoryService.getAllCategories(filters);
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const newCategory = await ServiceCategoryService.addCategory(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await ServiceCategoryService.getCategoryById(
        req.params.id
      );
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedCategory = await ServiceCategoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await ServiceCategoryService.deleteCategory(req.params.id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
