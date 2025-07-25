import { statusCode } from "../helper/statusCode";
import { IScreen } from "../interfaces/screenInterface";
import { IShow } from "../interfaces/showInterfaces";
import { getAllTheater,getScreen,getActiveShows,getScreenDetials,seatFetchByScreenId ,bookTicket} from "../services/clientService";
import { Request } from "express";
import { CreateSeatRequest } from "../interfaces/seatInterface";
import { IBook } from "../interfaces/bookInterface";

export const getListOfTheaterController=async()=>{
    try {
        const result= await getAllTheater();
return {
      statusCode: statusCode.OK,
      message: "Theater fetching  Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
}


export const  getScreenController=async(req:Request<{},{},IScreen>)=>{
    try {
        const Data=req.body;
        const result=await getScreen(Data);
        return {
            statusCode:statusCode.OK,
            message:"Screen fetching  Successfully",
            data:result,
        };
        
    } catch (error: any) {
       return{
         statusCode:statusCode.BAD_REQUEST,
        message:error.message,
        data:null
       }
    }
}


export const getActiveShowController=async(req:Request<{},{},IShow>)=>{
    try {
        const Data=req.body;
        const userId=(req as any).user._id
        Data.userId=userId
        const result=await getActiveShows(Data);
        return {
            statusCode:statusCode.OK,
            message:"Show fetching  Successfully",
            data:result,
        };
        
    } catch (error: any) {
       return{
         statusCode:statusCode.BAD_REQUEST,
        message:error.message,
        data:null
       }
    }
}

export const getScreenDetailsController=async(req:Request<{},{},IShow>)=>{
  try {
    const Data=req.body;
    const result=await getScreenDetials(Data);
    return {
        statusCode:statusCode.OK,
        message:"Screen fetching  Successfully",
        data:result,
    };
    
  } catch (error: any) {
  return{
    statusCode:statusCode.BAD_REQUEST,
    message:error.message,
    data:null
  }
}
}

export const fetchSeatController=async(req:Request<{},{},CreateSeatRequest>)=>{
  try{
    const Data=req.body;
    const result=await seatFetchByScreenId(Data);
    return {
      statusCode: statusCode.OK,
      message: "Seats fetching  Successfully",
      data: result,
    };
  }catch(error :any){
    return {
      statusCode: 400,
      message: error.message,
      data: null,
    }
  }
}

export const bookTicketController=async(req:Request<{},{},IBook>)=>{
  try{
    const Data=req.body;
    const result=await bookTicket(Data);
    return {
      statusCode: statusCode.OK,
      message: "ticket booking  Successfully",
      data: result,
    };
  }catch(error :any){
    return {
      statusCode: 400,
      message: error.message,
      data: null,
    }
  }}
