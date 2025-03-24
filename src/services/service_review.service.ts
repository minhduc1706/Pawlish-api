import { Types } from "mongoose";
import { ServiceReview } from "../models/service_review.model"; 

export class ServiceReviewService {
  static async getAverageRatingByStaff(
    staffId: string
  ): Promise<{ rating: number; ratingChange: number }> {
    const now = new Date();

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthReviews = await ServiceReview.aggregate([
      {
        $match: {
          staff_id: new Types.ObjectId(staffId),
          createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const currentRating = currentMonthReviews.length > 0 ? currentMonthReviews[0].avgRating : 0;

    const previousMonthReviews = await ServiceReview.aggregate([
      {
        $match: {
          staff_id: new Types.ObjectId(staffId),
          createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const previousRating = previousMonthReviews.length > 0 ? previousMonthReviews[0].avgRating : 0;
    const ratingChange = currentRating - previousRating;

    console.log("Current month:", currentMonthReviews);
    console.log("Previous month:", previousMonthReviews);
    console.log("Current rating:", currentRating, "Previous rating:", previousRating);

    return {
      rating: Number(currentRating.toFixed(2)),
      ratingChange: Number(ratingChange.toFixed(2)),
    };
  }
}