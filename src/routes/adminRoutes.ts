import express from "express";
import { response } from "../helper/callback";
import { authUser, authorizeRoles } from "../middlewares/userMiddleware";
import {
  createTheaterController,
  createScreenController,
  getListOfTheaterController,
  getScreenController,
  createAndUpdateSeatController,
  fetchSeatController,
  createMovieController,
  getMovieController,
  createShowController,
  getActiveShowController,
  changeScreenStatusController,
  changeShowStatusChontroller,
  changeMovieStatusController,
  verifyTokenController,
  reportController
} from "../controllers/adminController";
import { theaterV, screenV, seatV, movieV, showV } from "../validators";
// import { ShowTValidators } from "../validators/adminValidator";
const router = express.Router();

router.post(
  "/createTheater",
  theaterV.theaterRegisterValidator,
  authUser,
  authorizeRoles(["admin"]),
  response(createTheaterController)
);

router.get(
  "/getAllTheater",
  authUser,
  authorizeRoles(["admin"]),
  response(getListOfTheaterController)
);

router.post(
  "/createScreen",
  screenV.screenCreateValidator,
  authUser,
  authorizeRoles(["admin"]),
  response(createScreenController)
);

router.get(
  "/screen",
  authUser,
  authorizeRoles(["admin"]),
  response(getScreenController)
);

router.post(
  "/createAndUpdateSeat",
  seatV.seatCreateValidator,
  authUser,
  authorizeRoles(["admin"]),
  response(createAndUpdateSeatController)
);

router.get(
  "/seat",
  authUser,
  authorizeRoles(["admin"]),
  response(fetchSeatController)
);

router.post(
  "/movieCreate",
  movieV.movieCreateValidator,
  authUser,
  authorizeRoles(["admin"]),
  response(createMovieController)
);

router.get(
  "/getMovie",
  authUser,
  authorizeRoles(["admin"]),
  response(getMovieController)
);
//create show movieId,screenId,showtime
router.post(
  "/createShow",
  showV.showCreateValidator,
  authUser,
  authorizeRoles(["admin"]),
  response(createShowController)
);
router.get(
  "/getActiveShow",
  authUser,
  authorizeRoles(["admin"]),
  response(getActiveShowController)
);
router.put(
  "/changeScreenstatus",
  authUser,
  authorizeRoles(["admin"]),
  response(changeScreenStatusController)
);
router.put(
  "/changeshowstatus",
  authUser,
  authorizeRoles(["admin"]),
  response(changeShowStatusChontroller)
);
router.put(
  "/changemoviestatus",
  authUser,
  authorizeRoles(["admin"]),
  response(changeMovieStatusController)
);
router.post(
  "/verifyToken",
  authUser,
  authorizeRoles(["admin"]),
  response(verifyTokenController)
);

router.get(
  "/report",
  authUser,
  authorizeRoles(["admin"]),
  response(reportController)
);
// router.get(
//   "/report",
//   authUser,
//   authorizeRoles(["admin"]),
//   response(reportController)
// );
export default router;
