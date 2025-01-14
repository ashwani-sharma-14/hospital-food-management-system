import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/lib/dbConnection";
import DeliveryModel from "@/model/Delivery";

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

export async function POST(req: NextRequest) {
  try {
    await dbConnection();
    const requestBody = await req.text(); 
    const body = JSON.parse(requestBody); 

    const { taskId, deliveryPersonnelId: newDeliveryPersonnelId, notes } = body;

    if (!taskId || !newDeliveryPersonnelId) {
      return NextResponse.json(
        { error: "Task ID and Delivery Personnel ID are required" },
        { status: 400 }
      );
    }

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

export async function PATCH(req: NextRequest) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);
    const deliveryId = searchParams.get("deliveryId");
    const { status: updatedStatus, deliveredAt } = await req.json();

    if (!deliveryId) {
      return NextResponse.json(
        { error: "Delivery ID is required" },
        { status: 400 }
      );
    }

    if (!["Pending", "Delivered"].includes(updatedStatus)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
      deliveryId,
      { status: updatedStatus, deliveredAt: deliveredAt || new Date() },
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
