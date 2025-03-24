import { Request, Response, NextFunction } from "express";
import { RatingService } from "../services/rating.service";

export class RatingController {
  async getRatingsByStaffId(req: Request, res: Response, next: NextFunction) {
    try {
      const staffId = req.user?.id;
      const ratings = await RatingService.getRatingsByStaffId(staffId);
      res.status(200).json(ratings);
    } catch (error) {
      next(error);
    }
  }

  async getRatingsByServiceId(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.params;
      const ratings = await RatingService.getRatingsByServiceId(serviceId);
      res.status(200).json(ratings);
    } catch (error) {
      next(error);
    }
  }
async getAllRatings(req: Request, res: Response, next: NextFunction) {
    try {
      const ratings = await RatingService.getAllRatings();
      res.status(200).json(ratings);
    } catch (error) {
      next(error);
    }
  }
}