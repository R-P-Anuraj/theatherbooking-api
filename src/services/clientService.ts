import { screenModel } from "../models/screenModel";
import { theaterModel } from "../models/theaterModel";
import { IScreen } from "../interfaces/screenInterface";
import { IShow } from "../interfaces/showInterfaces";
import { showModel } from "../models/showModel";
import { CreateSeatRequest } from "../interfaces/seatInterface";
import { seatModel } from "../models/seatModel";
import mongoose from "mongoose";
import { IBook } from "../interfaces/bookInterface";
import { bookModel } from "../models/bookModel";
import { stat } from "fs";
export const getAllTheater = () => {
  try {
    const result = theaterModel.find({});
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const getScreen = async (Data: IScreen) => {
  try {
    const result = await screenModel.find({ theaterId: Data.theaterId });
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const getActiveShows = async (Data: IShow) => {
  try {
    const { theaterId } = Data;
    const result = await showModel.aggregate([
      {
        $match: {
          theaterId: new mongoose.Types.ObjectId(theaterId),
          status: "active",
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movieinfo",
        },
      },
      {
        $unwind: "$movieinfo",
      },
      {
        $project: {
          
          showtime: 1,
          movieName: "$movieinfo.moviename",
          language: "$movieinfo.language",
          genre: "$movieinfo.genre",
          rating: "$movieinfo.rating",
          duration: "$movieinfo.duration",
          movieId: "$movieinfo._id",
          releaseDate: "$movieinfo.releaseDate",
          showEndDate:1,
         
        },
      },
      {
    $group: {
      _id: "$movieId",//movie id
       movieId: { $first: "$movieId" },
      movieName: { $first: "$movieName" },
      language: { $first: "$language" },
      genre: { $first: "$genre" },
      rating: { $first: "$rating" },
      duration: { $first: "$duration" },
      showtimes: { $push: "$showtime" },
      releaseDate: { $first: "$releaseDate" },
      showEndDate: { $first: "$showEndDate" },
    }
  }
    ]).exec();
    return result;
  } catch (error) {
    throw error;
  }
};

export const getScreenDetials = async (Data: IShow) => {
  try {
    const {movieId}=Data
    if(!movieId) throw new Error("movieId is required")
      const mov=await showModel.find({movieId})
    console.log(mov,"mov");
    
    const result=await showModel.aggregate([
      {
        $match: {
          movieId: new mongoose.Types.ObjectId(movieId),
          status: "active",
        },
      },
      {
        $lookup: {
          from: "screens",
          localField: "screenId",
          foreignField: "_id",
          as: "screeninfo",
        }
      },{
        $unwind:"$screeninfo"
      },{
        $project: {
           movieinfo: 1,
          showtime: 1,
          screenNum: "$screeninfo.screen_num",
          screenId: "$screeninfo._id",
          descripition: "$screeninfo.description",
          _id:1
        },
      },
      // {
      //   $group: {
      //     _id: "$screenId",
      //     screenNum: { $first: "$screenNum" },
      //     descripition: { $first: "$descripition" },
      //     showtimes: { $push: "$showtime" },
      //     showId: { $push: "$_id" },
      //   }
      // }
    ]).sort({screenNum:1}).exec();
    if(result.length==0) throw new Error("No shows found")
    return result;
  } catch (error: any) {
    throw error;
  }
};


export const seatFetchByScreenId = async (Data: CreateSeatRequest) => {
  try {
    const result = await seatModel.find({ screenId: Data.screenId });
    if(result.length==0) throw new Error("No seats found" )
    return result;
  } catch (error: any) {
    throw error;
  }
};


export const bookTicket = async (Data: IBook) => {
  try {
    console.log(Data);
    const {seats,showId,userId,BookedDate}=Data
    // const error=[]
    // for(let i=0;i<seats.length;i++){
    //   const seat=seats[i]
    //   const book=await bookModel.find({seatId:seat})
    //   if(book!=null){
    //     error.push({seatId:seat})
    //   }
    // }
    // if(error.length>0){
    //   throw new Error(`${JSON.stringify(error)} this seats is already booked`)
    // }
    for(let i=0;i<seats.length;i++){
      const seat=seats[i]
      await bookModel.create({seatId:seat,showId,userId,BookedDate})
    }
    const result=await bookModel.find({showId,userId,BookedDate})
    return result
    
  } catch (error: any) {
    throw error;
  }
};