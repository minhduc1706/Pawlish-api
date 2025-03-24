import { body } from "express-validator";

export const validateAddCategory = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
  body("description").optional().isString().trim().withMessage("Description must be a string"),
];

export const validateUpdateCategory = [
  body("name").optional().isString().trim().notEmpty().withMessage("Name must be a non-empty string"),
  body("description").optional().isString().trim().withMessage("Description must be a string"),
];