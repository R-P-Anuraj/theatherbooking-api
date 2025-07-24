import { Types,ObjectId } from "mongoose";
export interface ControllerResponse {
  statusCode: number;
  message: string;
  data?: any;
}

export interface jwtPayload {
  id: Types.ObjectId;
  email: string;
}

