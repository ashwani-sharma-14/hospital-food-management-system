import { dbConnection } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const manager = process.env.MANAGER;
  const pentry = process.env.PANTRY;
  const delivery = process.env.DELIVERY;
  await dbConnection();
  try {
    const { name, email, password, phone } = await request.json();

    if (email === !manager || email === !pentry || email === !delivery) {
      return Response.json(
        { succes: false, message: "You cannot register" },
        { status: 401 }
      );
    }

    const isAdmin = email === manager ? true : false;
    const isPantry = email === pentry ? true : false;
    const isDelivery = email === delivery ? true : false;
    let user = await UserModel.findOne({ email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new UserModel({
        name,
        email,
        password: hashedPassword,
        phone,
        isAdmin: isAdmin,
        isPantry: isPantry,
        isDelivery: isDelivery,
      });
      await user.save();
      return Response.json(
        { succes: true, message: "User registered successfully" },
        { status: 200 }
      );
    }
    return Response.json({ message: "User already available" });
  } catch (error) {
    console.error("error while signup", error);
    return Response.json(
      {
        success: false,
        message: "Error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
