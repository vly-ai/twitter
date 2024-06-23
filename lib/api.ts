import axios from 'axios';

export async function apiGet(url: string, config = {}) {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error(`GET ${url} failed: `, error);
    throw error;
  }
}

export async function apiPost(url: string, data: any, config = {}) {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`POST ${url} failed: `, error);
    throw error;
  }
}