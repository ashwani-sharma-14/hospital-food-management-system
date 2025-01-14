import mongoose, { Schema, Document, Types } from "mongoose";

export interface Task extends Document {
  patientId: Types.ObjectId;
  staffId: Types.ObjectId;
  mealType: "Morning" | "Evening" | "Night";
  status: "Pending" | "In Progress" | "Completed";
  instructions: string;
}

const TaskSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealType: {
      type: String,
      enum: ["Morning", "Evening", "Night"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    instructions: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TaskModel =
  mongoose.models.Task || mongoose.model<Task>("Task", TaskSchema);

export default TaskModel;
