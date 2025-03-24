import { NextFunction, Request, Response } from "express";
import {
  getContactHistoryByCustomerId,
  createContactHistory,
} from "../services/contact_history.service";
import { AppError } from "../errors/AppError";

export class ContactHistoryController {
  async getContactHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id } = req.query;
      if (!customer_id || typeof customer_id !== "string")
        throw new AppError("cusomter_id is missing", 404);

      const history = await getContactHistoryByCustomerId(customer_id);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  async createContactHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { customer_id, date, type, notes, staff_id } = req.body;

      const newHistory = await createContactHistory({
        customer_id,
        date,
        type,
        notes,
        staff_id,
      });
      res.status(201).json(newHistory);
    } catch (error) {
      next(error);
    }
  }
}
