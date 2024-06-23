import axios from 'axios';

export async function fetchPersonalizedFeed(token: string) {
  try {
    const response = await axios.get('/api/tweets/feed', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching personalized feed', error);
    throw error;
  }
}