export interface Note {
    id: string;
    content: string;
    memberId: number;
    memberAccount?: string;
    pcName?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateNoteRequest {
    content: string;
    pcName?: string;
    memberId?: number;
    memberAccount?: string;
  }
  
  export interface NotesResponse {
    notes: Note[];
    total: number;
    page: number;
    limit: number;
    message?: string;
  }