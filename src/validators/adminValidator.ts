import { Request, Response, NextFunction } from "express";
import { theaterModel } from "../models/theaterModel";
import { screenModel } from "../models/screenModel";
const { checkSchema } = require("express-validator");
import { movieModel } from "../models/movieModel";
import { showModel } from "../models/showModel";
import { IShow } from "../interfaces/showInterfaces";
import { error } from "console";
const TheaterTValidators = () =>
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Name is required",
      },
    },
    address: {
      notEmpty: {
        errorMessage: "Address is required",
      },
    },
    city: {
      notEmpty: {
        errorMessage: "City is required",
      },
    },
    state: {
      notEmpty: {
        errorMessage: "State is required",
      },
    },
    pincode: {
      notEmpty: {
        errorMessage: "Pincode is required",
      },
    },
    phone: {
      notEmpty: {
        errorMessage: "Phone number is required",
      },
      custom: {
        options: async (value: any) => {
          const theater = await theaterModel.findOne({ phone: value });
          if (theater) {
            throw new Error("Phone number already exists");
          }
        },
      },
    },
    email: {
      notEmpty: {
        errorMessage: "Email is required",
      },
      custom: {
        options: async (value: any) => {
          const theater = await theaterModel.findOne({ email: value });
          if (theater) {
            throw new Error("Email already exists");
          }
        },
      },
      isEmail: {
        errorMessage: "Invalid email format",
      },
    },
  });

// adjust path if needed
// to validate theaterId

export const ScreenTValidators = () =>
  checkSchema({
    screen_num: {
      notEmpty: {
        errorMessage: "Screen number is required",
      },
      isInt: {
        errorMessage: "Screen number must be an integer",
      },
      custom: {
        options: async (value: any) => {
          const existing = await screenModel.findOne({ screen_num: value });
          if (existing) {
            throw new Error("Screen number already exists");
          }
        },
      },
    },
    theaterId: {
      notEmpty: {
        errorMessage: "Theater ID is required",
      },
      isMongoId: {
        errorMessage: "Invalid Theater ID format",
      },
      custom: {
        options: async (value: any) => {
          const theater = await theaterModel.findById(value);
          if (!theater) {
            throw new Error("Theater not found");
          }
        },
      },
    },
    numofshows: {
      notEmpty: {
        errorMessage: "Number of shows is required",
      },
      isInt: {
        errorMessage: "Number of shows must be an integer",
      },
    },
    showtimes: {
      notEmpty: {
        errorMessage: "Showtimes are required",
      },
      isArray: {
        errorMessage: "Showtimes must be an array of time strings",
      },
    },
    description: {
      optional: true,
      isString: {
        errorMessage: "Description must be a string",
      },
    },
    status: {
      optional: true,
      isIn: {
        options: [["active", "inactive"]],
        errorMessage: "Status must be either 'active' or 'inactive'",
      },
    },
  });

const SeatTValidators = () =>
  checkSchema({
    screenId: {
      notEmpty: {
        errorMessage: "Screen ID is required",
      },
      isMongoId: {
        errorMessage: "Invalid Screen ID format",
      },
      custom: {
        options: async (value: any) => {
          const screen = await screenModel.findById(value);
          if (!screen) {
            throw new Error("Screen not found");
          }
        },
      },
    },
    sliver: {
      optional: true,
      isInt: {
        errorMessage: "Sliver count must be an integer",
      },
      isNumeric: {
        errorMessage: "Sliver count must be a number",
      },
    },
    gold: {
      optional: true,
      isInt: {
        errorMessage: "Gold count must be an integer",
      },
      isNumeric: {
        errorMessage: "Gold count must be a number",
      },
    },
    platinum: {
      optional: true,
      isInt: {
        errorMessage: "Platinum count must be an integer",
      },
      isNumeric: {
        errorMessage: "Platinum count must be a number",
      },
    },
    recliner: {
      optional: true,
      isInt: {
        errorMessage: "Recliner count must be an integer",
      },
      isNumeric: {
        errorMessage: "Recliner count must be a number",
      },
    },
    price: {
      notEmpty: {
        errorMessage: "Price is required",
      },
      isObject: {
        errorMessage: "Price must be an object",
      },
      custom: {
        options: async (value: any) => {
          if (
            !value.sliverP &&
            !value.goldP &&
            !value.platinumP &&
            !value.reclinerP
          ) {
            throw new Error(
              "Price object must contain at least one of sliverP, goldP, platinumP, or reclinerP properties"
            );
          }
        },
      },
    },
  });

const MovieTValidators = () =>
  checkSchema({
    moviename: {
      // custom: {
      //   options: async (value: any) => {
      //     const movie = await movieModel.findOne({ moviename: value });
      //     if (movie) {
      //       throw new Error("Movie name already exists");
      //     }
      //   },
      // },
      notEmpty: {
        errorMessage: "Movie name is required",
      },
      isString: {
        errorMessage: "Movie name must be a string",
      },
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: "Movie name must be between 2 and 50 characters",
      },
    },
    description: {
      notEmpty: {
        errorMessage: "Movie description is required",
      },
      isString: {
        errorMessage: "Movie description must be a string",
      },
      isLength: {
        options: { min: 10, max: 500 },
        errorMessage: "Movie description must be between 10 and 500 characters",
      },
    },
    releaseDate: {
      notEmpty: {
        errorMessage: "Release date is required",
      },
      isDate: {
        errorMessage: "Release date must be a valid date",
      },
    },
    genre: {
      optional: true,
      isString: {
        errorMessage: "Genre must be a string",
      },
      isLength: {
        options: { max: 50 },
        errorMessage: "Genre must be less than 50 characters",
      },
    },
    rating: {
      notEmpty: {
        errorMessage: "Rating is required",
      },
      isNumeric: {
        errorMessage: "Rating must be a number",
      },
      isInt: {
        errorMessage: "Rating must be an integer",
      },
      isLength: {
        options: { min: 1, max: 5 },
        errorMessage: "Rating must be between 1 and 5",
      },
    },
    duration: {
      notEmpty: {
        errorMessage: "Duration is required",
      },
      isString: {
        errorMessage: "Duration must be a string",
      },
      isLength: {
        options: { max: 20 },
        errorMessage: "Duration must be less than 20 characters",
      },
    },
    language: {
      notEmpty: {
        errorMessage: "Language is required",
      },
      isString: {
        errorMessage: "Language must be a string",
      },
      isLength: {
        options: { max: 20 },
        errorMessage: "Language must be less than 20 characters",
      },
    },
    theaterId: {
      notEmpty: {
        errorMessage: "Theater ID is required",
      },
      isMongoId: {
        errorMessage: "Invalid Theater ID format",
      },
    },
  });

// const ShowTValidators = () =>
//   checkSchema({
//     screenId: {
//       notEmpty: {
//         errorMessage: "Screen ID is required",
//       },
//       isString: {
//         errorMessage: "Screen ID must be a string",
//       },
//     custom: {
//       options: async (Data: any) => {
//         const screen = await screenModel.findOne({
//           _id: Data.screenId,
//           showtimes: Data.showtime,
//         });
//         if (!screen) {
//           throw new Error("this time not available in this screen");
//         }
//         const showExisting = await showModel.find({
//           screenId: Data.screenId,
//           showtime: Data.showtime,
//           status: "active",
//         });
//         console.log(showExisting);

//         if (showExisting.length > 0) {
//           if (showExisting[0].movieId.toString() === Data.movieId.toString()) {
//             throw new Error("Show already exists");
//           }
//            await showModel.updateOne(
//             {
//               screenId: Data.screenId,
//               showtime: Data.showtime,
//               status: "active",
//             },
//             { $set: { status: "inactive" } }
//           );
//         }
//       },
//     },
//     },
//     showtime: {
//       notEmpty: {
//         errorMessage: "Showtime is required",
//       }
//     },
//     movieId: {
//       notEmpty: {
//         errorMessage: "Movie ID is required",
//       },
//       isString: {
//         errorMessage: "Movie ID must be a string",
//       }
//     }
//   });
const ShowTValidators = () =>
  checkSchema({
    screenId: {
      notEmpty: {
        errorMessage: "Screen ID is required",
      },
      isString: {
        errorMessage: "Screen ID must be a string",
      },
      custom: {
        options: async (value: any, { req }: any) => {
          const screen = await screenModel.findOne({
            _id: value,
            showtimes: req.body.showtime,
          });
          if (!screen) {
            throw new Error("this time not available in this screen");
          }
          return true;
        },
      },
    },
    showtime: {
      notEmpty: {
        errorMessage: "Showtime is required",
      },
    },
    movieId: {
      notEmpty: {
        errorMessage: "Movie ID is required",
      },
      isString: {
        errorMessage: "Movie ID must be a string",
      },
      custom: {
        options: async (value: any, { req }: any) => {
          const showExisting = await showModel.find({
            screenId: req.body.screenId,
            showtime: req.body.showtime,
            status: "active",
          });
          if (showExisting.length > 0) {
            if (showExisting[0].movieId.toString() === value.toString()) {
              throw new Error("Show already exists");
            }
          }
          return true;
        },
      },
    },
  });

export const createTShowValidators = (errorFormatter: any) => ({
  showCreateValidator: [ShowTValidators(), errorFormatter],
});
export const createTMovieValidators = (errorFormatter: any) => ({
  movieCreateValidator: [MovieTValidators(), errorFormatter],
});

export const createTSeatValidators = (errorFormatter: any) => ({
  seatCreateValidator: [SeatTValidators(), errorFormatter],
});

export const createTScreenValidators = (errorFormatter: any) => ({
  screenCreateValidator: [ScreenTValidators(), errorFormatter],
});
export const createTheaterTValidators = (errorFormatter: any) => ({
  theaterRegisterValidator: [TheaterTValidators(), errorFormatter],
});
