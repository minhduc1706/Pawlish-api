import { Schema, model } from "mongoose";
import { IVipMembership } from "../interfaces/vip_membership.interface";

const VipMembershipSchema: Schema<IVipMembership> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tier: { type: String, enum: ["silver", "gold", "platinum"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
  benefits: { type: [String], required: true },
});

export default model<IVipMembership>("VipMembership", VipMembershipSchema);
