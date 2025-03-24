import cron from "node-cron";
import { Appointment } from "../models/appointment.model";
import { IService } from "../interfaces/service.interface";
import { IAppointment } from "../interfaces/appointment.interface";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const vnTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    const today = vnTime.toISOString().split("T")[0];
    console.log("Cron job chạy lúc:", vnTime.toLocaleString("vi-VN"));

    const ongoingAppointments = (await Appointment.find({ 
      status: "ongoing", 
      date: today 
    }).populate("service_id", "duration")) as IAppointment[];

    for (const appt of ongoingAppointments) {
      const service = appt.service_id as IService;
      if (!service?.duration) {
        console.warn(`Không tìm thấy duration cho ${appt._id}`);
        continue;
      }

      let startTime: Date;
      if (appt.actualStartTime) {
        startTime = new Date(appt.actualStartTime); // Dùng actualStartTime nếu có
        console.log(`Appointment ${appt._id}: Dùng actualStartTime=${startTime.toLocaleString("vi-VN")}`);
      } else {
        const startDate = new Date(appt.date + "T00:00:00+07:00");
        const [hours, minutes] = appt.time.split(":");
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        startTime = startDate;
        console.log(`Appointment ${appt._id}: Dùng appt.time=${startTime.toLocaleString("vi-VN")}`);
      }

      const endTime = new Date(startTime.getTime() + service.duration * 60000);

      console.log(
        `ID: ${appt._id}, Start: ${startTime.toLocaleString("vi-VN")}, End: ${endTime.toLocaleString("vi-VN")}, Now: ${vnTime.toLocaleString("vi-VN")}`
      );

      if (vnTime >= endTime) {
        appt.status = "completed";
        await appt.save();
        console.log(`Chuyển ${appt._id} sang completed`);
      } else {
        console.log(`Chưa đến giờ hoàn thành ${appt._id}`);
      }
    }
  } catch (error) {
    console.error("Lỗi cron job:", error);
  }
});

console.log("Cron job để cập nhật trạng thái đã khởi động");