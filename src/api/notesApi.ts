import apiClient from './apiClient';
import { Note, CreateNoteRequest, NotesResponse } from '../types/Note';
import { ApiResponse } from '../types/ApiResponse';

export const NotesApi = {
  // Get notes with various filters
  getNotes: async (
    page = 1,
    limit = 10,
    memberId?: number,
    memberAccount?: string,
    pcName?: string,
    status?: 'active' | 'resolved' | 'all'
  ): Promise<ApiResponse<NotesResponse>> => {
    try {
      const params: {
        page: number;
        limit: number;
        memberId?: number;
        memberAccount?: string;
        pcName?: string;
        status?: 'active' | 'resolved' | 'all';
      } = { page, limit };
      if (memberId) params.memberId = memberId;
      if (memberAccount) params.memberAccount = memberAccount;
      if (pcName) params.pcName = pcName;
      if (status) params.status = status;

      const response = await apiClient.get('/api/notes', { params });
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to fetch notes',
        success: false 
      };
    }
  },

  // Create a new note
  createNote: async (noteData: CreateNoteRequest): Promise<ApiResponse<{ id: string }>> => {
    try {
      const response = await apiClient.post('/api/notes', noteData);
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to create note',
        success: false 
      };
    }
  },

  // Resolve (soft delete) a note
  resolveNote: async (noteId: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      // This endpoint needs to be implemented on backend
      const response = await apiClient.put(`/api/notes/${noteId}/resolve`);
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return { 
        error: err.message || 'Failed to resolve note',
        success: false 
      };
    }
  }
};
