import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png',
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
