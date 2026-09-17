import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {

    console.log("Hi you just hit the get request");
    return Response.json({success:true, data:"hi"});
    
}