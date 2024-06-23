import axios from 'axios';

export async function fetchPopularTweets() {
  try {
    const response = await axios.get('/api/tweets/popular');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular tweets', error);
    throw error;
  }
}