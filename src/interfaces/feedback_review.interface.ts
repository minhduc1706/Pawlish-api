import { IService } from "./service.interface";
import { IUser } from "./user.interface";

export interface IFeedback extends Document {
    user_id: IUser['_id'];  
    service_id: IService['_id']; 
    message: string; 
    rating: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  