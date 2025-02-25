import { Schema, model} from 'mongoose';
import { IUser } from '../interfaces/user.interface';


const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String},
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    status: { type: String, enum: ['active', 'block'], required: true },
    refreshToken: { type: String, default: null },
    devices: [{ ipAddress: String, userAgent: String }],
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
