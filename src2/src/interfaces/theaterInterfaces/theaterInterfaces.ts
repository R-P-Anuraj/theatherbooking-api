import { Types } from "mongoose";

export interface ITheater {
  name: string;
  address: string;
  phone: number;
  email: string;
  password: string;
  dist: string;
  able: boolean;
  status: string;
  pincode: number;
}

export interface ITheaterProfile {
  name: string;
  address: string;
  password: string;
  phone: number;
  email: string;
  dist: string;
  // screens: number;
  able: boolean;
  status: string;
  pincode: number;
  _id: Types.ObjectId;
  //  _v: number
}
