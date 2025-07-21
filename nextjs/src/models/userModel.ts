import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
  userName: string;
  emailId: string;
  password: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
}
const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  emailId: {
    type: String,
    required: [true, "enter a valid emailId"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});  

export const User = mongoose.models.user || mongoose.model<IUser>("user", userSchema);
