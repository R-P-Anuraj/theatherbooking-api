import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../interfaces/jwtInterfaces/jwtInterfece";
export const authUser=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith("Bearer ")){
            res.status(401).json({message:"Unauthorized"});
             return
        }
        const token=authHeader.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET as string)as jwtPayload;
        (req as any).user=decoded;
        next();
    }catch(error){
        return res.status(401).json({message:"Unauthorized"});
    }
}