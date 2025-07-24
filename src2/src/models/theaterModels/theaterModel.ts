import mongoose from "mongoose";
import { ITheater } from "../../interfaces/theaterInterfaces/theaterInterfaces";
const theaterSchema = new mongoose.Schema<ITheater>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dist: {
    type: String,
    required: true,
  },
 
  able: { type: Boolean, default: true },
  status: { type: String, enum: ["open", "close"], default: "open" },
  pincode: { type: Number, required: true },
});

export const theaterModel = mongoose.model<ITheater>("theater", theaterSchema);
