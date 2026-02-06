import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import { connectDb } from "./db/connectDb.js";

const PORT = process.env.PORT || 5000;

// Connect to the database before starting the server
connectDb()
  .then(async () => {
    const server = await app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} /Index.js`);
    });
    app.on("error", (error) => {
      console.log(`an error occured during server starting...`, error);
    });
    app.on("close", () => {
      console.log("server is stopped !");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

console.log("server is listening");
