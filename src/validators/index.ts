import { Request, Response, NextFunction } from "express";
const { validationResult } = require("express-validator");
import { statusCode } from "../helper/statusCode";
import { RegisterUserTValidators, LoginUserTValidators } from "./userValidtor";
import {
  createTheaterTValidators,
  createTScreenValidators,
  createTSeatValidators,
  createTMovieValidators,
  createTShowValidators
} from "./adminValidator";
const errorFormatter = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "Validation errors",
      data: errors.array(),
    });
    return;
  }
  next();
};

export const showV = createTShowValidators(errorFormatter);
export const movieV = createTMovieValidators(errorFormatter);
export const seatV = createTSeatValidators(errorFormatter);
export const screenV = createTScreenValidators(errorFormatter);
export const theaterV = createTheaterTValidators(errorFormatter);
export const userLoginV = LoginUserTValidators(errorFormatter);
export const userRegisterV = RegisterUserTValidators(errorFormatter);
