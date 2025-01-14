import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/lib/dbConnection";
import TaskModel from "@/model/Task";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const { patientId, staffId, mealType, instructions } = await req.json();

    // Validate input
    if (!patientId || !staffId || !mealType || !instructions) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Create a new task
    const newTask = await TaskModel.create({
      patientId,
      staffId,
      mealType,
      instructions,
    });

    return NextResponse.json(
      { message: "Task assigned successfully!", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning task:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({ message: `Method Not Allowed` }, { status: 405 });
}

