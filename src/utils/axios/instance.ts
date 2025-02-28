import axios from 'axios';
import { BASE_URL, API_TIMEOUT } from '../constants/api.constants';

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default AxiosInstance;
