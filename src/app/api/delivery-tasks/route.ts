import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/lib/dbConnection";
import DeliveryModel from "@/model/Delivery";

// GET: Retrieve deliveries (with optional filter by deliveryPersonnelId)
export async function GET(req: NextRequest) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);
    const deliveryPersonnelId = searchParams.get("deliveryPersonnelId");

    const deliveries = deliveryPersonnelId
      ? await DeliveryModel.find({ deliveryPersonnelId })
      : await DeliveryModel.find();

    return NextResponse.json({ deliveries }, { status: 200 });
  } catch (error) {
    console.error("Error in GET method:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create a new delivery task
export async function POST(req: NextRequest) {
  try {
    await dbConnection();

    // Parsing JSON request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error in delivery task",error);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { taskId, deliveryPersonnelId: newDeliveryPersonnelId, notes } = body;

    // Validate required fields
    if (!taskId || !newDeliveryPersonnelId) {
      return NextResponse.json(
        { error: "Task ID and Delivery Personnel ID are required" },
        { status: 400 }
      );
    }

    // Create new delivery task
    const newDelivery = await DeliveryModel.create({
      taskId,
      deliveryPersonnelId: newDeliveryPersonnelId,
      status: "Pending",
      notes,
      deliveredAt: null,
    });

    return NextResponse.json(
      {
        message: "Delivery task created successfully",
        delivery: newDelivery,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST method:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH: Update a delivery task (status and deliveredAt)
export async function PATCH(req: NextRequest) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const deliveryId = searchParams.get("deliveryId");

    if (!deliveryId) {
      return NextResponse.json(
        { error: "Delivery ID is required" },
        { status: 400 }
      );
    }

    // Parsing JSON request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error in posting delivery Tasks',error)
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { status: updatedStatus, deliveredAt } = body;

    // Validate status field
    if (!["Pending", "Delivered"].includes(updatedStatus)) {
      return NextResponse.json(
        { error: "Invalid status value. Allowed values are 'Pending' or 'Delivered'." },
        { status: 400 }
      );
    }

    // Update delivery task
    const updateFields = {
      status: updatedStatus,
      deliveredAt: updatedStatus === "Delivered" ? deliveredAt || new Date() : null,
    };

    const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
      deliveryId,
      updateFields,
      { new: true }
    );

    if (!updatedDelivery) {
      return NextResponse.json(
        { error: "Delivery task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Delivery task updated successfully",
        delivery: updatedDelivery,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH method:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
