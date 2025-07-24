import { error } from "console";

// const {body} = require("express-validator");
const { checkSchema } = require("express-validator");

const RegisterTValidators = () =>
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Name is required",
      },
    },
    email: {
      isEmail: {
        errorMessage: "Invalid email format",
      },
    },
    password: {
      isLength: {
        options: { min: 6 },
        errorMessage: "Password must be at least 6 characters",
      },
    },
    role: {
      optional: true,
    },
    phoneNo: {
      isMobilePhone: {
        options: ["en-IN"],
        errorMessage: "Invalid phone number format",
      },
    },
  });

const LoginTValidators = () =>
  checkSchema({
    email: {
      isEmail: {
        errorMessage: "Invalid email format",
      },
    },
    password: {
      isLength: {
        options: { min: 6 },
        errorMessage: "Password must be at least 6 characters",
      },
    },
  });

export const LoginUserTValidators = (errorFormatter: any) => ({
  userLoginValidator: [LoginTValidators(), errorFormatter],
});
export const RegisterUserTValidators = (errorFormatter: any) => ({
  userRegisterValidator: [RegisterTValidators(), errorFormatter],
});
