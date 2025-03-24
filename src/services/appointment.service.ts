import { AppError } from "../errors/AppError";
import { IAppointment } from "../interfaces/appointment.interface";
import { IService } from "../interfaces/service.interface";
import { Appointment } from "../models/appointment.model";
import { Commission } from "../models/commission.model";
import { Pet } from "../models/pet.model";
import { Service } from "../models/service.model";
import { Staff } from "../models/staff.model";
import { StaffSchedule } from "../models/staff_schedule.model";
import { User } from "../models/user.model";
import { sendBookingConfirmation } from "../utils/email";

export class AppointmentService {
  static async addAppointment(
    appointmentData: Partial<IAppointment>
  ): Promise<IAppointment> {
    const {
      service_id,
      staff_id,
      time: appointment_time,
      user_id,
      pet_id,
    } = appointmentData;

    const service = await Service.findById(service_id);
    if (!service || !service.available)
      throw new AppError("Service not found or unavailable", 404);

    const staff = await Staff.findById(staff_id);

    if (!staff || !staff.service_id.includes(service_id))
      throw new AppError("Staff cannot perform this service", 404);

    const schedule = await StaffSchedule.findOne({
      staff_id,
      service_id,
      time: appointment_time,
      isBooked: false,
    });
    if (!schedule) throw new AppError("Selected time is not available", 400);

    const newAppointment = new Appointment({
      ...appointmentData,
      appointment_time,
    });
    await newAppointment.save();

    schedule.isBooked = true;
    await schedule.save();

    const user = await User.findById(user_id);
    const pet = await Pet.findById(pet_id);
    if (user && pet) {
      await sendBookingConfirmation(
        user.email,
        newAppointment,
        service,
        staff,
        pet
      );
    }
    return this.populateAppointment(newAppointment);
  }

  static async getCustomerAppointments(
    userId: string
  ): Promise<IAppointment[]> {
    const appointments = await Appointment.find({ user_id: userId })
      .populate("user_id", "name phone email")
      .populate("pet_id", "name type")
      .populate("service_id", "name price duration")
      .populate("staff_id", "name phone");

    return appointments.length ? appointments : [];
  }

  static async completeAppointment(
    appointmentId: string,
    staffId: string
  ): Promise<any> {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      staff_id: staffId,
    });
    if (!appointment) {
      throw new AppError("Appointment not found or not assigned to you", 404);
    }
    if (appointment.status !== "ongoing") {
      throw new AppError("Appointment cannot be completed yet", 400);
    }

    appointment.status = "completed";
    await appointment.save();

    const service = await Service.findById(appointment.service_id);
    if (service) {
      const commissionRate = 0.1;
      const commissionAmount = service.price * commissionRate;
      await Commission.create({
        staff_id: staffId,
        amount: commissionAmount,
        date: new Date(),
      });
    }

    const populated = await this.populateAppointment(appointment);
    return this.formatAppointmentResponse(populated);
  }

  static async cancelAppointment(
    appointmentId: string,
    userId: string
  ): Promise<IAppointment> {
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user_id: userId,
    });
    if (!appointment)
      throw new AppError("Appointment not found or not owned by you", 404);

    if (appointment.status === "cancelled")
      throw new AppError("Appointment already canceled", 400);

    appointment.status = "cancelled";
    await appointment.save();

    const schedule = await StaffSchedule.findOne({
      staff_id: appointment.staff_id,
      service_id: appointment.service_id,
      time: appointment.time,
    });
    if (schedule) {
      schedule.isBooked = false;
      await schedule.save();
    }

    return this.populateAppointment(appointment);
  }

  static async getAllAppointments(filters: {
    date?: string; 
    endDate?: string;
    staffId?: string;
    status?: string;
  }): Promise<{ count: number; data: any[] }> {
    const { date, endDate, staffId, status } = filters;
    const query: any = {};
  
    if (date) {
      let startDate: Date;
      if (date === "today") {
        startDate = new Date();
      } else {
        startDate = new Date(date);
        if (isNaN(startDate.getTime())) {
          throw new AppError("Invalid date format", 400);
        }
      }
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfRange = endDate
        ? new Date(endDate)
        : new Date();
      if (endDate && isNaN(endOfRange.getTime())) {
        throw new AppError("Invalid endDate format", 400);
      }
      const endOfDay = new Date(endOfRange);
      endOfDay.setHours(23, 59, 59, 999);
  
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (staffId) query.staff_id = staffId;
    if (status) query.status = status;
  
    const appointments = await Appointment.find(query)
    .populate("user_id", "full_name phone email")
    .populate("pet_id", "name species")
    .populate({
      path: "service_id",
      select: "name duration price",
      populate: {
        path: "category_id",
        select: "name",
      },
    })
    .populate("staff_id", "name phone");
  
    const formattedAppointments = appointments.map((appt) => ({
      ...appt.toObject(),
      date: this.formatDate(appt.date),
    }));
  
    return { count: appointments.length, data: formattedAppointments };
  }

  static async getNearlyCompletedAppointments(): Promise<{
    count: number;
    appointments: any[];
  }> {
    const now = new Date();
    const today = new Date().toISOString().split("T")[0];

    const appointments = await Appointment.find({
      status: "ongoing",
      date: today,
    })
      .populate("user_id", "name phone email")
      .populate("pet_id", "name type")
      .populate("service_id", "name price duration")
      .populate("staff_id", "name phone");

    const nearlyCompleted = appointments.filter((appt) => {
      const startTime = new Date(appt.date);
      const duration = (appt.service_id as IService).duration;
      const endTime = new Date(startTime.getTime() + duration * 60000);
      const timeLeft = endTime.getTime() - now.getTime();
      return timeLeft > 0 && timeLeft < 15 * 60000;
    });

    const formattedAppointments = nearlyCompleted.map((appt) => ({
      ...appt.toObject(),
      date: this.formatDate(appt.date),
    }));

    return {
      count: nearlyCompleted.length,
      appointments: formattedAppointments,
    };
  }

  static async getAppointmentById(
    appointmentId: string
  ): Promise<IAppointment> {
    const appointment = await Appointment.findById(appointmentId)
      .populate("user_id", "name phone email")
      .populate("pet_id", "name type")
      .populate("service_id", "name price duration")
      .populate("staff_id", "name phone");

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }
    return appointment;
  }

  static async updateAppointment(
    appointmentId: string,
    updateData: Partial<IAppointment>
  ): Promise<IAppointment> {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);

    if (
      updateData.status &&
      !["pending", "confirmed", "ongoing", "completed", "cancelled"].includes(
        updateData.status
      )
    ) {
      throw new AppError("Invalid status", 400);
    }

    if (updateData.status === "ongoing") {
      const nowUtc = new Date();
      updateData.actualStartTime = new Date(nowUtc.getTime()); 
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    )
      .populate("user_id", "name phone email")
      .populate("pet_id", "name type")
      .populate("service_id", "name price duration")
      .populate("staff_id", "name phone");

    if (!updatedAppointment)
      throw new AppError("Failed to update appointment", 500);

    if (updateData.status === "cancelled") {
      const schedule = await StaffSchedule.findOne({
        staff_id: appointment.staff_id,
        service_id: appointment.service_id,
        time: appointment.time,
      });
      if (schedule) {
        schedule.isBooked = false;
        await schedule.save();
      }
    }

    return updatedAppointment;
  }

  static async deleteAppointment(appointmentId: string): Promise<void> {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    await Appointment.findByIdAndDelete(appointmentId);
    const schedule = await StaffSchedule.findOne({
      staff_id: appointment.staff_id,
      service_id: appointment.service_id,
      time: appointment.time,
    });
    if (schedule) {
      schedule.isBooked = false;
      await schedule.save();
    }
  }

  private static formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  private static formatAppointmentResponse(appointment: IAppointment): any {
    return {
      ...appointment.toObject(),
      date: this.formatDate(appointment.date),
    };
  }

  private static async populateAppointment(
    appointment: IAppointment
  ): Promise<IAppointment> {
    const populated = await Appointment.findById(appointment._id)
      .populate("user_id", "name phone email")
      .populate("pet_id", "name type")
      .populate("service_id", "name price duration")
      .populate("staff_id", "name phone");

    if (!populated) {
      throw new AppError("Failed to populate appointment data", 500);
    }
    return populated;
  }
}
