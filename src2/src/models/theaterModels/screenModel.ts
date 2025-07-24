import mongoose from "mongoose";
import { IScreen } from "../../interfaces/theaterInterfaces/screenInterfaces";

const screenSchema = new mongoose.Schema<IScreen>({
  screen_num: {
    type: Number,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "theater",
    required: true,
  },
  numofshows: {
    type: Number,
    required: true,
  },
  showtimes: {
    type: [String], //show time
    required: true,
  },
  
  description: {
    type: String,
  },
});

export const screenModel = mongoose.model<IScreen>("Screen", screenSchema);
