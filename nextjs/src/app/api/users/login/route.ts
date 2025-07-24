import { connect } from "@/dbConfig/dbConfig";
import { User } from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { emailId, password } = reqBody;
    const user = await User.findOne({emailId});
    if (!user) {
      return NextResponse.json(
        {
          error: "user doesn't exist",
        },
        { status: 400 }
      );
    }
    console.log("user exists");
    const validPass = await bcryptjs.compare(password, user.password);
    if (!validPass) {
      return NextResponse.json(
        {
          error: "Check your credentials",
        },
        { status: 400 }
      );
    }
    const tokenData = {
      id: user._id,
      username: user.username,
      emailId: user.emailId,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });
    const response = NextResponse.json({
      message: "Logged In Success",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
