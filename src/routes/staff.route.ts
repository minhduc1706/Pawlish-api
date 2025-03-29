import express from "express";
import { StaffController } from "../controllers/staff.controller";
import { handleValidationErrors } from "../errors/handleValidationErrors";
import { authorized } from "../middleware/auth.middleware";
import { validateAddStaff, validateUpdateStaff } from "../validations/staffValidation";


const router = express.Router();
const controller = new StaffController();

router.get("/", handleValidationErrors, controller.getStaffByService);
router.get(
  "/available-times",
  handleValidationErrors,
  controller.getAvailableTimes
);

router.get("/all", controller.getAllStaff); 
router.post("/", authorized(["admin"]), validateAddStaff, handleValidationErrors, controller.addStaff);
router.put(
  "/:id",
  authorized(["admin"]),
  validateUpdateStaff,
  handleValidationErrors,
  controller.updateStaff
);
router.delete(
  "/:id",
  authorized(["admin"]),
  handleValidationErrors,
  controller.deleteStaff
);

router.get(
  "/me",
  authorized(["staff"]), // Thêm middleware để chỉ staff truy cập được
  controller.getStaffProfile // Sử dụng phương thức từ StaffController
);

router.get('/cskh', controller.getCSKHStaff.bind(controller));
export default router;