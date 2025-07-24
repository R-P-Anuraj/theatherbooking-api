import express from "express";
import { response } from "../helper/callback";
import { createUserController ,loginUserController,getUserController} from "../controllers/userController";
import { userRegisterV ,userLoginV} from "../validators";
import { authUser } from "../middlewares/userMiddleware";
const router = express.Router();

router.post("/createUser",userRegisterV.userRegisterValidator, response(createUserController));
router.post("/loginUser", userLoginV.userLoginValidator,response(loginUserController));
router.get('/profile',authUser,response(getUserController))

export default router;