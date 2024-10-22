import { cookies } from 'next/headers';
import axios from 'axios';

const checkCred = async () => {
  const token = cookies().get('JWTtoken')?.value;
  console.log(token)
  if (!token) {
    return { status: false, msg: 'Token not found in cookies' };
  }

  try {
    const valid_url = process.env.VALIDATION_URL
    if(!valid_url)
    {
      throw new Error(' valid url URL not defined')
    }
    const response = await axios.get(valid_url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return {status:true , msg:'Authenticated'}
  } catch (error) {
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