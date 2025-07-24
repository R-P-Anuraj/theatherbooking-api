import type { Request, Response, NextFunction } from "express";
const { validationResult } = require("express-validator");
import { statusCode } from "../helper/commonhelpers/statusCode";
// import { validationResult } from "express-validator";
import { RegisterTValidators,LoginTValidators,createTScreenValidators } from "./theaterValidator/theaterValidator";
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

export const screenV=createTScreenValidators(errorFormatter);
export const loginV=LoginTValidators(errorFormatter);
export const theaterV=RegisterTValidators(errorFormatter);