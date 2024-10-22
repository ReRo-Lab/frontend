import { NextResponse,NextRequest } from 'next/server';
import axios from 'axios';
export async function POST(request:NextRequest) {
  const { username, password } = await request.json();
  try {
    const formData = new FormData();
    formData.append('username',username);
    formData.append('password',password);
    const token_url = process.env.TOKEN_URL ;
    if(!token_url)
    {
      throw new Error('URL not defined')
    }
    console.log(token_url)
    const response = await axios.post(token_url,formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    });
    // Forward the response from the Python backend
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    //console.log(error)
    if (axios.isAxiosError(error)) {
      let message=''
       if(error.response?.status===403)
       {
        message = "Wrong timings"
       }
      console.log(message)
        return NextResponse.json(
          { error: message },
          { status: error.response?.status || 500},
        );
      }
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
  }
}