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

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body || {};

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const retrievedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!retrievedUser) {
    throw new ApiError(
      404,
      "User not found with the provided credentials, please check and try again or register if you don't have an account",
    );
  }
  const isPasswordCorrect = await retrievedUser.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "wrong username or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(retrievedUser._id);
  const user = retrievedUser.toObject();
  delete user.password;
  delete user.refreshToken;

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, httpOptions)
    .cookie("accessToken", accessToken, httpOptions)
    .json(new ApiResponse(200, { user }, "User logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const option = {
    httpOnly: true,
    secure: true,
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const retrievedUserId = req.user._id;
  console.log(retrievedUserId);

  const user = await User.findById(retrievedUserId);

  if (!(await user.isPasswordCorrect(currentPassword))) {
    throw new ApiError(404, "wrong password");
  }

  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user, currentPassword, newPassword }, "password updated successfully"),
    );
});

export { registerUser, loginUser, logOutUser, changePassword };
