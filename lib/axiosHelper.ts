import axios from 'axios';

export async function fetchFollowers(url: string, config = {}) {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error(`GET ${url} failed: `, error);
    throw error;
  }
}