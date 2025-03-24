import { Request, Response, NextFunction } from "express";
import { AppointmentService } from "../services/appointment.service";
import { AppError } from "../errors/AppError";

export class AppointmentController {
  async addAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("User not authenticated", 401);
      const appointmentData = { ...req.body, user_id: userId };
      const newAppointment = await AppointmentService.addAppointment(
        appointmentData
      );
      res.status(201).json(newAppointment);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerAppointments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("User not authenticated", 401);
      const appointments = await AppointmentService.getCustomerAppointments(
        userId as string
      );
      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("User not authenticated", 401);
      const appointment = await AppointmentService.cancelAppointment(
        req.params.id,
        userId as string
      );
      res.status(200).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async getAppointmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await AppointmentService.getAppointmentById(
        req.params.id
      );
      res.status(200).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async getAllAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, status, endDate } = req.query;
      const staffId = req.user.id;
      const userRole = req.user.role;
      const filters: {
        date?: string;
        endDate?: string;
        staffId?: string;
        status?: string;
      } = {
        date: date as string,
        endDate: endDate as string,
        status: status as string,
      };

      if (userRole !== "admin") {
        filters.staffId = staffId;
      }

      const appointments = await AppointmentService.getAllAppointments(filters);
      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async getNearlyCompletedAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppointmentService.getNearlyCompletedAppointments();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedAppointment = await AppointmentService.updateAppointment(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedAppointment);
    } catch (error) {
      next(error);
    }
  }

  async deleteAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      await AppointmentService.deleteAppointment(req.params.id);
      res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  
}
