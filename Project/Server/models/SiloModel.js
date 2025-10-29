// models/siloModel.js
import mongoose from "mongoose";

const siloSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    area: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    manager: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive", "maintenance"], default: "active" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Silo", siloSchema);
