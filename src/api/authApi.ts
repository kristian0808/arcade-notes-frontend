import apiClient from './apiClient';
import axios from 'axios';

interface LoginResponse {
  message: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Login API call failed:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Login failed. Please check your credentials.');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Don't throw here - we still want the UI to log out even if the API call fails
  }
};

export const refreshToken = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/refresh');
  } catch (error) {
    console.error('Token refresh failed:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Session expired error
      throw new Error('Your session has expired. Please log in again.');
    }
    throw new Error('Failed to refresh authentication. Please try again.');
  }
};

export const getProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile failed:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch profile data');
  }
};