import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { AppointmentService } from "./appointment.service";

export class UserService {
  static async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  static async updateUser(userId: string, updateData: Partial<IUser>) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  static async deleteUser(userId: string) {
    return await User.findByIdAndDelete(userId);
  }
}
