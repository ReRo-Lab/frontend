import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const data = request.body;
    const headers = request.headers
    
    // Get JWT from header
    const jwt = headers.get('jwt');
    
    // Ensure JWT for logout
    if (!jwt) {
        // Edge case: Incase of cleared cookies
        const res = await fetch(`${process.env.SERVER_IP}${process.env.LOGOUT_URL}`, { method: "GET", headers: { "jwt": "" } })
    }
    else {
        // Default case - logout with
        const res = await fetch(`${process.env.SERVER_IP}${process.env.LOGOUT_URL}`, { method: "GET", headers: { "jwt": jwt } })
    }
    return new NextResponse("logged out");
}