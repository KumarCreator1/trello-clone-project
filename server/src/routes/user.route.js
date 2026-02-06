import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, logOutUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secure route, only accessible with valid JWT token
router.route("/logout").post(verifyJWT, logOutUser);

export default router;
