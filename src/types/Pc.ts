export enum PcStatus {
    AVAILABLE = 'available',
    IN_USE = 'in_use',
    OFFLINE = 'offline',
    MAINTENANCE = 'maintenance'
  }
  
export interface Pc {
    pc_id: string;
    pc_name: string;
    status: PcStatus;
    current_member_id?: number;
    current_member_account?: string;
    time_left?: string;
    has_notes?: boolean; // Flag to indicate if there are active notes for this PC
    has_active_tab?: boolean; // Flag to indicate if the current user has an active tab
}
