import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface IReview extends Document {
    user_id: IUser['_id']; 
    product_id: IProduct['_id']; 
    rating: number;  
    comment?: string; 
    createdAt?: Date;
    updatedAt?: Date;
  }
  
