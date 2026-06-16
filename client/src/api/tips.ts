import api from './axiosInstance';
import type { Tip } from '../types';

export interface MatchTip {
  id: number;
  home_goals_tip: number;
  away_goals_tip: number;
  points_awarded: number | null;
  user_id: number;
  username: string;
  avatar_url: string | null;
}

export async function fetchMatchTips(matchId: number): Promise<MatchTip[]> {
  const { data } = await api.get<MatchTip[]>(`/tips/match/${matchId}`);
  return data;
}

export async function fetchMyTips(): Promise<Tip[]> {
  const { data } = await api.get<Tip[]>('/tips');
  return data;
}

export async function submitTip(matchId: number, homeGoalsTip: number, awayGoalsTip: number): Promise<Tip> {
  const { data } = await api.post<Tip>('/tips', { matchId, homeGoalsTip, awayGoalsTip });
  return data;
}

export async function updateTip(tipId: number, homeGoalsTip: number, awayGoalsTip: number): Promise<Tip> {
  const { data } = await api.put<Tip>(`/tips/${tipId}`, { homeGoalsTip, awayGoalsTip });
  return data;
}
