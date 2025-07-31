import { Types } from "mongoose";

export interface IReport {
    screenId?: string;
  movieId?: string;
  showId?: string;
  userId?: string;
  fromDate?: Date;
  toDate?: Date;
  seatType?: string;
  seatNumber?: string;
  used?: boolean;
  status?: "active" | "inactive";
  seatId?: string;
  moviename?: string;
  username?: string;
    
}