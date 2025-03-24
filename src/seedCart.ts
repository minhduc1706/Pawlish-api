import { Staff } from "./models/staff.model";
import { Service } from "./models/service.model";
import { ServiceCategory } from "./models/service_category.model";
import { Appointment } from "./models/appointment.model";
import { Commission } from "./models/commission.model";
import { Review } from "./models/review.model";
import { Product } from "./models/product.model";
import { User } from "./models/user.model";
import { Pet } from "./models/pet.model";
import { ContactHistory } from "./models/contact_history.model";
import { Notification } from "./models/notification.model";
import { ServiceReview } from "./models/service_review.model";
import { ProductCategory } from "./models/product_category.model";
import { Rating } from "./models/rating.model";
import { Report } from "./models/report.model";
import { StaffSchedule } from "./models/staff_schedule.model";
import { Payment } from "./models/payment.model"; // Thêm Payment

async function seedDB() {
  try {
    // **Xóa toàn bộ dữ liệu hiện có**
    await User.deleteMany({});
    await Pet.deleteMany({});
    await ServiceCategory.deleteMany({});
    await Service.deleteMany({});
    await Product.deleteMany({});
    await Staff.deleteMany({});
    await Appointment.deleteMany({});
    await Commission.deleteMany({});
    await Review.deleteMany({});
    await ContactHistory.deleteMany({});
    await Notification.deleteMany({});
    await ServiceReview.deleteMany({});
    await ProductCategory.deleteMany({});
    await Rating.deleteMany({});
    await Report.deleteMany({});
    await StaffSchedule.deleteMany({});
    await Payment.deleteMany({});

    console.log("Cleared all collections.");

    // **Thêm User (50 người: 40 customer, 1 admin, 9 staff)**
    const users = [];
    for (let i = 1; i <= 50; i++) {
      const role = i <= 40 ? "customer" : i === 41 ? "admin" : "staff";
      users.push({
        email: `${role}${i}@example.com`,
        password: `${role}123`,
        full_name: `${
          role === "customer"
            ? "Customer"
            : role === "admin"
            ? "Admin"
            : "Staff"
        } ${i}`,
        phone: `090${1000000 + i}`,
        role,
      });
    }
    const savedUsers = await User.insertMany(users);

    // **Thêm Pet (80 thú cưng)**
    const pets = [];
    const species = ["Dog", "Cat", "Bird", "Rabbit"];
    const breeds = {
      Dog: [
        "Golden Retriever",
        "Poodle",
        "Bulldog",
        "German Shepherd",
        "Labrador",
      ],
      Cat: ["Persian", "Siamese", "Maine Coon", "Ragdoll"],
      Bird: ["Parrot", "Canary", "Cockatiel"],
      Rabbit: ["Holland Lop", "Mini Rex", "Flemish Giant"],
    };
    for (let i = 0; i < 80; i++) {
      const specie = species[Math.floor(Math.random() * species.length)];
      pets.push({
        user_id: savedUsers[Math.floor(Math.random() * 40)]._id, // Chỉ gán cho customer
        name: `Pet ${i + 1}`,
        species: specie,
        breed:
          breeds[specie][Math.floor(Math.random() * breeds[specie].length)],
        age: Math.floor(Math.random() * 10) + 1,
        weight: Math.floor(Math.random() * 30) + 1,
        gender: Math.random() > 0.5 ? "male" : "female",
      });
    }
    const savedPets = await Pet.insertMany(pets);

    // **Thêm ServiceCategory (5 danh mục)**
    const serviceCategories = [
      { name: "Pet Care", description: "Chăm sóc thú cưng" },
      { name: "Grooming", description: "Cắt tỉa lông" },
      { name: "Training", description: "Huấn luyện" },
      { name: "Health Check", description: "Kiểm tra sức khỏe" },
      { name: "Boarding", description: "Gửi thú cưng" },
    ];
    const savedServiceCategories = await ServiceCategory.insertMany(
      serviceCategories
    );

    // **Thêm ProductCategory (6 danh mục)**
    const productCategories = [
      { name: "Food", description: "Thức ăn" },
      { name: "Toys", description: "Đồ chơi" },
      { name: "Accessories", description: "Phụ kiện" },
      { name: "Health", description: "Sản phẩm sức khỏe" },
      { name: "Grooming Supplies", description: "Dụng cụ làm đẹp" },
      { name: "Bedding", description: "Đệm và giường" },
    ];
    const savedProductCategories = await ProductCategory.insertMany(
      productCategories
    );

    // **Thêm Service (10 dịch vụ)**
    const services = [
      {
        name: "Bathing",
        price: 300000,
        duration: 45,
        category_id: savedServiceCategories[0]._id,
      },
      {
        name: "Haircut",
        price: 500000,
        duration: 60,
        category_id: savedServiceCategories[1]._id,
      },
      {
        name: "Nail Trimming",
        price: 100000,
        duration: 30,
        category_id: savedServiceCategories[1]._id,
      },
      {
        name: "Massage",
        price: 400000,
        duration: 60,
        category_id: savedServiceCategories[0]._id,
      },
      {
        name: "Teeth Cleaning",
        price: 200000,
        duration: 40,
        category_id: savedServiceCategories[3]._id,
      },
      {
        name: "Ear Cleaning",
        price: 150000,
        duration: 20,
        category_id: savedServiceCategories[1]._id,
      },
      {
        name: "Basic Training",
        price: 600000,
        duration: 90,
        category_id: savedServiceCategories[2]._id,
      },
      {
        name: "Health Checkup",
        price: 350000,
        duration: 45,
        category_id: savedServiceCategories[3]._id,
      },
      {
        name: "Overnight Boarding",
        price: 700000,
        duration: 1440,
        category_id: savedServiceCategories[4]._id,
      },
      {
        name: "Flea Treatment",
        price: 250000,
        duration: 30,
        category_id: savedServiceCategories[3]._id,
      },
    ];
    const savedServices = await Service.insertMany(services);

    // **Thêm Product (15 sản phẩm)**
    const products = [
      {
        name: "Premium Dog Food",
        price: 250000,
        stock_quantity: 80,
        description: "Thức ăn cao cấp cho chó",
        category_id: savedProductCategories[0]._id,
      },
      {
        name: "Wet Cat Food",
        price: 150000,
        stock_quantity: 100,
        description: "Thức ăn ướt cho mèo",
        category_id: savedProductCategories[0]._id,
      },
      {
        name: "Chew Bone Toy",
        price: 120000,
        stock_quantity: 150,
        description: "Đồ chơi nhai hình xương",
        category_id: savedProductCategories[1]._id,
      },
      {
        name: "Leather Dog Collar",
        price: 80000,
        stock_quantity: 200,
        description: "Vòng cổ da cho chó",
        category_id: savedProductCategories[2]._id,
      },
      {
        name: "Cat Scratcher Tower",
        price: 350000,
        stock_quantity: 40,
        description: "Tháp cào móng cho mèo",
        category_id: savedProductCategories[1]._id,
      },
      {
        name: "Vitamin Supplement",
        price: 200000,
        stock_quantity: 60,
        description: "Thực phẩm bổ sung",
        category_id: savedProductCategories[3]._id,
      },
      {
        name: "Bird Seed Mix",
        price: 90000,
        stock_quantity: 120,
        description: "Hạt hỗn hợp cho chim",
        category_id: savedProductCategories[0]._id,
      },
      {
        name: "Rabbit Hay",
        price: 110000,
        stock_quantity: 90,
        description: "Cỏ khô cho thỏ",
        category_id: savedProductCategories[0]._id,
      },
      {
        name: "Pet Shampoo",
        price: 180000,
        stock_quantity: 70,
        description: "Dầu gội cho thú cưng",
        category_id: savedProductCategories[4]._id,
      },
      {
        name: "Large Dog Bed",
        price: 400000,
        stock_quantity: 30,
        description: "Giường lớn cho chó",
        category_id: savedProductCategories[5]._id,
      },
      {
        name: "Mouse Cat Toy",
        price: 50000,
        stock_quantity: 200,
        description: "Đồ chơi chuột cho mèo",
        category_id: savedProductCategories[1]._id,
      },
      {
        name: "Flea Collar",
        price: 130000,
        stock_quantity: 100,
        description: "Vòng cổ chống bọ chét",
        category_id: savedProductCategories[3]._id,
      },
      {
        name: "Pet Brush",
        price: 90000,
        stock_quantity: 150,
        description: "Bàn chải chải lông",
        category_id: savedProductCategories[4]._id,
      },
      {
        name: "Bird Cage Accessory",
        price: 70000,
        stock_quantity: 80,
        description: "Phụ kiện lồng chim",
        category_id: savedProductCategories[2]._id,
      },
      {
        name: "Rabbit Water Bottle",
        price: 60000,
        stock_quantity: 120,
        description: "Bình nước cho thỏ",
        category_id: savedProductCategories[2]._id,
      },
    ];
    const savedProducts = await Product.insertMany(products);

    // **Thêm Staff (9 nhân viên)**
    const staff = savedUsers
      .filter((user) => user.role === "staff")
      .map((user, index) => ({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        salary: 10000000 + index * 500000,
        service_id: [
          savedServices[index % savedServices.length]._id,
          savedServices[(index + 1) % savedServices.length]._id,
        ],
      }));
    const savedStaff = await Staff.insertMany(staff);

    // **Thêm Appointment (150 lịch hẹn)**
    const appointments = [];
    const times = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];
    const statuses = [
      "pending",
      "confirmed",
      "ongoing",
      "completed",
      "cancelled",
    ];
    const locations = ["Store A", "Store B", "Store C"];

    const generateAppointments = (date) => {
      for (let i = 0; i < 50; i++) {
        // 50 lịch hẹn mỗi ngày
        const userIdx = Math.floor(Math.random() * 40); // Chỉ customer
        const petIdx = Math.floor(Math.random() * savedPets.length);
        const serviceIdx = Math.floor(Math.random() * savedServices.length);
        const staffIdx = Math.floor(Math.random() * savedStaff.length);
        const timeIdx = Math.floor(Math.random() * times.length);
        const statusIdx = Math.floor(Math.random() * statuses.length);
        const locationIdx = Math.floor(Math.random() * locations.length);

        const service = savedServices[serviceIdx];
        appointments.push({
          user_id: savedUsers[userIdx]._id,
          pet_id: savedPets[petIdx]._id,
          service_id: service._id,
          staff_id: savedStaff[staffIdx]._id,
          date,
          time: times[timeIdx],
          status: statuses[statusIdx],
          duration: service.duration,
          price: service.price,
          location: locations[locationIdx],
          actualStartTime:
            statuses[statusIdx] === "ongoing" ||
            statuses[statusIdx] === "completed"
              ? `${date}T${times[timeIdx]}:00Z`
              : null,
        });
      }
    };

    generateAppointments("2025-03-19");
    generateAppointments("2025-03-20");
    generateAppointments("2025-03-21");

    const savedAppointments = await Appointment.insertMany(appointments);

    // **Thêm StaffSchedule (54 lịch làm việc)**
    const staffSchedules = [];
    const days = ["2025-03-19", "2025-03-20", "2025-03-21"];
    days.forEach((date) => {
      savedStaff.forEach((staff) => {
        staffSchedules.push({
          staff_id: staff._id,
          service_id:
            staff.service_id[
              Math.floor(Math.random() * staff.service_id.length)
            ],
          time: "08:00",
          duration: 480, // 8 tiếng
          isBooked: Math.random() > 0.3,
        });
        staffSchedules.push({
          staff_id: staff._id,
          service_id:
            staff.service_id[
              Math.floor(Math.random() * staff.service_id.length)
            ],
          time: "13:00",
          duration: 240, // 4 tiếng
          isBooked: Math.random() > 0.3,
        });
      });
    });
    await StaffSchedule.insertMany(staffSchedules);

    // **Thêm Commission**
    const commissions = savedAppointments
      .filter((appt) => appt.status === "completed")
      .map((appt) => {
        const price = Number(appt.price);
        const amount = isNaN(price) ? 0 : price * 0.1;
        return {
          staff_id: appt.staff_id,
          amount,
          date: new Date(appt.date),
        };
      });
    await Commission.insertMany(commissions);

    // **Thêm Rating (50 đánh giá)**
    const ratings = savedAppointments
      .filter((appt) => appt.status === "completed")
      .slice(0, 50)
      .map((appt) => ({
        staffId: appt.staff_id,
        serviceId: appt.service_id,
        customerId: appt.user_id,
        staffRatings: {
          overall: Math.floor(Math.random() * 6),
          attitude: Math.floor(Math.random() * 6),
          professionalism: Math.floor(Math.random() * 6),
          communication: Math.floor(Math.random() * 6),
          timeliness: Math.floor(Math.random() * 6),
        },
        serviceRatings: {
          overall: Math.floor(Math.random() * 6),
          quality: Math.floor(Math.random() * 6),
          satisfaction: Math.floor(Math.random() * 6),
          timeliness: Math.floor(Math.random() * 6),
          value: Math.floor(Math.random() * 6),
        },
      }));
    await Rating.insertMany(ratings);

    // **Thêm Report (20 báo cáo - user_id là staff_id)**
    const reports = [];
    savedStaff.forEach((staff, index) => {
      reports.push({
        user_id: staff._id, // Staff ID
        type: "weekly",
        status: ["pending", "approved", "rejected"][
          Math.floor(Math.random() * 3)
        ],
        period: `2025-03-${17 + index} to 2025-03-${23 + index}`,
        date: new Date(`2025-03-${23 + index}`),
        content: `Báo cáo tuần của ${staff.full_name}`,
      });
      if (index % 2 === 0) {
        reports.push({
          user_id: staff._id, // Staff ID
          type: "monthly",
          status: "approved",
          period: "2025-03-01 to 2025-03-31",
          date: new Date("2025-03-31"),
          content: `Báo cáo tháng 3 của ${staff.full_name}`,
        });
      }
    });
    await Report.insertMany(reports);

    // **Thêm Payment (50 thanh toán - user_id là staff_id)**
    const payments = [];
    savedStaff.forEach((staff) => {
      payments.push({
        user_id: staff._id, // Staff ID
        amount: staff.salary,
        type: "salary",
        status: "pending",
        date: new Date("2025-03-31"),
        period: "March 2025",
      });
      payments.push({
        user_id: staff._id, // Staff ID
        amount: Math.floor(Math.random() * 1000000) + 200000,
        type: "bonus",
        status: Math.random() > 0.5 ? "completed" : "pending",
        date: new Date(`2025-03-${19 + Math.floor(Math.random() * 3)}`),
        period: "March 2025 Bonus",
      });
    });
    commissions.slice(0, 20).forEach((commission) => {
      payments.push({
        user_id: commission.staff_id, // Staff ID
        amount: commission.amount,
        type: "commission",
        status: "completed",
        date: commission.date,
        period: "March 2025 Commission",
      });
    });
    await Payment.insertMany(payments);

    // **Thêm Review (60 đánh giá sản phẩm)**
    const reviews = [];
    for (let i = 0; i < 60; i++) {
      const userIdx = Math.floor(Math.random() * 40); // Chỉ customer
      const productIdx = Math.floor(Math.random() * savedProducts.length);
      reviews.push({
        user_id: savedUsers[userIdx]._id,
        product_id: savedProducts[productIdx]._id,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `Sản phẩm ${Math.random() > 0.5 ? "tuyệt vời" : "rất tốt"}!`,
        createdAt: new Date(`2025-03-${19 + Math.floor(Math.random() * 3)}`),
      });
    }
    await Review.insertMany(reviews);

    // **Thêm ContactHistory (50 lịch sử liên hệ)**
    const contactHistories = [];
    for (let i = 0; i < 50; i++) {
      const userIdx = Math.floor(Math.random() * 40); // Chỉ customer
      contactHistories.push({
        customer_id: savedUsers[userIdx]._id,
        date: `2025-03-${19 + Math.floor(Math.random() * 3)}T${
          times[Math.floor(Math.random() * times.length)]
        }:00Z`,
        type: ["call", "visit", "email"][Math.floor(Math.random() * 3)],
        notes: `Liên hệ về ${Math.random() > 0.5 ? "lịch hẹn" : "sản phẩm"}`,
      });
    }
    await ContactHistory.insertMany(contactHistories);

    // **Thêm Notification (40 thông báo)**
    const notifications = savedAppointments.slice(0, 40).map((appt) => ({
      user_id: appt.user_id,
      type: "new_appointment",
      title: "Lịch hẹn mới",
      message: `${
        savedUsers.find((u) => u._id.equals(appt.user_id)).full_name
      } đã đặt lịch.`,
      isRead: Math.random() > 0.5,
      appointmentId: appt._id,
    }));
    await Notification.insertMany(notifications);

    // **Thêm ServiceReview**
    const serviceReviews = savedAppointments
      .filter((appt) => appt.status === "completed")
      .map((appt) => ({
        user_id: appt.user_id,
        service_id: appt.service_id,
        staff_id: appt.staff_id,
        rating: 3 + Math.round(Math.random() * 2),
        comment: "Dịch vụ rất tốt!",
        createdAt: new Date(appt.date),
      }));
    await ServiceReview.insertMany(serviceReviews);

    console.log("Database seeded successfully with large, meaningful data!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export default seedDB;
