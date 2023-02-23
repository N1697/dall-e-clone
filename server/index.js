import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

//Pull our environment variables from '.env' file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

//CREATE ROUTES
//Create api endpoints to connect to the server from the front-end side
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);
//Create route to the root of the page
app.get("/", async (req, res) => {
  res.send("Hello World!");
});

const PORT = 8080;

//Create a func to connect to MONGODB and start the server
const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    //If it succeeds, run the application on PORT 8080
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
