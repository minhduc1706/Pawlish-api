import express from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { handleValidationErrors } from "../errors/handleValidationErrors";
import { authorized } from "../middleware/auth.middleware";


const router = express.Router();
const controller = new AppointmentController();

router.post(
  "/",
  authorized(["customer","staff"]),
    handleValidationErrors,
  controller.addAppointment
);

router.get("/", authorized(["customer","staff"]), controller.getCustomerAppointments);

router.patch(
  "/:id/cancel",
  authorized(["customer","admin","staff"]),
  controller.cancelAppointment
);
router.get("/nearly-completed", authorized(["admin", "staff"]),  controller.getNearlyCompletedAppointments)
router.get("/all", authorized(["admin","staff"]), controller.getAllAppointments);
router.get("/:id", authorized(["admin","staff"]), controller.getAppointmentById);

router.patch(
  "/:id",
  authorized(["admin","staff"]),
  controller.updateAppointment
);

router.delete("/:id", authorized(["admin","staff"]), controller.deleteAppointment);


export default router;
