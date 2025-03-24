import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authorized } from "../middleware/auth.middleware";

const router = Router();
const reportController = new ReportController();

router.post("/", authorized(["staff", "admin"]),reportController.createReport.bind(reportController));
router.get("/customer", authorized(["staff", "admin"]),reportController.getCustomerReports.bind(reportController));
router.get("/", authorized(["staff", "admin"]),reportController.getAllReports.bind(reportController));
router.patch("/:id", authorized(["staff", "admin"]),reportController.updateReport.bind(reportController));

export default router;