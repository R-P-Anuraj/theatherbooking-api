import { Types } from "mongoose";

export interface IMovie {
    moviename: string;
    description: string;
    releaseDate: Date;
    genre: string;
    rating: number;
    duration: string;
    _id: Types.ObjectId;
    __v: number;
    language:string;
    status: "active" | "inactive";
    theaterId: Types.ObjectId
    movieId: Types.ObjectId
}