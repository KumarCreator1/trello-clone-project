import express from 'express';
import cors from 'cors';

const app = express();

// Native express middleware for CORS and body parsing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Adjust this to your frontend URL
  }),
);

app.use(
  express.json({
    limit: '16kb', // Adjust the limit as needed
  }),
);

app.use(cookieParser());

app.use(express.static('public')); // Serve static files from the 'public' directory

app.use(express.urlencoded({ extended: true }));

export default app;
