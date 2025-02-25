import { IUser } from "./user.interface";

export interface IVipMembership {
  user_id: IUser["_id"];
  tier: "silver" | "gold" | "platinum";
  startDate: Date;
  endDate: Date;
  price: number;
  benefits: string[];
}
