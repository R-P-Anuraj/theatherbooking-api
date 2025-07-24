import { IUser } from "../interfaces/userInterface";
import { userModel } from "../models/userModels";
import bcrypt from "bcrypt";
export const userFindByEmail = async (email: string) => {
    return await userModel.findOne({ email });
};

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 11);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};