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
      originalRequest._retry = true;

      try {
        // Clear token refresh loading state if it exists
        const refreshingTokenEvent = new CustomEvent('token:refreshing', { detail: false });
        window.dispatchEvent(refreshingTokenEvent);
        
        // Notify app that token is refreshing
        const startRefreshEvent = new CustomEvent('token:refreshing', { detail: true });
        window.dispatchEvent(startRefreshEvent);
        
        // Attempt to refresh the token
        await apiClient.post('/auth/refresh');
        
        // Token refreshed successfully
        const endRefreshEvent = new CustomEvent('token:refreshing', { detail: false });
        window.dispatchEvent(endRefreshEvent);
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, clear refreshing state
        const endRefreshEvent = new CustomEvent('token:refreshing', { detail: false });
        window.dispatchEvent(endRefreshEvent);
        
        // Clear any auth state in local context
        const logoutEvent = new CustomEvent('auth:logout');
        window.dispatchEvent(logoutEvent);
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;