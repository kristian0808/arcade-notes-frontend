export interface Member {
  member_id: number;
  member_account: string;
  member_first_name?: string;
  member_last_name?: string;
  member_balance?: string;
  member_points?: string;
  member_is_active?: number;
  // Add other member properties as needed
}

export interface MembersResponse {
  members: Member[];
}

export interface MemberRanking {
  memberAccount: string;
  totalHours: number;
  sessionCount: number;
  avgSessionHours: number;
  totalTopups: number;
  lastActive: string | null;
}

export type TimeframeType = 'day' | 'week' | 'month' | 'all';
