const { body } = require("express-validator");

const theaterRegisterValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),

    body("dist")
      .trim()
      .notEmpty()
      .withMessage("District is required")
      .isString()
      .withMessage("District must be a string"),

    body("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required")
      .isString()
      .withMessage("Address must be a string"),

    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isNumeric()
      .withMessage("Phone must be a number"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("pincode")
      .notEmpty()
      .withMessage("Pincode is required")
      .isNumeric()
      .withMessage("Pincode must be a number"),
  ];
};
const theaterLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];
};

const createScreenValidator = () => {
  return [
    body("screen_num")
      .notEmpty()
      .withMessage("Screen Number is required")
      .isNumeric()
      .withMessage("Screen Number must be a number"),
    body("capacity")
      .notEmpty()
      .withMessage("Capacity is required")
      .isNumeric()
      .withMessage("Capacity must be a number"),
    body("numofshows")
      .notEmpty()
      .withMessage("Number of shows is required")
      .isNumeric()
      .withMessage("Number of shows must be a number"),
    body("showtimes")
      .notEmpty()
      .withMessage("Showtimes is required")
      .isArray()
      .withMessage("Showtimes must be an array"),
  ];
};
// const createSeatValidator = () => {
//   return [
//     body("screenId")
//       .notEmpty()
//       .withMessage("screenId is required")
//       .withMessage("screenId  must be a ObjectId"),
//     body("sliver")
//       .optional()
//       .withMessage("Seat  is required")
//       .isNumeric()
//       .withMessage("enter the number of sliver seats"),
//     body("gold")
//       .optional()
//       .withMessage("Seat  is required")
//       .isNumeric()
//       .withMessage("enter the number of sliver seats"),
//     body("platinum")
//       .optional()
//       .withMessage("Seat  is required")
//       .isNumeric()
//       .withMessage("enter the number of sliver seats"),
//     body("recliner")
//       .optional()
//       .withMessage("Seat  is required")
//       .isNumeric()
//       .withMessage("enter the number of sliver seats"),
//   ];
// };
// export const createTSeatValidators = (errorFormatter: any) => ({
//   createSeatValidator: [createSeatValidator(), errorFormatter],
// })
export const createTScreenValidators = (errorFormatter: any) => ({
  createScreenValidator: [createScreenValidator(), errorFormatter],
});
export const LoginTValidators = (errorFormatter: any) => ({
  theaterLoginValidator: [theaterLoginValidator(), errorFormatter],
});
export const RegisterTValidators = (errorFormatter: any) => ({
  theaterRegisterValidator: [theaterRegisterValidator(), errorFormatter],
});
