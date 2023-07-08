import axios from 'axios';
import { BASE_URL } from 'utils/constant';

// Set config defaults when creating the instance
const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default AxiosInstance;
