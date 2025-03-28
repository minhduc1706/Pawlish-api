import bcrypt from "bcryptjs";
import { Staff } from "./models/staff.model";
import { User } from "./models/user.model";

export const seedStaff = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Xóa dữ liệu cũ
    await User.deleteMany({ email: "cskh@example.com" });
    await Staff.deleteMany({ email: "cskh@example.com" });
    console.log("Deleted existing user with email: cskh@example.com");

    // Tạo User trước
    const staffUser = {
      full_name: "CSKH",
      email: "cskh@example.com",
      password: hashedPassword,
      phone: "0123456789",
      address: "HCM, Vietnam",
      role: "staff",
    };
    const newUser = await User.create(staffUser);
    console.log("User created:", newUser);

    // Tạo Staff với userId tham chiếu tới User
    const staff = {
      user_id: newUser._id, // Tham chiếu _id từ User
      full_name: "CSKH",
      email: "cskh@example.com",
      phone: "0123456789",
      salary: "50000",
    };
    const newStaff = await Staff.create(staff);
    console.log("Staff seeded:", newStaff);

  } catch (error) {
    console.error("Error seeding staff:", error);
  }
};