import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET() {
    const token = cookies().get('JWTtoken')
    if(!token)
    {
        NextResponse.redirect('/')
    }
    else
    {
        const stop_url = process.env.IOT_BOT_STOP;
        if(!stop_url)
        {
            throw new Error('stop url not defined')
        }
        const res = await fetch(stop_url,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token.value}`
            }
        })
        console.log(res.body)
        return new NextResponse('Stopped')
    }
}