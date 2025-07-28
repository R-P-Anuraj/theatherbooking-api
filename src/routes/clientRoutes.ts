import express from "express";
import { response } from "../helper/callback";
import {
  getListOfTheaterController,
  getScreenController,
  getActiveShowController,
  getScreenDetailsController,
  fetchSeatController,
  bookTicketController,
  getBookedOrUnBookedSeatsController
} from "../controllers/clientController";
import { authUser, authorizeRoles } from "../middlewares/userMiddleware";
const router = express.Router();

router.get(
  "/listOfTheater",
  authUser,
  authorizeRoles(["client"]),
  response(getListOfTheaterController)
);


router.get(
  "/screens",
  authUser,
  authorizeRoles(["client"]),
  response(getScreenController)
);

router.get(
  "/shows",
  authUser,
  authorizeRoles(["client"]),
  response(getActiveShowController)
);

router.get(
  "/getScreendetails",
  authUser,
  authorizeRoles(["client"]),
  response(getScreenDetailsController)
);

router.get(
  "/seats",
  authUser,
  authorizeRoles(["client"]),
  response(fetchSeatController)
);

router.post(
  "/bookTicket",
  authUser,
  authorizeRoles(["client"]),
  response(bookTicketController)
);

router.get(
  "/bookedSeats",
  authUser,
  authorizeRoles(["client"]),
  response(getBookedOrUnBookedSeatsController)
);

export default router;