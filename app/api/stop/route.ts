import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function GET(request:NextRequest) {
    const token = cookies().get('JWTtoken')

    if (!token) {
        NextResponse.redirect('/')
    }

    else {
        // Get bot type from request
        const header = request.headers
        const bot = header.get("bot")

        // Constants from environment
        const server_url = process.env.SERVER_IP;
        const bot_url = process.env.BOT_URL;

        const stop_url_iot = process.env.IOT_BOT_STOP;
        const stop_url_ros = process.env.ROS_BOT_STOP;

        
        if (!stop_url_iot || !server_url || !bot_url) {
            throw new Error('stop url not defined')
        }

        // Construct final URL
        const final_url = server_url + bot_url + (bot == "iot" ? stop_url_iot : stop_url_ros)


        console.log(final_url);

        // Make the stop request
        const res = await fetch(final_url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        });

        return new NextResponse('Stopped');
    }
}