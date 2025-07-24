import { Request } from "express";
import { userModel } from "../models/userModels";
import { IUser } from "../interfaces/userInterface";
import { ITheater } from "../interfaces/theaterInterface";
import { createUser,loginUser,getProfile } from "../services/userService";
import { statusCode } from "../helper/statusCode";
import { ControllerResponse } from "../interfaces/commonInterface";
// import { createTheater } from "../services/userService";
import { get } from "http";
export const createUserController=async(req:Request<{},{},IUser>):Promise<ControllerResponse>=>{
    try{
        const Data=req.body;
        const result=await createUser(Data)
        return {
            statusCode:statusCode.OK,
            message:"User Created Successfully",
            data:result
        }
    }catch(error:any){
        return {
            statusCode:statusCode.BAD_REQUEST,
            message:error.message,
            data:null
        }
    }
}

export const loginUserController=async(req:Request<{},{},IUser>)=>{
    try{
        const Data=req.body
        const result=await loginUser(Data)
        return {
            statusCode:statusCode.OK,
            message:"User logged in successfully",
            data:result
        }
    }
    catch(error:any){
        return {
            statusCode:statusCode.BAD_REQUEST,
            message:error.message,
            data:null
        }
    }
}

export const getUserController=async(req:Request<{},{},IUser>)=>{
    try{
        const {id}=(req as any).user
        const result=await getProfile(id);
        return {
            statusCode:statusCode.OK,
            message:"User found successfully",
            data:result
        }

    }catch(error:any){
        return {
            statusCode:statusCode.BAD_REQUEST,
            message:error.message,
            data:null
        }
    }
}

