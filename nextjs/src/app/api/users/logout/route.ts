import { connect } from "@/dbConfig/dbConfig";

import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "logout Successfully ",
      success: true,
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(),
    });
    return response;
  } catch (err) {
    
  }
}
