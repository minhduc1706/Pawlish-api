import { Request, Response, NextFunction } from "express";
import { CommissionService } from "../services/commisstion.service";

export class CommissionController {
  async getMonthlyCommission(req: Request, res: Response, next: NextFunction) {
    try {
      const staffId = req.user?.role === "staff" ? req.user.id : undefined;
      const commissionData = await CommissionService.getMonthlyCommission(staffId);
      res.status(200).json(commissionData);
    } catch (error) {
      next(error);
    }
  }

  async addCommission(req: Request, res: Response, next: NextFunction) {
    try {
      const commissionData = req.body;
      const newCommission = await CommissionService.addCommission(commissionData);
      res.status(201).json(newCommission);
    } catch (error) {
      next(error);
    }
  }
}
