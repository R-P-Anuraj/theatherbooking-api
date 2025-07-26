import mongoose from "mongoose";
import { IBook } from "../interfaces/bookInterface";
const bookSchema = new mongoose.Schema<IBook>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    showId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"show",
        required:true
    },
    seatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"seat",
        required:true
    },
    bookedAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    BookedDate:{
        type:Date,
        required:true
    },

})

export const bookModel=mongoose.model<IBook>("book",bookSchema)