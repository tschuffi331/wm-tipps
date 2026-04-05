import api from './axiosInstance';
import type { Tip } from '../types';

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
