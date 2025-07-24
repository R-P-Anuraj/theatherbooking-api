import { ITheater } from "../../interfaces/theaterInterfaces/theaterInterfaces";
import { theaterModel } from "../../models/theaterModels/theaterModel";
import { IScreen } from "../../interfaces/theaterInterfaces/screenInterfaces";
import {
  findTheaterByEmail,
  hashPassword,
  comparePassword,
} from "../../helper/commonhelpers/userHelper";
import Jwt from "jsonwebtoken";
import { CreateSeatRequest } from "../../interfaces/theaterInterfaces/seatInterfaces";
import { screenModel } from "../../models/theaterModels/screenModel";
import { countSeatsByScreenId } from "../../helper/theaterhelpers/theaterHelper";
import { seatModel } from "../../models/theaterModels/seatModel";
export const createTheater = async (Data: ITheater) => {
  try {
    console.log("kdvhjk");
    const {
      name,
      address,
      phone,
      email,
      password,
      dist,
      able,
      status,
      pincode,
    } = Data;
    const emailExists = await findTheaterByEmail(email);
    console.log("xxx");
    console.log(emailExists);
    if (emailExists) {
      throw new Error("Email already exists");
    }

    console.log("kdvhjk");
    const hashedPassword = await hashPassword(password);
    const theater = new theaterModel({
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      dist,
      able,
      status,
      pincode,
    });
    const result = await theater.save();
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginTheater = async (Data: ITheater) => {
  try {
    const { email, password } = Data;
    const theater = await findTheaterByEmail(email);
    if (!theater) {
      throw new Error("Theater not found");
    }
    const isPasswordMatch = await comparePassword(password, theater.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }
    console.log(isPasswordMatch);
    const token = Jwt.sign(
      { id: theater._id, email: theater.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    console.log(token);
    return { token: token, theater: theater };
  } catch (error) {
    throw error;
  }
};

export const createScreen = async (Data: IScreen) => {
  try {
    const screen = new screenModel(Data);
    const result = await screen.save();
    return {
      statusCode: 200,
      message: "Screen created successfully",
      data: result,
    };
  } catch (error) {
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
        const currentSeats = await seatModel.find({ screenId, seatType: type }).sort({ seatNumber: 1 });
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

    return {
      statusCode: 200,
      message: "Seats configured/updated successfully",
    };
  } catch (error: any) {
    throw error;
  }
};

