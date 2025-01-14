import mongoose, { Schema, Document } from "mongoose";

export interface Patient extends Document {
  name: string;
  diseases: string[];
  allergies: Array<string>;
  roomNumber: number;
  bedNumber: number;
  floorNumber: number;
  age: string;
  gender: string;
  phone: string;
  emergencyContact: string;
}

const PatientSchema: Schema<Patient> = new Schema({
  name: {
    type: String,
    required: true,
  },
  diseases: {
    type: [String],
    required: true,
  },
  allergies: {
    type: [String],
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  bedNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  floorNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  age: {
    type: String,
    required: true,
    min: 1,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^[+]?[0-9]{10,15}$/,
  },
  emergencyContact: {
    type: String,
    required: true,
    match: /^[+]?[0-9]{10,15}$/,
  },
},{ timestamps: true });

const PatientModel =
  (mongoose.models.Patient as mongoose.Model<Patient>) ||
  mongoose.model<Patient>("Patient", PatientSchema);

export default PatientModel;
