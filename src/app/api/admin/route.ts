import { dbConnection } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import PatientModel from "@/model/Patient";
import TaskModel from "@/model/Task";
import DeliveryModel from "@/model/Delivery";
export async function GET() {
  await dbConnection();
  try {
    const patients = await PatientModel.find({});
    const staff = await UserModel.find(
      { isAdmin: { $ne: true } },
      { password: 0 }
    );
    const tasks = await TaskModel.find({});
    const deliveries = await DeliveryModel.find({});
    return new Response(
      JSON.stringify({
        message: "Data received",
        patients,
        staff,
        tasks,
        deliveries,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
