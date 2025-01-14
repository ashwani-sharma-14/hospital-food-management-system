import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface
export interface DietChart extends Document {
  patientId: Types.ObjectId;
  morningMeal: string;
  eveningMeal: string;
  nightMeal: string;
  instructions: string;
}

// Define the schema
const DietChartSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    morningMeal: {
      type: String,
      required: true,
    },
    eveningMeal: {
      type: String,
      required: true,
    },
    nightMeal: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model
const DietChartModel =
  mongoose.models.DietChart ||
  mongoose.model<DietChart>("DietChart", DietChartSchema);

export default DietChartModel;
