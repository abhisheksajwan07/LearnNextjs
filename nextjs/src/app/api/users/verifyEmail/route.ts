import { connect } from "@/dbConfig/dbConfig";
import { User } from "@/models/userModel";

import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    console.log(token);
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json(
        { err: err.message },
        {
          status: 500,
        }
      );
    }
    console.log(user);
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    return NextResponse.json(
      {
        message: "email verified successfully",
        success: true,
      },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { err: err.message },
      {
        status: 500,
      }
    );
  }
}
