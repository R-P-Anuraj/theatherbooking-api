import mongoose from "mongoose";
import { IShow } from "../interfaces/showInterfaces";
const showSchema = new mongoose.Schema<IShow>({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movie",
    required: true,
  },
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "screen",
    required: true,
  },
  showtime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "theater",
    required: true,
  },
  showEndDate: {
    type: Date,
  }
});

export const showModel = mongoose.model<IShow>("show", showSchema);
