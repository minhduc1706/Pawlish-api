import express from "express";
import { StaffController } from "../../controllers/admin/staff.controller";

const router = express.Router();
const controller = new StaffController();

router.get("/", controller.getStaffList);
router.post("/", controller.createStaff);
router.put("/:id", controller.updateStaff);
router.delete("/:id", controller.deleteStaff);

export default router;
