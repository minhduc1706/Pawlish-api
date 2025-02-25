import express from "express";
import authRoute from "./auth.route";
import serviceRoute from "./service.route";
import bookingRoute from "./booking.route";
import cartRoute from "./cart.route";
import notificationRoute from "./notification.route";
import userRoute from "./user.routes";
import paymentRoute from "./payment.route";
import blogRoute from "./blog.route";
import petRoute from "./pet.route";
import supportRoute from "./support.route";
import vipRoute from "./vip.route";
import invoiceRoute from "./invoice.route";
import productRoute from "./product.route";
import { authorized } from "../middleware/auth.middleware";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/cart", authorized(["customer"]), cartRoute);
router.use("/services", serviceRoute);
router.use("/booking", bookingRoute);
router.use("/payment", paymentRoute);
router.use("/notifications", notificationRoute);
router.use("/pets", petRoute);
router.use("/blogs", blogRoute);
router.use("/support", supportRoute);
router.use("/vip", vipRoute);
router.use("/invoices", invoiceRoute);

export default router;
