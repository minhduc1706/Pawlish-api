import { Rating } from "../models/rating.model";

export class RatingService {
  static async getRatingsByStaffId(staffId: string) {
    const rating = await Rating.find({ staffId })
    .populate("staffId", "full_name")
    .populate("serviceId", "name")
    .populate("customerId", "full_name")

    return rating;
  }

  static async getRatingsByServiceId(serviceId: string) {
    return Rating.find({ serviceId })
      .populate("staffId", "name")
      .populate("serviceId", "name")
      .populate("customerId", "full_name");
  }

  static async getAllRatings() {
    return Rating.find()
      .populate("staffId", "name")
      .populate("serviceId", "name")
      .populate("customerId", "full_name");
  }
}
