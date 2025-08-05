import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();
  const admin = await Admin.findOne({ email });

  if (email === admin.email && password === admin.password) {
    const token = jwt.sign({ id: admin._id, email: admin.email }, "hjhkj", {
      expiresIn: "1d",
    });
    const response = NextResponse.json({
      message: "success",
      status: 200,
      data: token,
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400,
    });

    return response;
  } else {
    return NextResponse.json({
      message: "Opps! email and password are invalid",
      status: 401,
    });
  }
}


//logout and clear cookies token
export async function GET() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    path: "/",
  });
  return response;
}