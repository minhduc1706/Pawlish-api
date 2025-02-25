import { model, Schema } from "mongoose";
import { ICart } from "../interfaces/cart.interface";

const cartSchema: Schema<ICart> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICart>("Cart", cartSchema);
