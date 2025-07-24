import { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phoneNo:number;
    password: string;
    role: "admin" | "client";
    able: boolean;
    _v: number
    id:string
}
