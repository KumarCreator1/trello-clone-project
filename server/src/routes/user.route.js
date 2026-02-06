import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
// router.route("/login").post(loginUser);

//secure route, only accessible with valid JWT token
// router.route("/logout").post(logoutUser);

export default router;
