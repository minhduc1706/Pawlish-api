import { query, param, body } from "express-validator";

export const validateGetServices = [
  query("search").optional().isString().trim().withMessage("Search must be a string"),
  query("category_id").optional().isMongoId().withMessage("Category ID must be a valid ID"),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("Min price must be a positive number"),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("Max price must be a positive number"),
  query("sortBy").optional().isIn(["price", "name", "duration"]).withMessage("SortBy must be price, name, or duration"),
  query("order").optional().isIn(["asc", "desc"]).withMessage("Order must be asc or desc"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
];

export const validateAddService = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
  body("description").isString().trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be a positive integer"),
  body("category_id").isMongoId().withMessage("Category ID must be a valid ID"),
  body("available").optional().isBoolean().withMessage("Available must be a boolean"),
];

export const validateUpdateService = [
  body("name").optional().isString().trim().notEmpty().withMessage("Name must be a non-empty string"),
  body("description").optional().isString().trim().notEmpty().withMessage("Description must be a non-empty string"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("duration").optional().isInt({ min: 1 }).withMessage("Duration must be a positive integer"),
  body("category_id").optional().isMongoId().withMessage("Category ID must be a valid ID"),
  body("available").optional().isBoolean().withMessage("Available must be a boolean"),
];