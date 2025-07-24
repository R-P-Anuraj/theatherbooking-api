import mongoose from "mongoose";
import { IMovie } from "../interfaces/movieInnterface";
const movieSchema = new mongoose.Schema<IMovie>({
  moviename: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "theater",
    required: true,
  },
});

export const movieModel = mongoose.model<IMovie>("movie", movieSchema);
