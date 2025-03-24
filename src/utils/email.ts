import nodemailer from "nodemailer";
import { AppError } from "../errors/AppError";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingConfirmation = async (
  to: string,
  appointment: any,
  service: any,
  staff: any,
  pet: any
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Xác nhận đặt lịch hẹn - Spa Thú Cưng",
    html: `
      <h2>Xác nhận đặt lịch hẹn</h2>
      <p>Cảm ơn bạn đã đặt lịch tại Spa Thú Cưng!</p>
      <p><strong>Dịch vụ:</strong> ${service.name}</p>
      <p><strong>Thú cưng:</strong> ${pet.name}</p>
      <p><strong>Nhân viên:</strong> ${staff.full_name}</p>
      <p><strong>Thời gian:</strong> ${new Date(appointment.appointment_time).toLocaleString()}</p>
      <p>Vui lòng đến đúng giờ. Nếu có thay đổi, liên hệ chúng tôi!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new AppError("Failed to send booking confirmation email", 500);
  }
};

export const sendPaymentConfirmation = async (
  to: string,
  payment: any,
  appointment: any
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Xác nhận thanh toán - Spa Thú Cưng",
    html: `
      <h2>Xác nhận thanh toán</h2>
      <p>Thanh toán của bạn đã được xử lý thành công!</p>
      <p><strong>Số tiền:</strong> ${payment.amount} VND</p>
      <p><strong>Phương thức:</strong> ${payment.payment_method}</p>
      <p><strong>Lịch hẹn:</strong> ${new Date(appointment.appointment_time).toLocaleString()}</p>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new AppError("Failed to send payment confirmation email", 500);
  }
};