import mongoose from "mongoose";
import { CreateSeatRequest } from "../interfaces/seatInterface";
const seatSchema=new mongoose.Schema<CreateSeatRequest>({
    screenId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Screen",
        required:true
    },
    seatNumber:{
        type:Number,
        required:true
    },
    seatType:{
        type:String,
        enum:["sliver","gold","platinum","recliner"],
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    // booked:{
    //     type:Boolean,
    //     default:false
    // }
})

export const seatModel=mongoose.model<CreateSeatRequest>("seat",seatSchema)
