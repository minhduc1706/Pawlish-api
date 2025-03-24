import express from "express";
import dashboardRoute from "./dashboard.route";
import staffRoute from "./staff.route";

const router = express.Router();


router.use("/", dashboardRoute);
router.use("/staff", staffRoute);
export default router;
