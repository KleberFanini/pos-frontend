import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // 3s timeout to quickly fallback if backend server is not running
});

let isBackendOnline = false;

export const checkBackendStatus = async (): Promise<boolean> => {
  try {
    // Try reaching departments or swagger-ui endpoint
    await axios.get(`${API_BASE_URL}/departments`, { timeout: 2000 });
    isBackendOnline = true;
  } catch (err: any) {
    // If we get 200 or any 4xx response from server, it means backend is up!
    if (err.response) {
      isBackendOnline = true;
    } else {
      isBackendOnline = false;
    }
  }
  return isBackendOnline;
};

export const getBackendOnlineStatus = () => isBackendOnline;

export const setBackendOnlineStatus = (status: boolean) => {
  isBackendOnline = status;
};

export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.details) {
    const details = error.response.data.details;
    return Object.values(details).join(', ');
  }
  if (error?.message) {
    return error.message;
  }
  return 'Ocorreu um erro ao processar a requisição.';
};
