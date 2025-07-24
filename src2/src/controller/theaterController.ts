import { Request } from "express";
import { theaterModel } from "../models/theaterModels/theaterModel";
import { ITheater } from "../interfaces/theaterInterfaces/theaterInterfaces";
import { CreateSeatRequest } from "../interfaces/theaterInterfaces/seatInterfaces";
import { statusCode } from "../helper/commonhelpers/statusCode";
import {
  createScreen,
  createTheater,
  loginTheater,
  createOrUpdateSeats,
} from "../services/theaterservices/theaterService";
import { IScreen } from "../interfaces/theaterInterfaces/screenInterfaces";

export const createTheaterController = async (
  req: Request<{}, {}, ITheater>
) => {
  try {
    const Data = req.body;
    console.log(Data);
    const result = await createTheater(Data);
    return {
      statusCode: statusCode.OK,
      message: "Theater Created Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const loginTheaterController = async (
  req: Request<{}, {}, ITheater>
) => {
  try {
    const result = await loginTheater(req.body);
    return {
      statusCode: 200,
      message: "User logged in successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      message: error.message,
      data: null,
    };
  }
};

export const createScreenController = async (req: Request<{}, {}, IScreen>) => {
  try {
    const Data = req.body;
    const { id } = (req as any).user;
    const theaterId = id;
    Data.theaterId = theaterId;
    const result = await createScreen(Data);
    return {
      statusCode: 200,
      message: "Screen created successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      message: error.message,
      data: null,
    };
  }
};

export const createSeatController=async(req:Request<{},{},CreateSeatRequest>)=>{
    try{
        const {screenId,sliver,gold,platinum,recliner,price}=req.body;
        const result=await createOrUpdateSeats({screenId,sliver,gold,platinum,recliner,price});
        return {
          statusCode: 200,
          message: "Seats created successfully",
          data: result,
        };

        
    }catch(error: any) {
        return {
          statusCode: 400,
          message: error.message,
          data: null,
        };
      }
}
