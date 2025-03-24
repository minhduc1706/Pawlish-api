import { Types } from "mongoose";
import { IReport } from "../interfaces/report.interface";
import { Report } from "../models/report.model";

export class ReportService {
  static async createReport(reportData: Partial<IReport>): Promise<IReport> {
    const newReport = new Report(reportData);
    return await newReport.save();
  }

  static async getCustomerReports(userId: string): Promise<IReport[]> {
    const reports = await Report.find({ user_id: userId }).populate("user_id", "full_name email");
    return reports
  }

  static async getAllReports(filters: {
    date?: string;
    userId?: string;
    status?: string;
  }): Promise<IReport[]> {
    const query: any = {};
    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (filters.userId) query.user_id = new Types.ObjectId(filters.userId);
    if (filters.status) query.status = filters.status;

    return await Report.find(query).populate("user_id", "full_name email");
  }

  static async updateReport(id: string, updateData: Partial<IReport>): Promise<IReport | null> {
    return await Report.findByIdAndUpdate(id, updateData, { new: true });
  }
}