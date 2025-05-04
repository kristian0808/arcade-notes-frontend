import apiClient from './apiClient';

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
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout API call failed:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/refresh');
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile failed:', error);
    throw error;
  }
};