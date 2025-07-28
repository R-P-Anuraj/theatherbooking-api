import { Types } from "mongoose";

// export interface ISeat {
//   screenId: Types.ObjectId;
//   seatNumber: number;
//   seatType: "sliver" | "gold" | "platinum" | "recliner";
//   price: number;
//   booked: boolean;
// }

export interface CreateSeatRequest {
  screenId: Types.ObjectId;
  seatNumber?: number;
  seatType?: "sliver" | "gold" | "platinum" | "recliner";
  // booked?: boolean;
  sliver: number;
  gold: number;
  platinum: number;
  recliner: number; 
  price: SeatConfigP;
  // showId:Types.ObjectId;
  // BookedDate:Date
}
// export interface SeatTypeCongig{

// }
export interface SeatConfigP {
  sliverP: number;
  goldP: number;
  platinumP: number;
  reclinerP: number;
}

export interface ISeat {
  screenId: Types.ObjectId;
  seatNumber: number;
  seatType: "sliver" | "gold" | "platinum" | "recliner";
  price: number;
  booked: boolean;
}
