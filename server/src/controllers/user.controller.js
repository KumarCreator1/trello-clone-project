import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { httpOptions } from "../constants.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body || {};

  if (!(username && email && password)) {
    throw new ApiError(400, "all fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  let user;
  try {
    user = await User.create({
      email,
      username: username.toLowerCase(),
      password,
    });
  } catch (error) {
    throw new ApiError(500, "Error creating user", error);
  }

  const createdUser = user.toObject();
  delete createdUser.password;
  delete createdUser.refreshToken;

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully.Go to login"));
});

export { registerUser, loginUser };
