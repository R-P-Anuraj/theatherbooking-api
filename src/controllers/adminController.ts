import { Request } from "express";
import { ITheater } from "../interfaces/theaterInterface";
import {
  createTheater,
  createScreen,
  getAllTheater,
  getScreen,
  createOrUpdateSeats,
  seatFetchByScreenId,
  createMovie,
  getMovies,
  createShow,
  getActiveShows,
  changeScreenStatus,
  changeShowStatus,
  changeMovieStatus,
  verifyToken,
  getReport,
} from "../services/adminSevice";
import { statusCode } from "../helper/statusCode";
import { userModel } from "../models/userModels";
import { IScreen } from "../interfaces/screenInterface";
import { IMovie } from "../interfaces/movieInnterface";
import { CreateSeatRequest } from "../interfaces/seatInterface";
import { IShow } from "../interfaces/showInterfaces";
import { IBook } from "../interfaces/bookInterface";
import { IReport } from "../interfaces/reportInterface";
export const createTheaterController = async (
  req: Request<{}, {}, ITheater>
) => {
  try {
    const Data = req.body;
    const { id } = (req as any).user;
    const adminId = id;
    Data.adminId = adminId;
    const result = await createTheater(Data);
    return {
      statusCode: statusCode.OK,
      message: "Theater Created Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};
export const getListOfTheaterController = async (
  req: Request<{}, {}, ITheater>
) => {
  try {
    const { id } = (req as any).user;
    const adminId = id;
    // const adminId = adminId;

    const result = await getAllTheater(adminId);
    return {
      statusCode: statusCode.OK,
      message: "Theater fetching  Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const createScreenController = async (req: Request<{}, {}, IScreen>) => {
  try {
    const Data = req.body;
    const result = await createScreen(Data);
    return {
      statusCode: statusCode.OK,
      message: "Screen created successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const getScreenController = async (req: Request<{}, {}, IScreen>) => {
  try {
    const Data = req.body;

    const result = await getScreen(Data);
    return {
      statusCode: statusCode.OK,
      message: "Screen fetching  Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const createAndUpdateSeatController = async (
  req: Request<{}, {}, CreateSeatRequest>
) => {
  try {
    const { screenId, sliver, gold, platinum, recliner, price } = req.body;
    const result = await createOrUpdateSeats({
      screenId,
      sliver,
      gold,
      platinum,
      recliner,
      price,
    });
    return {
      statusCode: statusCode.OK,
      message: "Seats created successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const fetchSeatController = async (
  req: Request<{}, {}, CreateSeatRequest>
) => {
  try {
    const Data = req.body;
    const result = await seatFetchByScreenId(Data);
    return {
      statusCode: statusCode.OK,
      message: "Seats fetching  Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      message: error.message,
      data: null,
    };
  }
};

export const createMovieController = async (req: Request<{}, {}, IMovie>) => {
  try {
    const Data = req.body;

    const result = await createMovie(Data);
    return {
      statusCode: statusCode.OK,
      message: "Movie Created Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const getMovieController = async (req: Request<{}, {}, IMovie>) => {
  try {
    const result = await getMovies();
    return {
      statusCode: statusCode.OK,
      message: "Movie fetching  Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const createShowController = async (req: Request<{}, {}, IShow>) => {
  try {
    const Data = req.body;
    const result = await createShow(Data);
    return {
      statusCode: statusCode.OK,
      message: "Show Created Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};
export const getActiveShowController = async (req: Request<{}, {}, IShow>) => {
  try {
    const Data = req.body;
    const shows = await getActiveShows(Data);
    return {
      statusCode: statusCode.OK,
      message: "Show fetching Successfully",
      data: shows,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const changeScreenStatusController = async (
  req: Request<{}, {}, IScreen>
) => {
  try {
    const Data = req.body;
    const result = await changeScreenStatus(Data);
    return {
      statusCode: statusCode.OK,
      message: "Screen status changed Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const changeShowStatusChontroller = async (
  req: Request<{}, {}, IShow>
) => {
  try {
    const Data = req.body;
    const result = await changeShowStatus(Data);
    return {
      statusCode: statusCode.OK,
      message: "Show status changed Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const changeMovieStatusController = async (
  req: Request<{}, {}, IMovie>
) => {
  try {
    const Data = req.body;
    const result = await changeMovieStatus(Data);
    return {
      statusCode: statusCode.OK,
      message: "Movie status changed Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const verifyTokenController = async (req: Request<{}, {}, IBook>) => {
  try {
    const Data = req.body;
    const result = await verifyToken(Data);
    return {
      statusCode: statusCode.OK,
      message: "Token verified Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

export const reportController = async (req: Request<{}, {}, IReport>) => {
  try {
    const Data = req.body;
    const result = await getReport(Data);
    return {
      statusCode: statusCode.OK,
      message: "Report fetched Successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
};

// export const reportController = {

//   async getReport(req: Request,next: NextFunction) {
//     try {
//       const type : string = req.body
//       const report = await getReport(type);
//       return {
//         statusCode: 200,
//         message: 'Report fetched successfully',
//         data: report,
//       }
//     } catch (error: any) {
//       return {
//         statusCode: 400,
//         message: error.message,
//         data: null,
//       }
//     }
//   },
// };
