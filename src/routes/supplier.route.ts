import express from "express";
import { handleValidationErrors } from "../errors/handleValidationErrors";
import { SupplierController } from "../controllers/supplier.controller";



const router = express.Router();
const controller = new SupplierController();

router.get("/", handleValidationErrors, controller.getAllSuppliers);
