import mongoose from "mongoose";
import { ISeat } from "../../interfaces/theaterInterfaces/seatInterfaces";
const seatSchema=new mongoose.Schema<ISeat>({
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
  booked:{
    type:Boolean,
    default:false
}
})

export const seatModel=mongoose.model<ISeat>("seat",seatSchema)
