import api from './axiosInstance';
import type { Match } from '../types';

export async function fetchAdminMatches(): Promise<Match[]> {
  const { data } = await api.get<Match[]>('/admin/matches');
  return data;
}

export async function setMatchResult(matchId: number, homeGoals: number, awayGoals: number) {
  const { data } = await api.put(`/admin/matches/${matchId}/result`, { homeGoals, awayGoals });
  return data;
}

export interface LiveResult {
  match_id: number;
  match_number: number;
  home_team: string;
  away_team: string;
  home_goals: number;
  away_goals: number;
  already_saved: boolean;
}

export async function updateAvatar(file: File): Promise<{ avatar_url: string }> {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await api.put<{ avatar_url: string }>('/users/me', form);
  return data;
}

export async function deleteAvatar(): Promise<{ avatar_url: string }> {
  const { data } = await api.delete<{ avatar_url: string }>('/users/me/avatar');
  return data;
}
