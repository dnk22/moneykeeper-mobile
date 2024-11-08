import axios from 'axios';
import { BASE_URL } from 'utils/constants';

// Set config defaults when creating the instance
const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const requestSuccess = ({ error, data }: { error?: string | unknown; data?: any }) => {
  return Promise.resolve({
    success: true,
    data,
    error,
  });
};
export const handleError = ({ error, data }: { error: string | unknown; data?: any }) => {
  return Promise.reject({
    success: false,
    error,
    data,
  });
};

export default AxiosInstance;
