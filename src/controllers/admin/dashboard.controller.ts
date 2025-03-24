import express, { NextFunction } from "express";
import { AdminService } from "../../services/admin/dashboard.service";

export class AdminController {
  async getStats(
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) {
    try {
      const { period } = req.query as { period: string };
      const stats = await AdminService.getStats(period);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getSales(
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) {
    try {
      const { period } = req.query as { period: string };
      const sales = await AdminService.getSales(period);
      res.json(sales);
    } catch (error) {
      next(error);
    }
  }

  async getRevenueProfit(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const { period } = req.query as { period?: "monthly" | "quarterly" | "yearly" };
      const revenueProfit = await AdminService.getRevenueProfit(period || "monthly");
      res.json(revenueProfit);
    } catch (error) {
      next(error);
    }
  }

  async getProductCategories(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const categories = await AdminService.getProductCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getProductStats(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const stats = await AdminService.getProductStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getLowStockProducts(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const lowStockProducts = await AdminService.getLowStockProducts();
      res.json(lowStockProducts);
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivities(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const activities = await AdminService.getRecentActivities();
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }
}
