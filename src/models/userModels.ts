import mongoose from "mongoose";
import { IUser } from "../interfaces/userInterface";

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "client"],
    default: "client",
  },
  able: {
    type: Boolean,
    default: true,
  },
});

export const userModel = mongoose.model<IUser>("user", userSchema);
