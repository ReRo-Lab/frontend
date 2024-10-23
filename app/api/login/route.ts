import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {

    // Create form data for user login
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Construct url from environment
    const server_url = process.env.SERVER_IP;
    const token_url = process.env.TOKEN_URL;

    if (!server_url) {
      throw new Error('URL not defined')
    }
    if (!token_url) {
      throw new Error('Token url not defined')
    }

    // Making the request to the backend server
    const response = await axios.post(server_url + token_url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Forward the response from the backend
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let message = ''
      // Mismatched timings error warning for the user
      if (error.response?.status === 403) {
        message = "Wrong timings"
      }
      console.log(message)
      return NextResponse.json(
        { error: message },
        { status: error.response?.status || 500 },
      );
    }

    // Throw server error
    return NextResponse.json(
      { error: 'It\'s not you, it\'s us' },
      { status: 500 }
    );
  }
}