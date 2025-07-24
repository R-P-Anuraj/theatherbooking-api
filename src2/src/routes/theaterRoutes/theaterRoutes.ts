import express from "express";
import { response } from "../../helper/commonhelpers/callBack";
import {
  createTheaterController,
  loginTheaterController,
  createScreenController,
  createSeatController
} from "../../controller/theaterController";
import { theaterV, loginV, screenV } from "../../validators";
import { authUser } from "../../middlewares/userMiddleware";
const router = express.Router();

router.post(
  "/createTheater",
  theaterV.theaterRegisterValidator,
  response(createTheaterController)
);
router.post(
  "/loginTheater",
  loginV.theaterLoginValidator,
  response(loginTheaterController)
);
router.post(
  "/createScreen",
  screenV.createScreenValidator,
  authUser,
  response(createScreenController)
);
router.post("/createSeat",authUser, response(createSeatController));

export default router;
