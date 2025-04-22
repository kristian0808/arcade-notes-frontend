export interface BillingLog {
  log_id: number;
  log_member_account: string;
  log_pc_name: string;
  log_event: string;
  log_money: string;
  log_card: string;
  log_bonus: string;
  log_used_secs: string;
  log_date_local: string;
  log_details: string;
  // Add any other fields you need
}

export interface BillingLogsPagination {
  total_records: number;
  pages: number;
  page: string;
  page_prev: number;
  page_next: number;
}

export interface BillingLogsResponse {
  log_list: BillingLog[];
  paging_info: BillingLogsPagination;
  total: {
    log_bonus: string;
    log_money: string;
    log_card: string;
    log_used_secs: string;
    [key: string]: string;
  };
  event_list: string[];
}
