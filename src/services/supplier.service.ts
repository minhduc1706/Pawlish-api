import { Supplier } from "../models/supplier.model";
import { ISupplier } from "../interfaces/supplier.interface";

export class SupplierService {
  static async getAllSuppliers(): Promise<ISupplier[]> {
    return Supplier.find();
  }
}