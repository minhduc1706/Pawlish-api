import { Staff } from "../../models/staff.model";
import { User } from "../../models/user.model";
import { IStaff } from "../../interfaces/staff.interface";

type CreateStaffData = Omit<IStaff, "_id" | "createdAt" | "updatedAt"> & {
  password: string;
};
export class StaffService {
  static async getStaffList(): Promise<IStaff[]> {
    return Staff.find().lean();
  }

  static async createStaff(data: CreateStaffData): Promise<IStaff> {
    const userData = {
      full_name: data.full_name,
      email: data.email,
      role: "staff" as const,
      password: data.password,
      phone: data.phone || "",
      address: "",
    };
    const user = new User(userData);
    await user.save();

    const staffData = {
      ...data,
      _id: user._id,
    };
    const staff = new Staff(staffData);
    return staff.save();
  }

  static async updateStaff(
    id: string,
    data: Partial<Omit<IStaff, "_id">>
  ): Promise<IStaff | null> {
    const staff = await Staff.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (staff) {
        await User.findByIdAndUpdate(id, {
        full_name: data.full_name || staff.full_name,
        email: data.email || staff.email,
        phone: data.phone || staff.phone,
      });
    }
    return staff;
  }

  static async deleteStaff(id: string): Promise<IStaff | null> {
    const staff = await Staff.findByIdAndDelete(id);
    if (staff) {
      await User.findByIdAndDelete(id);
    }
    return staff;
  }
}
