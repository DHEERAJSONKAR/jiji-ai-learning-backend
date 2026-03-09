import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const askJiji = async (query) => {
  const response = await axios.post(`${API_BASE_URL}/ask-jiji`, { query });
  return response.data;
};
