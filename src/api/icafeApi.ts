import apiClient from './apiClient';
import { Member } from '../types/Member';
import { Pc } from '../types/Pc';
import { ApiResponse } from '../types/ApiResponse';

export const IcafeApi = {
  // Get all PCs with their status
  getAllPcs: async (): Promise<ApiResponse<Pc[]>> => {
    try {
      // This endpoint needs to be implemented on backend
      const response = await apiClient.get('/api/pcs');
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to fetch PCs',
        success: false 
      };
    }
  },

  // Get PC details including current member
  getPcDetails: async (pcName: string): Promise<ApiResponse<Pc>> => {
    try {
      // This endpoint needs to be implemented on backend
      const response = await apiClient.get(`/api/pcs/${pcName}`);
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to fetch PC details',
        success: false 
      };
    }
  },

  // Get all members
  getAllMembers: async (): Promise<ApiResponse<Member[]>> => {
    try {
      // This endpoint needs to be implemented on backend
      const response = await apiClient.get('/api/members',{timeout: 60000});
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to fetch members',
        success: false 
      };
    }
  },

  // Get member details by ID
  getMemberById: async (memberId: number): Promise<ApiResponse<Member>> => {
    try {
      // This endpoint needs to be implemented on backend
      const response = await apiClient.get(`/api/members/${memberId}`);
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to fetch member details',
        success: false 
      };
    }
  },

  // Search members by account name
  searchMembers: async (query: string): Promise<ApiResponse<Member[]>> => {
    try {
      // This endpoint needs to be implemented on backend
      const response = await apiClient.get('/api/members/search', { 
        params: { query } 
      });
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to search members',
        success: false 
      };
    }
  }
};
