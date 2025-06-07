import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip interceptor for auth endpoints and if on login page
    if (originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/register') || 
        originalRequest.url?.includes('/auth/refresh') ||
        window.location.pathname === '/login') {
      return Promise.reject(error);
    }

    // If the error status is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 Error detected, logging details instead of auto-refresh:', error);
      
      // Just log out immediately for debugging
      const logoutEvent = new CustomEvent('auth:logout');
      window.dispatchEvent(logoutEvent);
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;