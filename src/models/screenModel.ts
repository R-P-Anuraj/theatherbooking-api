import mongoose from "mongoose";
import { IScreen } from "../interfaces/screenInterface";
const screenSchema = new mongoose.Schema<IScreen>({
    screen_num: {
        type: Number,
        required: true,
        unique: true,
    },
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "theater",
        required: true,
    },
    numofshows: {
        type: Number,
        required: true,
    },
    showtimes: {    
        type: [String], //show time
        required: true,
    },
    description: {
        type: String,
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    }
});
export const screenModel = mongoose.model<IScreen>("Screen", screenSchema);
