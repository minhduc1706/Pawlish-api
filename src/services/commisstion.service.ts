import { ICommission } from "../interfaces/commission.interface";
import {Commission} from "../models/commission.model";

export class CommissionService {
  static async getMonthlyCommission(staffId?: string): Promise<{
    commissionThisMonth: string;
    commissionProgress: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const query: any = {
      date: { $gte: startOfMonth, $lte: endOfMonth },
    };
    if (staffId) query.staff_id = staffId;

    const commissions = await Commission.find(query);
    const totalCommission = commissions.reduce((sum, commission) => sum + commission.amount, 0);

    const target = 3600000; 
    const commissionProgress = totalCommission > 0 ? Math.min((totalCommission / target) * 100, 100) : 0;

    return {
      commissionThisMonth: totalCommission.toLocaleString("vi-VN") + " ₫", 
      commissionProgress: Math.round(commissionProgress),
    };
  }

  static async addCommission(commissionData: Partial<ICommission>): Promise<ICommission> {
    const commission = new Commission(commissionData);
    await commission.save();
    return commission;
  }
}