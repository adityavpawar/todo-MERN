import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log(" MongoDB connected"))
    .catch((err) => {
      console.error("❌ DB connection error:", err);
      process.exit(1);
    });
};

export default connectDB;
