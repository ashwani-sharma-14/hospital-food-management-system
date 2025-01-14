import { dbConnection } from "@/lib/dbConnection";
import PatientModel from "@/model/Patient";
import { patientSchema } from "@/schemas/patientSchema";

export async function POST(request: Request) {
 
  await dbConnection();
  try {
    const {
      name,
      diseases,
      allergies,
      roomNumber,
      bedNumber,
      floorNumber,
      age,
      gender,
      phone,
      emergencyContact,
    } = await request.json();

    let patient = await PatientModel.findOne({ phone: phone });
    if (!patient) {
      patient = new PatientModel({
        name,
        diseases,
        allergies,
        roomNumber,
        bedNumber,
        floorNumber,
        age,
        gender,
        phone,
        emergencyContact,
      });
      await patient.save();
      return Response.json(
        { success: true, message: "Patient detail submitted" },
        { status: 200 }
      );
    }
    return Response.json(
      { success: false, message: "Patient already exists" },
      { status: 401 }
    );
  } catch (error) {
    console.error(error)
    throw new Error(" Failed to save user data",);
  }
}
