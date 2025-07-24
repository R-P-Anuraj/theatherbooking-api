import { Types } from "mongoose";

export interface IScreen {
  screen_num: number;
  theaterId: Types.ObjectId;
  numofshows: number;
  showtimes: string[];
  description: string;
  _id: Types.ObjectId;
  status: "active" | "inactive";
  __v: number;
}
