import { connect } from "@/dbConfig/dbConfig";
import {User} from "@/models/userModel";
import { sendEmail } from "@/utils/mailer";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = request.json();
    const { username, emailId, password } = reqBody;
    const user = await User.findOne({ emailId });
    if (user) {
      return NextResponse.json(
        {
          error: "User already exist",
        },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      username,
      emailId,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    await sendEmail({
      emailId,
      emailType: "VERIFY",
      userId: savedUser._id.toString(),
    });
    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      user:{
        id:newUser._id,
        emailId: newUser.emailId,
      }
    },{status:201});
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
