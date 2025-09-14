import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  position: { type: Number, default: 0 }, // 👈 NEW: track order
});

export default mongoose.model("Todo", TodoSchema);
