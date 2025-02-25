//mongodbpassowrd = MXfXGE170xDeFjf7
//duchmse173564
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("connected mongodb successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
