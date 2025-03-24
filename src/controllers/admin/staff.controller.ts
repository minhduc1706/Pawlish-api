import { Request, Response, NextFunction } from "express";
import { StaffService } from "../../services/admin/staff.service";

export class StaffController {
   async getStaffList(req: Request, res: Response, next: NextFunction) {
    try {
      const staffList = await StaffService.getStaffList();
      res.json(staffList);
    } catch (error) {
      next(error);
    }
  }

   async createStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const staff = await StaffService.createStaff(req.body);
      res.status(201).json(staff);
    } catch (error) {
      next(error);
    }
  }

   async updateStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const staff = await StaffService.updateStaff(id, req.body);
      if (!staff) throw new Error("Staff not found");
      res.json(staff);
    } catch (error) {
      next(error);
    }
  }

   async deleteStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const staff = await StaffService.deleteStaff(id);
      if (!staff) throw new Error("Staff not found");
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}