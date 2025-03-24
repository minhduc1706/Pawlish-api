import { NextFunction, Request, Response } from "express";
import { ServiceReviewService } from "../services/service_review.service";
import { AppError } from "../errors/AppError";

export class ServiceReviewController {
  async getAverageRatingByStaff(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const staffId = req.user.id;
      if (!staffId || typeof staffId !== "string") {
        throw new AppError("staffId is required", 400);
      }

      const result = await ServiceReviewService.getAverageRatingByStaff(staffId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
