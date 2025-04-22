import apiClient from './apiClient';
import { ApiResponse } from '../types/ApiResponse';
import { MemberRanking, TimeframeType } from '../types/Member';

export const RankingsApi = {
  getMemberRankings: async (timeframe: TimeframeType = 'month'): Promise<ApiResponse<MemberRanking[]>> => {
    try {
      const response = await apiClient.get('/api/members/rankings', { 
        params: { timeframe },
        timeout:60000 // 60 seconds timeout 
      });
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to fetch member rankings',
        success: false 
      };
    }
  }
};
