import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  isAdmin: boolean;
  isPantry: boolean;
  isDelivery: boolean;
}

const userSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9]+$/,
  },
  email: {
    type: String,
    required: true,
    match: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  },
  phone: {
    type: String,
    required: true,
    match: /^[+]?[0-9]{10,15}$/,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default:false,
  },
  isPantry: {
    type: Boolean,
    default:false,
  },
  isDelivery: {
    type: Boolean,
    default:false,
  },
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
