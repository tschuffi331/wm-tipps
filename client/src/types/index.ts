export interface Team {
  id: number;
  name: string;
  short_name: string;
  flag_emoji: string | null;
}

export interface Match {
  id: number;
  match_number: number;
  group_name: string;
  matchday: number;
  kickoff_utc: string;
  venue: string | null;
  status: 'scheduled' | 'live' | 'finished';
  home_goals: number | null;
  away_goals: number | null;
  home_team: Team;
  away_team: Team;
}

export interface Tip {
  id: number;
  match_id: number;
  home_goals_tip: number;
  away_goals_tip: number;
  points_awarded: number | null;
  submitted_at: string;
}

export interface User {
  id: number;
  username: string;
  avatar_url: string;
  role: 'user' | 'admin';
  total_points?: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: number;
  username: string;
  avatar_url: string;
  total_points: number;
  exact_scores: number;
  correct_outcomes: number;
  tips_evaluated: number;
  tips_total: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
