import { Types } from "mongoose";

export interface IShow {
  movieId: Types.ObjectId;
  screenId: Types.ObjectId;
  showtime: string;
  status: "active" | "inactive";
  _id: Types.ObjectId;
  __v: number;
  createdAt: Date;
  showEndDate: Date;
  theaterId: Types.ObjectId;
  getShowtime:[string]
  userId:Types.ObjectId;
}
