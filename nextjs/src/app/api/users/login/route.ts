import { connect } from "@/dbConfig/dbConfig";
import { User } from "@/models/userModel";

import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request:NextRequest0{
    try{
        const reqBody = await request.json();
        const {emailId,password} = reqBody
    }
    catch(err){

    }
})