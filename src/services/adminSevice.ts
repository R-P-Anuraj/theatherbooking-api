import { theaterModel } from "../models/theaterModel";
import { ITheater } from "../interfaces/theaterInterface";
import { IScreen } from "../interfaces/screenInterface";
import { screenModel } from "../models/screenModel";
import { CreateSeatRequest } from "../interfaces/seatInterface";
import { seatModel } from "../models/seatModel";
import { ISeat } from "../../src2/src/interfaces/theaterInterfaces/seatInterfaces";
import { IMovie } from "../interfaces/movieInnterface";
import { movieModel } from "../models/movieModel";
import { IShow } from "../interfaces/showInterfaces";
import { showModel } from "../models/showModel";
import { log } from "node:console";
import mongoose, { Types } from "mongoose";
export const createTheater = async (Data: ITheater) => {
  try {
    // const Existtheater=await theaterModel.find({email:Data.email});
    // if(Existtheater.length>0){
    //     throw new Error("Theater already exists");
    // }
    // const phoneExist=await theaterModel.find({phone:Data.phone});
    // if(phoneExist.length>0){
    //     throw new Error("Phone number already exists");
    // }

    const theater = new theaterModel(Data);
    const result = await theater.save();
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const getAllTheater = async (adminId: ITheater) => {
  try {
    const result = await theaterModel.find({ adminId: adminId });
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const createScreen = async (Data: IScreen) => {
  try {
    const screen = new screenModel(Data);
    const result = await screen.save();
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getScreen = async (Data: IScreen) => {
  try {
    const { theaterId } = Data;

    const result = await screenModel.find({ theaterId: theaterId });
    if (!result) {
      throw new Error("Screen not found");
    }
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const createOrUpdateSeats = async (data: CreateSeatRequest) => {
  try {
    const { screenId, sliver, gold, platinum, recliner, price } = data;
    const screen = await screenModel.findById(screenId);
    if (!screen) throw new Error("Screen not found");

    const seatTypes = [
      { type: "sliver", count: sliver, price: price.sliverP },
      { type: "gold", count: gold, price: price.goldP },
      { type: "platinum", count: platinum, price: price.platinumP },
      { type: "recliner", count: recliner, price: price.reclinerP },
    ];

    for (const { type, count, price: seatPrice } of seatTypes) {
      if (count != null && count >= 0) {
        const currentSeats = await seatModel
          .find({ screenId, seatType: type })
          .sort({ seatNumber: 1 });
        const currentCount = currentSeats.length;

        // 1. If new count > current count → ADD seats
        if (count > currentCount) {
          for (let i = currentCount; i < count; i++) {
            await new seatModel({
              screenId,
              seatNumber: i + 1,
              seatType: type,
              price: seatPrice,
              booked: false,
            }).save();
          }
        }

        // 2. If new count < current count → REMOVE extra seats from the end
        if (count < currentCount) {
          for (let i = currentCount - 1; i >= count; i--) {
            await seatModel.findOneAndDelete({
              screenId,
              seatNumber: i + 1,
              seatType: type,
            });
          }
        }

        // 3. Update price of all remaining seats of this type
        await seatModel.updateMany(
          { screenId, seatType: type },
          { $set: { price: seatPrice } }
        );
      }
    }
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const seatFetchByScreenId = async (Data: CreateSeatRequest) => {
  try {
    const result = await seatModel.find({ screenId: Data.screenId });
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const createMovie = async (Data: IMovie) => {
  try {
    const Existmovie = await movieModel.find({ moviename: Data.moviename ,theaterId:Data.theaterId})
    if (Existmovie.length > 0) {
      throw new Error("Movie already exists");
    };
    const movie = new movieModel(Data);
    const result = await movie.save();
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const getMovies = async () => {
  try {
    const movie = await movieModel.find({ status: "active" });
    const result = movie;
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const createShow = async (Data: IShow) => {
  try {
    // const screen = await screenModel.findOne({
    //   _id: Data.screenId,
    //   showtimes: Data.showtime,
    // });
    // if (!screen) {
    //   throw new Error("this time not available in this screen");
    // }
  
    const showExisting = await showModel.find({
      screenId: Data.screenId,
      showtime: Data.showtime,
      status: "active",
    });
    // console.log(showExisting);

    if (showExisting.length > 0) {
      // if (showExisting[0].movieId.toString() === Data.movieId.toString()) {
      //   throw new Error("Show already exists");
      // }
      const changeOldshow = await showModel.updateOne(
        { screenId: Data.screenId, showtime: Data.showtime, status: "active" },
        { $set: { status: "inactive", inactiveAt: Date.now() } }
      );
      console.log(`changeOldshow______${changeOldshow}`);
    }

    const show = new showModel(Data);
    const result = await show.save();
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const getActiveShows = async (Data: IShow) => {
  try {
    const { screenId } = Data;
    console.log(screenId,"screenId");
    
    const result=await showModel.aggregate([
      { $match: { screenId: new mongoose.Types.ObjectId(screenId), status: "active" } },
      {
        $lookup:{
          from:"movies",
          localField:"movieId",
          foreignField:"_id",
          as:"movieinfo"
        }
      },
     
      {
        $unwind:"$movieinfo"
      },

      {
        $lookup:{
          from:"screens",
          localField:"screenId",
          foreignField:"_id",
          as:"screeninfo"
        }
      },
      {
        $unwind:"$screeninfo"
      },{
        $lookup:{
          from:"theaters",
          localField:"theaterId",
          foreignField:"_id",
          as:"theaterinfo"
        }
      },{
        $unwind:"$theaterinfo"
      }
      ,
      {
        $project:{
          movieId:1,
          screenId:1,
          showtime:1,
          status:1,
          movieName:"$movieinfo.moviename",
          screenNum:"$screeninfo.screen_num",
          theaterName:"$theaterinfo.name",
          language:"$movieinfo.language",
          genre:"$movieinfo.genre",
          rating:"$movieinfo.rating",
          duration:"$movieinfo.duration",
          theaterId:"$theaterinfo._id",
          _id:1,
        }
      },{
        $group:{
          _id:1,
          showId:{$first:"$_id"},
          movieId:{$first:"$movieId"},
          screenId:{$first:"$screenId"},
          showtime:{$push:"$showtime"},
          status:{$first:"$status"},
          movieName:{$first:"$movieName"},
          screenNum:{$first:"$screenNum"},
          theaterName:{$first:"$theaterName"},
          language:{$first:"$language"},
          genre:{$first:"$genre"},
          rating:{$first:"$rating"},
          duration:{$first:"$duration"},
          theaterId:{$first:"$theaterId"},
        }
      }
    ]).exec()
 console.log(result)
    return result;
    

//     const shows = await showModel
//       .find({ screenId: screenId, status: "active" })
//       .populate({
//         path: "screenId",
//         select: "screen_num theaterId",
//       })
//       .populate({
//         path: "movieId",
//         select: "moviename duration language genre rating",
//       })
//       .sort({ showtime: 1 });
//     const activeShows = shows.filter((show) =>{ const movie=show.movieId as any;
//     return show?.status === "active"})
// .map((show)=>{
//   const movie=show.movieId as any;
//   const screen=show.screenId as any;

//   return{
//     movieId:movie._id,
//     movieName:movie.moviename,
//     screenId:screen._id,
//     screenNum:screen.screen_num,
//     showtime:show.showtime,
//     duration:movie.duration,
//     language:movie.language,
//     genre:movie.genre,
//     rating:movie.rating,
//     status:show.status,

//   }
// })
//     // const result = await showModel.find({screenId:screenId,status:"active"});
//     return activeShows;
  } catch (error: any) {
    throw error;
  }
};
