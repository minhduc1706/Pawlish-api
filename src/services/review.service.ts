import { AppError } from "../errors/AppError";
import { IReview } from "../interfaces/review.interface";
import { Review } from "../models/review.model";

export class ReviewService {
  static async getAverageRating(): Promise<{ rating: number; ratingChange: number }> {
    const reviews = await Review.find();
    if (!reviews.length) {
      throw new AppError("No reviews found", 404);
    }

    const currentRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthReviews = await Review.find({
      createdAt: { $lte: lastMonth },
    });
    const previousRating =
      lastMonthReviews.length > 0
        ? lastMonthReviews.reduce((sum, review) => sum + review.rating, 0) / lastMonthReviews.length
        : 0;

    const ratingChange = currentRating - previousRating;
    return {
      rating: Number(currentRating.toFixed(1)),
      ratingChange: Number(ratingChange.toFixed(1)), 
    };
  }

  static async addReview(reviewData: Partial<IReview>): Promise<IReview> {
    const review = new Review(reviewData);
    await review.save();
    return review;
  }
}