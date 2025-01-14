import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/lib/dbConnection";
import TaskModel from "@/model/Task";

export async function GET() {
  try {
    await dbConnection();
    const tasks = await TaskModel.find({ status: { $ne: "Completed" } });
    console.log('tasks');
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error in GET method:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    console.log('taskId:', taskId);
    const { status } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated", task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH method:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
