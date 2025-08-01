import { screenModel } from "../models/screenModel";
import { theaterModel } from "../models/theaterModel";
import { IScreen } from "../interfaces/screenInterface";
import { IShow } from "../interfaces/showInterfaces";
import { showModel } from "../models/showModel";
import { CreateSeatRequest } from "../interfaces/seatInterface";
import { seatModel } from "../models/seatModel";
import mongoose, { ObjectId } from "mongoose";
import { IBook } from "../interfaces/bookInterface";
import { bookModel } from "../models/bookModel";
import  Jwt  from "jsonwebtoken";
import { Types } from "mongoose";
import { movieModel } from "../models/movieModel";
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

// export const getActiveShows = async (Data: IShow) => {
//   try {
//     const { theaterId } = Data;

//     const result = await showModel
//       .aggregate([
//         {
//           $match: {
//             theaterId: new mongoose.Types.ObjectId(theaterId),
//             status: "active",
//           },
//         },
//         {
//           $lookup: {
//             from: "movies",
//             localField: "movieId",
//             foreignField: "_id",
//             as: "movieinfo",
//           },
//         },
//         {
//           $unwind: "$movieinfo",
//         },
//         {
//           $project: {
//             showtime: 1,
//             movieName: "$movieinfo.moviename",
//             language: "$movieinfo.language",
//             genre: "$movieinfo.genre",
//             rating: "$movieinfo.rating",
//             duration: "$movieinfo.duration",
//             movieId: "$movieinfo._id",
//             releaseDate: "$movieinfo.releaseDate",
//             showEndDate: 1,
//           },
//         },
//         {
//           $group: {
//             _id: "$movieId", //movie id
//             movieId: { $first: "$movieId" },
//             movieName: { $first: "$movieName" },
//             language: { $first: "$language" },
//             genre: { $first: "$genre" },
//             rating: { $first: "$rating" },
//             duration: { $first: "$duration" },
//             showtimes: { $push: "$showtime" },
//             releaseDate: { $first: "$releaseDate" },
//             showEndDate: { $first: "$showEndDate" },
//           },
//         },
//       ])
//       .exec();
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };
export const getActiveShows = async (Data: IShow) => {
  try {
    const { theaterId ,page,limit} = Data;
    const skip = (page - 1) * limit;

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
      { $unwind: "$movieinfo" },
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
          showEndDate: 1,
        },
      },
      // {
      //   $group: {
      //     _id: "$movieId",
      //     movieId: { $first: "$movieId" },
      //     movieName: { $first: "$movieName" },
      //     language: { $first: "$language" },
      //     genre: { $first: "$genre" },
      //     rating: { $first: "$rating" },
      //     duration: { $first: "$duration" },
      //     showtimes: { $push: "$showtime" },
      //     releaseDate: { $first: "$releaseDate" },
      //     showEndDate: { $first: "$showEndDate" },
      //   },
      // },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const total = result[0]?.metadata[0]?.total || 0;
    const data = result[0]?.data || [];

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  } catch (error) {
    throw error;
  }
};


export const getScreenDetials = async (Data: IShow) => {
  try {
    const { movieId } = Data;
    if (!movieId) throw new Error("movieId is required");
    const mov = await showModel.find({ movieId });
    console.log(mov, "mov");

    const result = await showModel
      .aggregate([
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
          },
        },
        {
          $unwind: "$screeninfo",
        },
        {
          $project: {
            movieinfo: 1,
            showtime: 1,
            screenNum: "$screeninfo.screen_num",
            screenId: "$screeninfo._id",
            descripition: "$screeninfo.description",
            _id: 1,
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
      ])
      .sort({ screenNum: 1 })
      .exec();
    if (result.length == 0) throw new Error("No shows found");
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const seatFetchByScreenId = async (Data: CreateSeatRequest) => {
  try {
    const seats = await seatModel.find({ screenId: Data.screenId });
    if (seats.length == 0) throw new Error("No seats found");
    return seats;
  } catch (error: any) {
    throw error;
  }
};

export const fetchSeats = async (data: any) => {
  try {
    const bookedSeats = await bookModel.find({
      showId: data.showId,
      BookedDate: data.BookedDate,
    });
    const show = await showModel.findById(data.showId);
    if (!show) throw new Error("Show not found");
 console.log(show.screenId);
 const screenId=show.screenId;
  

    const bookedSeatIds = bookedSeats.map((seat) => seat.seatId.toString());

    const seats = await seatModel.aggregate([
      {
        $match: {
          screenId:screenId,
        },
      },
      {
        $lookup: {
          from: "screens",
          localField: "screenId",
          foreignField: "_id",
          as: "screen",
        },
      },
      {
        $unwind: "$screen",
      },
      {
        $project: {
          _id: 1,
          seatNumber: 1,
          seatType: 1,
          price: 1,
          screenNum: "$screen.screen_num",
          screenDescription: "$screen.description",
        },
      },
    ]);

    if (seats.length === 0) {
      throw new Error("No seats found");
    }

    const availableSeats = seats.filter((seat) => !bookedSeatIds.includes(seat._id.toString()));
    console.log("availableSeats", availableSeats);
    
    const booked=seats.filter((seat) => bookedSeatIds.includes(seat._id.toString()));
    console.log(seats);

    return { booked, availableSeats };
  } catch (error: any) {
    throw error;
  }
};

// export const bookTicket = async (Data: IBook) => {
//   try {
//     const { seats, showId, userId, BookedDate } = Data;
//     const BookedDated=new Date(Data.BookedDate)
//      const currentDate = new Date();
//     const threeDays = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
//     const show = await showModel.findById(showId);
//     if (!show) throw new Error("Show not found");
//     const showEndDate=show.showEndDate
//     const showEndedDated=new Date(showEndDate)
//     if(showEndedDated<BookedDated){
//       throw new Error("Booking date is not within the allowed range (current date or within 3 days beforell)");
//     }
//     if (BookedDated > threeDays || BookedDated < currentDate) {
//       throw new Error("Booking date is not within the allowed range (current date or within 3 days before)");
//     }
//     var error = [];
//     for (let i = 0; i < seats.length; i++) {
//       const check = await bookModel.find({
//         seatId: seats[i],
//         showId,
//         BookedDate,
//       });
     
      
//       if (check.length > 0) {
//         error.push(seats[i]);
//       }
//     }
//     if (error.length > 0) {
//       throw new Error(`${error} this seats is already booked`);
//     }
//     for (let i = 0; i < seats.length; i++) {
//       const ticketToken=Jwt.sign({
//         seatId:seats[i],
//         showId,
//         userId,
//         BookedDate,
//       },process.env.JWT_SECRET as any,{expiresIn:"5d"})
//       const seat : any= await seatModel.findById(seats[i]);
//       const seatType = seat.seatType;
//       const seatNumber = seat.seatNumber;
//       await bookModel.create({ seatId: seats[i], showId, userId, BookedDate ,ticketToken,booking_id:`Ticket-${BookedDate}-${seatType}-${seatNumber}` });
//     }
    
//     const result = await bookModel.aggregate([
//       {
//         $match: {
//           showId: new mongoose.Types.ObjectId(showId),
//           userId: new mongoose.Types.ObjectId(userId),
//           BookedDate: new Date(BookedDate),
//           status: "active",
//         },
//       },
//       {
//         $lookup: {
//           from: "seats",
//           localField: "seatId",
//           foreignField: "_id",
//           as: "seat",
//         },
//       },
//       {
//         $unwind: "$seat",
//       },
//       {
//         $lookup: {
//           from: "shows",
//           localField: "showId",
//           foreignField: "_id",
//           as: "show",
//         },
//       },
//       {
//         $unwind: "$show",
//       },
//       {
//         $lookup: {
//           from: "screens",
//           localField: "show.screenId",
//           foreignField: "_id",
//           as: "screen",
//         },
//       },
//       {
//         $unwind: "$screen",
//       },
//       {
//         $lookup: {
//           from: "movies",
//           localField: "show.movieId",
//           foreignField: "_id",
//           as: "movie",
//         },
//       },
//       {
//         $unwind: "$movie",
//       },
//       {
//         $project: {
//           _id: 1,
//           BookedDate: 1,
//           ticketToken:1,
//           moviename: "$movie.moviename",
//           movie_description: "$movie.description",
//           duration: "$movie.duration",
//           language: "$movie.language",
//           genre: "$movie.genre",
//           showtime: "$show.showtime",
//           seatnum: "$seat.seatNumber",
//           seatype: "$seat.seatType",
//           seatprice: "$seat.price",
//           screen_num: "$screen.screen_num",
//           screen_description: "$screen.description",
//         },
//       },
//       {
//         $group: {
//           _id: 1,
//           BookedId: { $push: "$_id" },
//           BookedDate: { $first: "$BookedDate" },
//           movie: { $first: "$moviename" },
//           movie_description: { $first: "$movie_description" },
//           duration: { $first: "$duration" },
//           language: { $first: "$language" },
//           genre: { $first: "$genre" },
//           showtime: { $first: "$showtime" },
//           seatnum: { $push: "$seatnum" },
//           seatype: { $first: "$seatype" },
//           price: { $push: "$seatprice" },
//           screen_num: { $first: "$screen_num" },
//           screen_description: { $first: "$screen_description" },
//           totalamount: { $sum: "$seatprice" },
//           ticketToken: { $push: "$ticketToken" },
//         },
//       },
//     ]);

//     return result;
//   } catch (error: any) {
//     throw error;
//   }
// };
export const bookTicket = async (Data: IBook) => {
  try {
    const { seats, showId, userId, BookedDate } = Data;

    const bookingDate = new Date(BookedDate);
    const currentDate = new Date();
    const maxBookingDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Validate show
    const show = await showModel.findById(showId);
    if (!show) throw new Error("Show not found");

    const showEndDate = new Date(show.showEndDate);
    if (bookingDate > maxBookingDate || bookingDate < currentDate) {
      throw new Error("Booking date must be today or within the next 3 days.");
    }
    if (bookingDate > showEndDate) {
      throw new Error("Booking date exceeds the show's end date.");
    }

    // Validate movie
    const movie = await movieModel.findById(show.movieId);
    if (!movie) throw new Error("Movie not found");

    // Check seat availability
    const existingBookings = await bookModel.find({
      seatId: { $in: seats },
      showId,
      BookedDate: bookingDate,
    });

    if (existingBookings.length > 0) {
      const alreadyBookedSeats = existingBookings.map(b => b.seatId).join(", ");
      throw new Error(`These seats are already booked: ${alreadyBookedSeats}`);
    }

    // Book each seat
    await Promise.all(seats.map(async seatId => {
      const seat = await seatModel.findById(seatId);
      if (!seat) throw new Error(`Seat not found: ${seatId}`);

      const generateTicketId = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ticketId = '';
  for (let i = 0; i < length; i++) {
    ticketId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ticketId;
}



      const { seatType, seatNumber } = seat;
      const movieCode = (movie.moviename || "").replace(/\s+/g, "").toUpperCase().slice(0, 3);
      const seatCode = (seatType || "").replace(/\s+/g, "").toUpperCase().slice(0, 3);
      const showTime = show.showtime.replace(/\s+/g, "");
      const bookedDatedd = bookingDate.toISOString().split("T")[0].replace(/-/g, "");
      const booking_id = `Ticket-${movieCode}-${bookedDatedd}-${seatCode}-${seatNumber}-${showTime}`;

      const ticketToken = Jwt.sign(
        { seatId, showId, userId, BookedDate },
        process.env.JWT_SECRET as string,
        { expiresIn: "5d" }
      );

      await bookModel.create({
        seatId,
        showId,
        userId,
        BookedDate: bookingDate,
        ticketToken,
        booking_id,
        ticketId: generateTicketId(6),
        status: "active", // Ensure status is explicitly set
      });
    }));

    // Aggregate booking info for response
    const result = await bookModel.aggregate([
      {
        $match: {
          showId: new mongoose.Types.ObjectId(showId),
          userId: new mongoose.Types.ObjectId(userId),
          BookedDate: bookingDate,
          status: "active",
        },
      },
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
          from: "screens",
          localField: "show.screenId",
          foreignField: "_id",
          as: "screen",
        },
      },
      { $unwind: "$screen" },
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
        $project: {
          _id: 1,
          BookedDate: 1,
          ticketToken: 1,
          moviename: "$movie.moviename",
          movie_description: "$movie.description",
          duration: "$movie.duration",
          language: "$movie.language",
          genre: "$movie.genre",
          showtime: "$show.showtime",
          seatnum: "$seat.seatNumber",
          seatype: "$seat.seatType",
          seatprice: "$seat.price",
          screen_num: "$screen.screen_num",
          screen_description: "$screen.description",
        },
      },
      {
        $group: {
          _id:1,
          BookedIds: { $push: "$_id" },
          BookedDate: { $first: "$BookedDate" },
          movie: { $first: "$moviename" },
          movie_description: { $first: "$movie_description" },
          duration: { $first: "$duration" },
          language: { $first: "$language" },
          genre: { $first: "$genre" },
          showtime: { $first: "$showtime" },
          seatnum: { $push: "$seatnum" },
          seatype: { $first: "$seatype" },
          price: { $push: "$seatprice" },
          screen_num: { $first: "$screen_num" },
          screen_description: { $first: "$screen_description" },
          totalamount: { $sum: "$seatprice" },
          ticketTokens: { $push: "$ticketToken" },
        },
      },
    ]);

    return result[0] || {};
  } catch (error: any) {
    throw new Error(error.message || "Booking failed.");
  }
};



export const getBookedShow=async(userId:string)=>{
  try{
    
    const currentDate = new Date();
    if(!mongoose.Types.ObjectId.isValid(userId)){
      throw new Error("Invalid userId");
    }

      const result = await bookModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
           BookedDate:{$gte:currentDate}, 
        },
      },
      {
        $lookup: {
          from: "seats",
          localField: "seatId",
          foreignField: "_id",
          as: "seat",
        },
      },
      {
        $unwind: "$seat",
      },
      {
        $lookup: {
          from: "shows",
          localField: "showId",
          foreignField: "_id",
          as: "show",
        },
      },
      {
        $unwind: "$show",
      },
      {
        $lookup: {
          from: "screens",
          localField: "show.screenId",
          foreignField: "_id",
          as: "screen",
        },
      },
      {
        $unwind: "$screen",
      },
      {
        $lookup: {
          from: "movies",
          localField: "show.movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $project: {
          _id: 1,
          BookedDate: 1,
          ticketToken:1,
          moviename: "$movie.moviename",
          movie_description: "$movie.description",
          duration: "$movie.duration",
          language: "$movie.language",
          genre: "$movie.genre",
          showtime: "$show.showtime",
          seatnum: "$seat.seatNumber",
          seatype: "$seat.seatType",
          seatprice: "$seat.price",
          screen_num: "$screen.screen_num",
          screen_description: "$screen.description",
        },
      },
      {
        $group: {
          _id: 1,
          BookedId: { $push: "$_id" },
          BookedDate: { $first: "$BookedDate" },
          movie: { $first: "$moviename" },
          movie_description: { $first: "$movie_description" },
          duration: { $first: "$duration" },
          language: { $first: "$language" },
          genre: { $first: "$genre" },
          showtime: { $first: "$showtime" },
          seatnum: { $push: "$seatnum" },
          seatype: { $first: "$seatype" },
          price: { $push: "$seatprice" },
          screen_num: { $first: "$screen_num" },
          screen_description: { $first: "$screen_description" },
          totalamount: { $sum: "$seatprice" },
          ticketToken: { $push: "$ticketToken" },
        },
      },
    ]);
  if(!result.length){
    throw new Error("No Bookings found");
  }
    return result;
   
  }catch(error:any){
    throw error;
  }
}