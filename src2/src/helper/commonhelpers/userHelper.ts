import { promises } from "dns";
import { ITheaterProfile } from "../../interfaces/theaterInterfaces/theaterInterfaces";
import { theaterModel } from "../../models/theaterModels/theaterModel";
import bcrypt from "bcrypt"
export const findTheaterByEmail = async (
  email: string
): Promise<ITheaterProfile | null> => {
  
  const theater = await theaterModel.findOne({ email: email });
  console.log('2345678')
  console.log(theater)
  return theater;
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

export const generateAuthToken = async (theater: ITheaterProfile) => {
  
};