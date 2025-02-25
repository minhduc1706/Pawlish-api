import { Schema, model, Document } from "mongoose";

export interface IStaff extends Document {
  full_name: string;
  email: string;
  phone: string;
  role: "groomer" | "admin"| "vet";
  salary: number;
  status: 'active' | 'inactive';
  updated_at: Date;
}
