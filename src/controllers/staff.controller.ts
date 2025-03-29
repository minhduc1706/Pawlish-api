import { Request, Response, NextFunction } from "express";
import { StaffService } from "../services/staff.service";
import { Staff } from "../models/staff.model";
import { AppError } from "../errors/AppError";

export class StaffController {
  async getAllStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const staff = await StaffService.getAllStaff();
      res.status(200).json(staff);
    } catch (error) {
      next(error);
    }
  }

  async getStaffByService(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.query;
      const staff = await StaffService.getStaffByService(serviceId as string);
      res.status(200).json(staff);
    } catch (error) {
      next(error);
    }
  }

  async getAvailableTimes(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, date } = req.query;
      const times = await StaffService.getAvailableTimes(
        serviceId as string,
        date as string
      );
      res.status(200).json(times);
    } catch (error) {
      next(error);
    }
  }

  async addStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const newStaff = await StaffService.addStaff(req.body);
      res.status(201).json(newStaff);
    } catch (error) {
      next(error);
    }
  }

  async updateStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedStaff = await StaffService.updateStaff(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedStaff);
    } catch (error) {
      next(error);
    }
  }

  async deleteStaff(req: Request, res: Response, next: NextFunction) {
    try {
      await StaffService.deleteStaff(req.params.id);
      res.status(200).json({ message: "Staff deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
  async getCSKHStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const cskhStaff = await StaffService.getCSKHStaff();
      if (!cskhStaff) {
        return res.status(404).json({ message: "CSKH staff not found" });
      }
      res.status(200).json({ staffId: cskhStaff._id });
    } catch (error) {
      next(error);
    }
  }
  async getStaffProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const staff = await Staff.findOne({ user_id: userId });
      if (!staff) {
        throw new AppError("Staff not found", 404);
      }
      res.status(200).json(staff);
    } catch (error) {
      next(error);
    }
  }
}
