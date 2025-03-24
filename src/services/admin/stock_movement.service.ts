import { IStockMovement } from "../../interfaces/stockMovement.interface";
import { StockMovement } from "../../models/stockMovement.model";

export class StockMovementService {
  static async getStockMovementsByProductId(productId: string): Promise<IStockMovement[]> {
    return StockMovement.find({ productId });
  }

  static async addStockMovement(data: Partial<IStockMovement>): Promise<IStockMovement> {
    return new StockMovement(data).save();
  }
}