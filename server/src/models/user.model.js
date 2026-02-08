import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  } else {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log("error while hashing the password", error);
      throw error;
    }
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      { _id: this._id, email: this.email, username: this.username },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      },
    );
  } catch (error) {
    console.log("error while generating access token", error);
    throw error;
  }
};

userSchema.methods.generateRefreshToken = function () {
  try {
    return jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
  } catch (error) {
    console.log("error while generating refresh token", error);
    throw error;
  }
};

export const User = mongoose.model("User", userSchema);
