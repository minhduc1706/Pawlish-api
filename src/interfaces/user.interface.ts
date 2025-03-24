import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  password: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'customer' | 'staff';
  refreshToken: string | null;
  devices: Array<{ ipAddress: string; userAgent: string }>;
  createdAt: Date;
  updatedAt: Date;
}
