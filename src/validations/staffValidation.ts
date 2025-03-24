import { body } from "express-validator";

export const validateAddStaff = [
    body("name").isString().trim().notEmpty().withMessage("Name is required"),
    body("services")
      .isArray({ min: 1 })
      .withMessage("Services must be an array with at least one ID"),
    body("services.*").isMongoId().withMessage("Each service must be a valid ID"),
    body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  ];


  export const validateUpdateStaff = [
    body("name").optional().isString().trim().notEmpty().withMessage("Name must be a non-empty string"),
    body("services")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Services must be an array with at least one ID"),
    body("services.*").optional().isMongoId().withMessage("Each service must be a valid ID"),
    body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  ];