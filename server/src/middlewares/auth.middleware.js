import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log("token from verifyJWT", token);
    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded payload from verifyJWT", decodedPayload);
    const retrievedUser = await User.findById(decodedPayload?._id).select(
      "-password -refreshToken",
    );

    console.log(retrievedUser);

    if (!retrievedUser) {
      throw new ApiError(401, "user not found ret");
    }

    req.user = retrievedUser;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "An error occured while verifyingJWT");
  }
});
export { verifyJWT };
