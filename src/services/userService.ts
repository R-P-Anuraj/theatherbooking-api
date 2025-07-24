import { IUser } from "../interfaces/userInterface";
import { userModel } from "../models/userModels";
import { theaterModel } from "../models/theaterModel";
import { ITheater } from "../interfaces/theaterInterface";
import Jwt from "jsonwebtoken";
import {
  userFindByEmail,
  hashPassword,
  comparePassword,
} from "../helper/userHelper";
export const createUser = async (Data: IUser) => {
  try {
    const { name, email, password, phoneNo, role, able } = Data;
    const emailExists = await userFindByEmail(email);
    if (emailExists) {
      throw new Error("Email already exists");
    }
    const phoneExists = await userModel.findOne({ phoneNo });
    if (phoneExists) {
      throw new Error("Phone number already exists");
    }
    const hashedPassword = await hashPassword(password);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      phoneNo,
      role,
      able,
    });
    const result = await user.save();
    return {
      result,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginUser = async (Data: IUser) => {
  try {
    const { email, password } = Data;
    const user = await userFindByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }
    const token = Jwt.sign(
      { id:user._id,role:user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return {
      token: token,
      role: user.role,
    };
  } catch (error: any) {
    throw error;
  }
};

export const getProfile=async(id:string)=>{
    try{
        const result=await userModel.findById(id);
        return result;
    }catch(error:any){
        throw error;
    }
}

