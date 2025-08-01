import { theaterModel } from "../models/theaterModel";
import { ITheater } from "../interfaces/theaterInterface";
import { IScreen } from "../interfaces/screenInterface";
import { screenModel } from "../models/screenModel";
import { CreateSeatRequest } from "../interfaces/seatInterface";
import { seatModel } from "../models/seatModel";
// import { ISeat } from "../../src2/src/interfaces/theaterInterfaces/seatInterfaces";
import { IMovie } from "../interfaces/movieInnterface";
import { ISeat } from "../interfaces/seatInterface";
import { movieModel } from "../models/movieModel";
import { IShow } from "../interfaces/showInterfaces";
import { showModel } from "../models/showModel";
import { log } from "node:console";
import mongoose, { Types } from "mongoose";
import { bookModel } from "../models/bookModel";
import { IBook, Modifier } from "../interfaces/bookInterface";
import { IReport } from "../interfaces/reportInterface";
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
    if (result.length == 0) throw new Error("No seats found");
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const createMovie = async (Data: IMovie) => {
  try {
    const Existmovie = await movieModel.find({
      moviename: Data.moviename,
      theaterId: Data.theaterId,
    });
    if (Existmovie.length > 0) {
      throw new Error("Movie already exists");
    }
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
    console.log(screenId, "screenId");

    const result = await showModel
      .aggregate([
        {
          $match: {
            screenId: new mongoose.Types.ObjectId(screenId),
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
          $lookup: {
            from: "screens",
            localField: "screenId",
            foreignField: "_id",
            as: "screeninfo",
          },
        },
        {
          $unwind: "$screeninfo",
        },
        {
          $lookup: {
            from: "theaters",
            localField: "theaterId",
            foreignField: "_id",
            as: "theaterinfo",
          },
        },
        {
          $unwind: "$theaterinfo",
        },
        {
          $project: {
            movieId: 1,
            screenId: 1,
            showtime: 1,
            status: 1,
            movieName: "$movieinfo.moviename",
            screenNum: "$screeninfo.screen_num",
            theaterName: "$theaterinfo.name",
            language: "$movieinfo.language",
            genre: "$movieinfo.genre",
            rating: "$movieinfo.rating",
            duration: "$movieinfo.duration",
            theaterId: "$theaterinfo._id",
            _id: 1,
          },
        },
        // ,{
        //   $group:{
        //     _id:1,
        //     showId:{$first:"$_id"},
        //     movieId:{$first:"$movieId"},
        //     screenId:{$first:"$screenId"},
        //     showtime:{$push:"$showtime"},
        //     status:{$first:"$status"},
        //     movieName:{$first:"$movieName"},
        //     screenNum:{$first:"$screenNum"},
        //     theaterName:{$first:"$theaterName"},
        //     language:{$first:"$language"},
        //     genre:{$first:"$genre"},
        //     rating:{$first:"$rating"},
        //     duration:{$first:"$duration"},
        //     theaterId:{$first:"$theaterId"},
        //   }
        // }
      ])
      .exec();
    console.log(result);
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

export const changeScreenStatus = async (Data: IScreen) => {
  try {
    const result = await screenModel.updateOne(
      { _id: Data.screenId },
      { $set: { status: Data.status } }
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const changeShowStatus = async (Data: IShow) => {
  try {
    const result = await showModel.updateOne(
      { _id: Data.showId },
      { $set: { status: Data.status } }
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const changeMovieStatus = async (Data: IMovie) => {
  try {
    const result = await movieModel.updateOne(
      { _id: Data.movieId },
      { $set: { status: Data.status } }
    );
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const verifyToken = async (Data: IBook) => {
  try {
    const { ticketToken } = Data;
    const booking: any = await bookModel.findOne({ ticketToken });
    if (!booking) {
      return {
        success: false,
        status: "not found",
        message: "Ticket not found",
      };
    }
    if (booking.used) {
      return {
        success: false,
        status: "used",
        message: "Ticket already used",
      };
    }
    const showed = await showModel.findById(booking.showId);
    if (!showed) {
      return {
        success: false,
        status: "not found",
        message: "Show not found",
      };
    }
    //  try{

    //  }catch(error){

    //  }
    const bookedDate: Date = booking.BookedDate;
    const showTime: string = showed.showtime;
    console.log(bookedDate, showTime);

    const now = new Date();

    const bookedDateStr = bookedDate.toString().split("T")[0];
    const todayStr = now.toString().split("T")[0];
    const isBookedDateToday = bookedDateStr === todayStr;

    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();

    const [time, modifier] = showTime.split(" ");
    let [showHours, showMinutes] = time.split(":").map(Number);
    if (modifier === Modifier.PM && showHours !== 12) {
      showHours += 12;
    }
    if (modifier === Modifier.AM && showHours === 12) {
      showHours = 0;
    }
    const isShowTimePassed =
      nowHours > showHours ||
      (nowHours === showHours && nowMinutes > showMinutes);
    if (isBookedDateToday && isShowTimePassed) {
      return {
        success: false,
        status: "expired",
        message: "Ticket expired",
      };
    }
    if (isBookedDateToday) {
      booking.used = true;
      await booking.save();
      return {
        success: true,
        status: "valid",
        message: "Ticket is valid",
      };
    }
    return {
      success: false,
      status: "future",
      message: "Ticket for upcoming day",
    };
  } catch (error: any) {
    throw error;
  }
};


export const getReport = async (Data:IReport) => {
  try {
    if (!Data.fromDate || !Data.toDate) {
      throw new Error("fromDate and toDate are required");
    }
    const startDate=new Date(Data.fromDate)
    const endDate=new Date(Data.toDate)
    // const startDate = new Date(Data.fromDate.toISOString().split("T")[0] + "T00:00:00.000Z");
    // const endDate = new Date(Data.toDate.toISOString().split("T")[0] + "T23:59:59.000Z");

    const matchStage: any = {
      BookedDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    // Dynamically add filters
    if (Data.status) matchStage.status = Data.status;
    if (typeof Data.used === "boolean") matchStage.used = Data.used;
    if (Data.seatType) matchStage.seatType = Data.seatType;
    if (Data.seatNumber) matchStage.seatNumber = Data.seatNumber;

    if (Data.userId && mongoose.Types.ObjectId.isValid(Data.userId))
      matchStage.userId = new mongoose.Types.ObjectId(Data.userId);

    if (Data.seatId && mongoose.Types.ObjectId.isValid(Data.seatId))
      matchStage.seatId = new mongoose.Types.ObjectId(Data.seatId);

    if (Data.showId && mongoose.Types.ObjectId.isValid(Data.showId))
      matchStage.showId = new mongoose.Types.ObjectId(Data.showId);

    if (Data.movieId && mongoose.Types.ObjectId.isValid(Data.movieId))
      matchStage.movieId = new mongoose.Types.ObjectId(Data.movieId);

    if (Data.screenId && mongoose.Types.ObjectId.isValid(Data.screenId))
      matchStage.screenId = new mongoose.Types.ObjectId(Data.screenId);

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "seats",
          localField: "seatId",
          foreignField: "_id",
          as: "seat",
        },
      },
      { $unwind: "$seat" },
      {
        $lookup: {
          from: "shows",
          localField: "showId",
          foreignField: "_id",
          as: "show",
        },
      },
      { $unwind: "$show" },
      {
        $lookup: {
          from: "movies",
          localField: "show.movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $lookup: {
          from: "screens",
          localField: "show.screenId",
          foreignField: "_id",
          as: "screen",
        },
      },
      { $unwind: "$screen" },
    ];

    // 👇 Add optional text filters (like moviename, username)
    const textMatch: any = {};
    if (Data.moviename) {
      textMatch["movie.moviename"] = { $regex: Data.moviename, $options: "i" };
    }
    if (Data.userId) {
      textMatch["user._id"] = { $regex: Data.username, $options: "i" };
    }
    if(Data.movieId) {
      textMatch["movie._id"] = { $regex: Data.movieId, $options: "i" };
    }
    if(Data.screenId) {
      textMatch["screen._id"] = { $regex: Data.screenId, $options: "i" };
    }
    if(Data.showId) {
      textMatch["show._id"] = { $regex: Data.showId, $options: "i" };
    }
    if(Data.seatId) {
      textMatch["seat._id"] = { $regex: Data.seatId, $options: "i" };
    }

    if (Object.keys(textMatch).length > 0) {
      pipeline.push({ $match: textMatch });
    }

    pipeline.push({
      $project: {
        _id: 0,
        username: "$user.name",
        userPhone: "$user.phoneNo",
        userEmail: "$user.email",
        bookedStatus: "$status",
        showDate: "$BookedDate",
        ticketUsed: "$used",
        bookId: "$booking_id",
        ticketId: "$ticketId",
        bookedAt: "$bookedAt",
        seatType: "$seat.seatType",
        seatNum: "$seat.seatNumber",
        price: "$seat.price",
        showTime: "$show.showtime",
        showenddate: "$show.showEndDate",
        moviename: "$movie.moviename",
        moviedescription: "$movie.description",
        movierelasedate: "$movie.releaseDate",
        genre: "$movie.genre",
        rating: "$movie.rating",
        duration: "$movie.duration",
        language: "$movie.language",
      },
    });

    const result = await bookModel.aggregate(pipeline);
    return result;
  } catch (error: any) {
    throw error;
  }
};


// export const getReport = async (filter: {
//   screenId?: string;
//   movieId?: string;
//   showId?: string;
//   userId?: string;
//   fromDate?: Date;
//   toDate?: Date;
//   seatType?: string;
//   seatNumber?: string;
//   used?: boolean;
//   status?: "active" | "inactive"
//   seatId?:string
// }) => {
//   try {
//     if( !filter.fromDate || !filter.toDate){
//       throw new Error("fromDate and toDate are required");
//     }
//     const startDate=new Date(filter.fromDate.toISOString().split("T")[0]+"T00:00:00.000Z");
//     const endDate=new Date(filter.toDate.toISOString().split("T")[0]+"T23:59:59.000Z");

    
//     const {screenId,
//       movieId,
//       showId,
//       userId,
//       seatType,
//       seatNumber,
//       used,
//       status, 
//       seatId
//       } = filter;

//       const matchStage:any={
//         BookedDate: {
//           $gte: startDate,
//           $lte: endDate,
//         }
//       }
//       if(status){
//         matchStage.status=status;
//       }
//       if(typeof used === "boolean"){
//         matchStage.used=used;
//       }

//       if(screenId&& mongoose.Types.ObjectId.isValid(screenId)){
//         matchStage.screenId=new mongoose.Types.ObjectId(screenId);
//       }

//       if(showId&& mongoose.Types.ObjectId.isValid(showId)){
//         matchStage.showId=new mongoose.Types.ObjectId(showId);
//       }

//       if(movieId&& mongoose.Types.ObjectId.isValid(movieId)){
//         matchStage.movieId=new mongoose.Types.ObjectId(movieId);
//       }

//       if(userId&& mongoose.Types.ObjectId.isValid(userId)){
//         matchStage.userId=new mongoose.Types.ObjectId(userId);
//       }

//       if(seatType){
//         matchStage.seatType=seatType;
//       }

//       if(seatNumber){
//         matchStage.seatNumber=seatNumber;
//       }
//       if(seatId&& mongoose.Types.ObjectId.isValid(seatId)){
//         matchStage.seatId=new mongoose.Types.ObjectId(seatId);
//       }

//       const pipeline:any=[
//         {$match:matchStage},
//           {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       { $unwind: "$user" },
//       {
//         $lookup: {
//           from: "seats",
//           localField: "seatId",
//           foreignField: "_id",
//           as: "seat",
//         },
//       },
//       { $unwind: "$seat" },
//       {
//         $lookup: {
//           from: "shows",
//           localField: "showId",
//           foreignField: "_id",
//           as: "show",
//         },
//       },
//       { $unwind: "$show" },
//       {
//         $lookup: {
//           from: "movies",
//           localField: "show.movieId",
//           foreignField: "_id",
//           as: "movie",
//         },
//       },
//       { $unwind: "$movie" },
//       {
//         $lookup: {
//           from: "screens",
//           localField: "show.screenId",
//           foreignField: "_id",
//           as: "screen",
//         },
//       },
//       { $unwind: "$screen" },
//       ...(movieId&& mongoose.Types.ObjectId.isValid(movieId)?
//       [{$match:{"movie._id":new mongoose.Types.ObjectId(movieId)}}]:[]
//       ),
//       ...(screenId&& mongoose.Types.ObjectId.isValid(screenId)?
//       [{$match:{"screen._id":new mongoose.Types.ObjectId(screenId)}}]:[]
//       ),
//       ...(showId&& mongoose.Types.ObjectId.isValid(showId)?
//       [{$match:{"show._id":new mongoose.Types.ObjectId(showId)}}]:[]
//       ),
//       ...(userId&& mongoose.Types.ObjectId.isValid(userId)?
//       [{$match:{"user._id":new mongoose.Types.ObjectId(userId)}}]:[]
//       ),
//       ...(seatId&& mongoose.Types.ObjectId.isValid(seatId)?
//       [{$match:{"seat._id":new mongoose.Types.ObjectId(seatId)}}]:[]
//       ),
     
//        {
//         $project: {
//           _id: 0,
//           username: "$user.name",
//           userPhone: "$user.phoneNo",
//           userEmail: "$user.email",
//           bookedStatus: "$status",
//           showDate: "$BookedDate",
//           ticketUsed: "$used",
//           bookId: "$booking_id",
//           ticketId: "$ticketId",
//           bookedAt: "$bookedAt",
//           seatType: "$seat.seatType",
//           seatNum: "$seat.seatNumber",
//           price: "$seat.price",
//           showTime: "$show.showtime",
//           showenddate: "$show.showEndDate",
//           moviename: "$movie.moviename",
//           moviedescription: "$movie.description",
//           movierelasedate: "$movie.releaseDate",
//           genre: "$movie.genre",
//           rating: "$movie.rating",
//           duration: "$movie.duration",
//           language: "$movie.language",
//         },
//       },
      
//       ] 
//       const result = await bookModel.aggregate(pipeline);
//       return result;
//     // const result = await bookModel.aggregate([
//     //   {
//     //     $match: {
//     //       Data,
//     //       // BookedDate: {
//     //       //   $lte: ISODate("2025-08-31T00:00:00.000Z"),
//     //       //   $gte: ISODate("2025-07-31T00:00:00.000Z"),
//     //       // },
//     //     },
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "users",
//     //       localField: "userId",
//     //       foreignField: "_id",
//     //       as: "user",
//     //     },
//     //   },
//     //   { $unwind: "$user" },
//     //   {
//     //     $lookup: {
//     //       from: "seats",
//     //       localField: "seatId",
//     //       foreignField: "_id",
//     //       as: "seat",
//     //     },
//     //   },
//     //   { $unwind: "$seat" },
//     //   {
//     //     $lookup: {
//     //       from: "shows",
//     //       localField: "showId",
//     //       foreignField: "_id",
//     //       as: "show",
//     //     },
//     //   },
//     //   { $unwind: "$show" },
//     //   {
//     //     $lookup: {
//     //       from: "movies",
//     //       localField: "show.movieId",
//     //       foreignField: "_id",
//     //       as: "movie",
//     //     },
//     //   },
//     //   { $unwind: "$movie" },
//     //   {
//     //     $lookup: {
//     //       from: "screens",
//     //       localField: "show.screenId",
//     //       foreignField: "_id",
//     //       as: "screen",
//     //     },
//     //   },
//     //   { $unwind: "$screen" },
//     //   {
//     //     $project: {
//     //       _id: 0,
//     //       username: "$user.name",
//     //       userPhone: "$user.phoneNo",
//     //       userEmail: "$user.email",
//     //       bookedStatus: "$status",
//     //       showDate: "$BookedDate",
//     //       ticketUsed: "$used",
//     //       bookId: "$booking_id",
//     //       ticketId: "$ticketId",
//     //       bookedAt: "$bookedAt",
//     //       seatType: "$seat.seatType",
//     //       seatNum: "$seat.seatNumber",
//     //       price: "$seat.price",
//     //       showTime: "$show.showtime",
//     //       showenddate: "$show.showEndDate",
//     //       moviename: "$movie.moviename",
//     //       moviedescription: "$movie.description",
//     //       movierelasedate: "$movie.releaseDate",
//     //       genre: "$movie.genre",
//     //       rating: "$movie.rating",
//     //       duration: "$movie.duration",
//     //       language: "$movie.language",
//     //     },
//     //   },
//     // ]);
//   } catch (error: any) {
//     throw error;
//   }
// };
