import { cookies } from 'next/headers';
import axios from 'axios';

// Check for JWT
const checkCred = async () => {

  // Get JWTtoken
  const token = cookies().get('JWTtoken')?.value;

  // Return false on no token
  if (!token) {
    return { status: false, msg: 'Token not found in cookies' };
  }

  try {
    // Construct URL from environment variables
    const server_ip = process.env.SERVER_IP;
    const valid_url = process.env.VALIDATION_URL;

    if (!valid_url || !server_ip) {
      throw new Error(' valid url URL not defined')
    }

    // Make a POST request to confirm JWTtoken
    const response = await axios.get(server_ip + valid_url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    
    return { status: true, msg: 'Authenticated', bot: response.data.bot }
  } catch (error) {
    // Error handling
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return { status: false, msg: 'Authorization failed' };
      } else if (error.response?.status === 400) {
        return { status: false, msg: 'Bad Request' };
      }
    }
    return { status: false, msg: 'An unexpected error occurred' };
  }
};

export default checkCred;