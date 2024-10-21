import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  // Set strict query mode for Mongoose to prevent unknown field queries.
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");

  // If the connection is already established, return without creating a new connection.
  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connection established");

    isConnected = true;
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};

export default connectToDB;
