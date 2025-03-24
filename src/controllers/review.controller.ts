import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ReviewService } from "../services/review.service";

export class ReviewController {
  async getAverageRating(req: Request, res: Response, next: NextFunction) {
    try {
      const ratingData = await ReviewService.getAverageRating();
      res.status(200).json(ratingData);
    } catch (error) {
      next(error);
    }
  }

  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError("User not authenticated", 401);
      const reviewData = { ...req.body, user_id: userId };
      const newReview = await ReviewService.addReview(reviewData);
      res.status(201).json(newReview);
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();