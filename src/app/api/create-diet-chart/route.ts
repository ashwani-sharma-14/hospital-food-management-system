import { NextResponse } from "next/server";
import { dbConnection } from "@/lib/dbConnection";
import DietChartModel from "@/model/DietChat";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { patientId, morningMeal, eveningMeal, nightMeal, instructions } = await request.json();

    const newDietChart = new DietChartModel({
      patientId,
      morningMeal,
      eveningMeal,
      nightMeal,
      instructions,
    });

    await newDietChart.save();

    return NextResponse.json({ message: "Diet Chart Created Successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error creating diet chart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "This endpoint accepts POST requests only." }, { status: 405 });
}
