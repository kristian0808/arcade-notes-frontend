import apiClient from './apiClient';

interface LoginResponse {
  access_token: string;
  // Add other user details if the backend returns them
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    // Log the error or handle it as needed
    console.error('Login API call failed:', error);
    // Re-throw the error to be caught by the calling component
    throw error;
  }
};

// Optional: Add a function to get user profile if needed
// export const getProfile = async () => {
//   try {
//     const response = await apiClient.get('/profile'); // Adjust endpoint if necessary
//     return response.data;
//   } catch (error) {
//     console.error('Get profile API call failed:', error);
//     throw error;
//   }
// };