import { Types } from "mongoose";

export interface ISupplier {
    _id: Types.ObjectId;
    name: string;        
    contactPerson: string; 
    email: string;      
    phone: string;      
    address: string;     
    notes?: string;     
  }