import mongoose from "mongoose";

const connectDB = (url) => {
  mongoose.set("strictQuery", true); //Useful when working with search functionality

  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected!"))
    .catch((error) => console.log(error));
};

export default connectDB;
