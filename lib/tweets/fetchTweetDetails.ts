import axios from 'axios';

export async function fetchTweetDetails(tweet_id: string) {
  try {
    const response = await axios.get(`/api/tweets/${tweet_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tweet details', error);
    throw error;
  }
}