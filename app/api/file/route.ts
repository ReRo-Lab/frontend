import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { error } from "console";


interface BodyParams {
    code: string
}


export async function POST(request: NextRequest) {
    // Get JWT Token
    const token = cookies().get('JWTtoken')
    
    // If no token, redirect to login page
    if (!token) {
        NextResponse.redirect('/')
    }
    else {

        // Get headers
        const headers = request.headers
        const bot = headers.get('bot')
        const body: BodyParams = await request.json();

        console.log(body.code)

        // Creating a blob file
        const blob = new Blob([body.code], { type: 'text/x-python' })
        const formData = new FormData();
        
        // Add file to form data
        formData.append('file', blob)
        
        
        try {
            // Construct URL from environment variables
            const server_ip = process.env.SERVER_IP;
            const bot_url = process.env.BOT_URL;
            const file_url = bot === 'iot' ? process.env.FILE_IOT_URL : process.env.FILE_ROS_URL

            // Defined variable checkk
            if (!file_url || !server_ip) {
                throw new Error('URL not defined')
            }

            // Make the POST request to the backend
            const res = await fetch(server_ip + bot_url + file_url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                },
                body: formData
            })

            // Testing code
            // TODO: Remove this code
            const reader = res.body?.getReader();
            let resBody = '';
            if (reader) {
                const decoder = new TextDecoder();
                let done = false;
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) {
                        resBody += decoder.decode(value, { stream: !done });
                    }
                }
            }

            // Alert user
            if (!res.ok) {
                return new NextResponse("File not sent")
            }
            return new NextResponse("File Sent")
        }
        catch (error) {
            console.log("File not sent", error)
            return new NextResponse("File not sent")
        }
    }




}