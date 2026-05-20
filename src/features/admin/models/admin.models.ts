export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    is_staff: boolean;
  };
}

export interface SoftBanPayload {
  ip_address: string;
}

export interface AdminDashboardStats {
  active_ips_count: number;
  visited_ips_count: number;
  queue_size: number;
  active_sessions: number;
  active_soft_bans_count: number;
}

export interface ActiveSoftBan {
  ip_address: string;
  reason: string;
  expires_at: string;
  created_at: string;
  remaining_seconds: number;
  remaining_minutes: number;
}

export interface AdminDashboardResponse {
  generated_at: string;
  stats: AdminDashboardStats;
  active_ips: string[];
  visited_ips: string[];
  active_soft_bans: ActiveSoftBan[];
  banned_ip_addresses: string[];
}
