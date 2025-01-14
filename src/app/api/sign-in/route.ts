import { dbConnection } from "@/lib/dbConnection";
import { UserModel } from "@/model/User";
import * as jose from "jose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const timeOut = process.env.JWT_TIMEOUT || "2h"; // Default to 2 hours if not set

  await dbConnection();

  try {
    const { identifier, password } = await request.json();
    if (!identifier || !password) {
      return NextResponse.json({ message: "Please enter credentials" });
    }

    const user = await UserModel.findOne({ email: identifier });
    if (!user) {
      return NextResponse.json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({
        message: "Incorrect password. Please try again.",
      });
    }

    const token = await new jose.SignJWT({
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin,
      isPantry: user.isPantry,
      isDelivery: user.isDelivery,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(timeOut)
      .sign(secret);

    const response = NextResponse.json({
      message: "User login successful",
      identifier,
      token,
      id: user._id,
      isAdmin: user.isAdmin,
      isPantry: user.isPantry,
      isDelivery: user.isDelivery,
    });

    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
