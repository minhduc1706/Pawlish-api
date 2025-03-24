import { Request, Response, NextFunction } from "express";
import { SupplierService } from "../services/supplier.service";

export class SupplierController {
  async getAllSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await SupplierService.getAllSuppliers();
      res.json(supplier);
      res.status(200).json(supplier);
    } catch (error) {
      next(error);
    }
  }
}