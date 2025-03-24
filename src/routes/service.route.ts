import express from "express";
import { ServiceController } from "../controllers/service.controller";
import { handleValidationErrors } from "../errors/handleValidationErrors";
import { authorized } from "../middleware/auth.middleware";
import {
  validateAddService,
  validateGetServices,
  validateUpdateService,
} from "../validations/serviceValidation";

const router = express.Router();
const controller = new ServiceController();

router.get(
  "/",
  validateGetServices,
  handleValidationErrors,
  controller.getAllServices
);
router.get("/:id", handleValidationErrors, controller.getServiceById);

router.post(
  "/",
  authorized(["admin"]),
  controller.addService
);
router.put(
  "/:id",
  authorized(["admin"]),
  validateUpdateService,
  handleValidationErrors,
  controller.updateService
);
router.delete(
  "/:id",
  authorized(["admin"]),
  handleValidationErrors,
  controller.deleteService
);

export default router;
