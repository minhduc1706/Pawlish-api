import crypto from "crypto";
import dotenv from "dotenv";
import moment from "moment-timezone";
import { AppointmentPayment } from "../models/appointment_payment.route";

dotenv.config();

const vnp_TmnCode = process.env.VNPAY_TMN_CODE!;
const vnp_HashSecret = process.env.VNPAY_HASH_SECRET!;
const vnp_Url = process.env.VNPAY_URL!;
const returnUrl = process.env.RETURN_URL!;

export class ServicePaymentService {
  static async createVNPayPaymentUrl(data: {
    amount: number;
    appointmentId: string;
    userId: string;
    ipAddr: string;
  }) {
    const { amount, appointmentId, userId, ipAddr } = data;

    const date = moment().tz("Asia/Ho_Chi_Minh");
    const createDate = date.format("YYYYMMDDHHmmss");
    const expireDate = date.add(15, "minutes").format("YYYYMMDDHHmmss");

    let vnp_Params: { [key: string]: string } = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp_TmnCode,
      vnp_Amount: (amount * 100).toString(),
      vnp_CurrCode: "VND",
      vnp_TxnRef: appointmentId,
      vnp_OrderInfo: `ThanhToanDatLich${appointmentId}`,
      vnp_OrderType: "servicepayment",
      vnp_Locale: "vn",
      vnp_ExpireDate: expireDate,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((result, key) => {
        result[key] = vnp_Params[key];
        return result;
      }, {} as { [key: string]: string });

    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const secureHash = hmac.update(signData).digest("hex");

    vnp_Params["vnp_SecureHash"] = secureHash;

    await AppointmentPayment.create({
      user_id: userId,
      appointment_id: appointmentId,
      amount,
      status: "pending",
      payment_method: "VNPay",
    });

    return `${vnp_Url}?${new URLSearchParams(vnp_Params).toString()}`;
  }

  static async verifyVNPayReturn(vnpParams: { [key: string]: string }) {
    const secureHash = vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((result, key) => {
        result[key] = vnpParams[key];
        return result;
      }, {} as { [key: string]: string });

    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const checkHash = hmac.update(signData).digest("hex");

    const isValid = secureHash === checkHash;
    const responseCode = vnpParams["vnp_ResponseCode"];
    const appointmentId = vnpParams["vnp_TxnRef"];

    if (isValid && responseCode === "00") {
      await AppointmentPayment.findOneAndUpdate(
        { appointment_id: appointmentId },
        { status: "completed", vnp_transaction_no: vnpParams["vnp_TransactionNo"] }
      );
    } else {
      await AppointmentPayment.findOneAndUpdate(
        { appointment_id: appointmentId },
        { status: "failed" }
      );
    }

    return {
      isValid,
      responseCode,
      transactionNo: vnpParams["vnp_TransactionNo"],
    };
  }
}