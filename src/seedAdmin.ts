import { User } from "./models/user.model";

async function seedAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Đã có user admin trong database, không thêm mới.");
      return;
    }

    const adminUsers = [
      {
        email: "admin1@example.com",
        password: "admin123",
        full_name: "Admin One",
        phone: "0901000001",
        role: "admin",
      },
    ];

    const savedAdmins = await User.insertMany(adminUsers);
    console.log("Đã thêm thành công các user admin:", savedAdmins);
  } catch (error) {
    console.error("Lỗi khi seed admin:", error);
  }
}

export default seedAdmin;
