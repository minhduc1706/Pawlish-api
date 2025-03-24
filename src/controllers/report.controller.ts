import { Request, Response, NextFunction } from "express";
import { ReportService } from "../services/report.service";
import { Types } from "mongoose";

export class ReportController {
  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const reportData = { ...req.body, user_id: userId };
      const newReport = await ReportService.createReport(reportData);
      res.status(201).json(newReport);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerReports(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const reports = await ReportService.getCustomerReports(userId);
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  }

  async getAllReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, userId, status } = req.query;
      const reports = await ReportService.getAllReports({
        date: date as string,
        userId: userId as string,
        status: status as string,
      });
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
  }

  async updateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedReport = await ReportService.updateReport(req.params.id, req.body);
      if (!updatedReport) {
        return res.status(404).json({ message: "Không tìm thấy báo cáo" });
      }
      res.status(200).json(updatedReport);
    } catch (error) {
      next(error);
    }
  }
}