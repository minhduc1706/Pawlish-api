import { AppError } from "../errors/AppError";
import { IStaff } from "../interfaces/staff.interface";
import { Staff } from "../models/staff.model";
import { StaffSchedule } from "../models/staff_schedule.model";
import { Service } from "../models/service.model";
import { Appointment } from "../models/appointment.model";

export class StaffService {
  static async getAllStaff(
    filters: {
      search?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<IStaff[]> {
    const { search, page = 1, limit = 10 } = filters;

    const query: any = {};
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const staff = await Staff.find(query)
      .populate("service_id", "name price duration")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!staff.length) throw new AppError("No staff found", 404);
    return staff;
  }

  static async getStaffByService(serviceId: string): Promise<IStaff[]> {
    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) throw new AppError("Service not found", 404);

    return await Staff.find({ service_id: serviceId }).populate(
      "service_id",
      "name price duration"
    );
  }

  static async getAvailableTimes(
    serviceId: string,
    date?: string
  ): Promise<any[]> {
    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) throw new AppError("Service not found", 404);

    const query: any = { service_id: serviceId, isBooked: false };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.time = { $gte: startOfDay, $lte: endOfDay };
    }

    const schedules = await StaffSchedule.find(query).populate(
      "staff_id",
      "full_name email"
    );
    return schedules.map((schedule) => ({
      time: schedule.time,
      duration: schedule.duration,
      staff: schedule.staff_id,
    }));
  }

  static async addStaff(staffData: Partial<IStaff>): Promise<IStaff> {
    const { full_name, email, phone, service_id, salary } = staffData;

    if (!full_name || !email || salary === undefined) {
      throw new AppError("Full name, email, and salary are required", 400);
    }

    if (service_id && service_id.length > 0) {
      const services = await Service.find({ _id: { $in: service_id } });
      if (services.length !== service_id.length) {
        throw new AppError("One or more service IDs are invalid", 400);
      }
    }

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff)
      throw new AppError("Staff with this email already exists", 400);

    const newStaff = new Staff({
      full_name,
      email,
      phone,
      service_id,
      salary,
    });
    return await newStaff.save();
  }

  static async updateStaff(
    id: string,
    staffData: Partial<IStaff>
  ): Promise<IStaff> {
    if (staffData.service_id) {
      const services = await Service.find({
        _id: { $in: staffData.service_id },
      });
      if (services.length !== staffData.service_id.length) {
        throw new AppError("One or more service IDs are invalid", 400);
      }
    }

    if (staffData.email) {
      const existingStaff = await Staff.findOne({
        email: staffData.email,
        _id: { $ne: id },
      });
      if (existingStaff) throw new AppError("Email is already in use", 400);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(id, staffData, {
      new: true,
    }).populate("service_id", "name price duration");
    if (!updatedStaff) throw new AppError("Staff not found", 404);
    return updatedStaff;
  }

  static async deleteStaff(id: string): Promise<void> {
    const staff = await Staff.findById(id);
    if (!staff) throw new AppError("Staff not found", 404);

    const scheduleExists = await StaffSchedule.findOne({ staff_id: id });
    if (scheduleExists) {
      throw new AppError("Cannot delete staff with existing schedules", 400);
    }

    const appointmentExists = await Appointment.findOne({ staff_id: id });
    if (appointmentExists) {
      throw new AppError("Cannot delete staff with existing appointments", 400);
    }

    await Staff.deleteOne({ _id: id });
  }

  static async getCSKHStaff(): Promise<IStaff | null> {
    return await Staff.findOne({ email: "cskh@example.com" });
  }
}
