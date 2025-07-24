import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../interfaces/commonInterface";
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
        return res.status(401).json({message:"Unauthorized2"});
    }
}

export const authorizeRoles=(role:string[])=>{
    return(req:Request,res:Response,next:NextFunction)=>{
        const user=(req as any).user;
        if(!role.includes(user.role)){
            return res.status(403).json({message:"Access denied :unauthorized"});
        }
        next(); 
    }
}

//route of the auth roles
//router.post("/screen",authuser,authorizeRoles(["admin"]),response(createScreen));