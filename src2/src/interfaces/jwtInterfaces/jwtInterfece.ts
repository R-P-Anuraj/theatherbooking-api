import { Types,ObjectId } from "mongoose";
export interface jwtPayload {
  id: ObjectId;
  email: string;
}

