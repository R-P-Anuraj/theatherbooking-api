import { Types } from "mongoose";
export interface IBook{
    screenId: Types.ObjectId;
    movieId: Types.ObjectId;
    showId: Types.ObjectId;
    userId: Types.ObjectId;
    seatId: Types.ObjectId;
    bookedAt: Date;
    status: "active" | "inactive";
    BookedDate: Date;
    _id: Types.ObjectId
    showTime: string
    _v: number
    seats:[Types.ObjectId]
    ticketToken:string;
    used:boolean
    booking_id:string
    ticketId:string
}

export enum Modifier{
    AM="am",
    PM="pm"
}