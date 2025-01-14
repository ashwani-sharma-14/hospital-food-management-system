import mongoose, { Schema, Document } from "mongoose";

export interface Delivery extends Document {
  taskId: mongoose.Types.ObjectId;
  deliveryPersonnelId: mongoose.Types.ObjectId;
  status: "Pending" | "Delivered";
  notes: string;
  deliveredAt: Date;
}

const deliverySchema: Schema<Delivery> = new Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    deliveryPersonnelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Delivered"],
      default: "Pending",
    },
    notes: { type: String },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const DeliveryModel =
  mongoose.models.Delivery ||
  mongoose.model<Delivery>("Delivery", deliverySchema);
export default DeliveryModel;
