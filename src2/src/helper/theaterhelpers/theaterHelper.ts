import { ObjectId ,Types} from "mongoose";
import { seatModel } from "../../models/theaterModels/seatModel";

// export const countSliverSeats = async () => {
//   try {
//     const count = await seatModel.countDocuments({ seatType: "sliver" });
//     return count;
//   } catch (error) {
//     throw error;
//   }
// };



 export const countSeatsByScreenId = async (screenId: Types.ObjectId,seatType: string) => {
  try {
    const count = await seatModel.countDocuments({ screenId, seatType });
    return count;
  } catch (error) {
    throw error;
  }
};