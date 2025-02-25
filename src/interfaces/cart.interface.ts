import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface ICart {
  user_id: IUser["_id"];
  items: ICartItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICartItem {
  productId:  IProduct["_id"];
  quantity: number;      
}