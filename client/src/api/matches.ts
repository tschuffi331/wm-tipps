import api from './axiosInstance';
import type { Match } from '../types';

export async function fetchMatches(params?: {
  group?: string;
  matchday?: number;
  status?: string;
}): Promise<Match[]> {
  const { data } = await api.get<Match[]>('/matches', { params });
  return data;
}

export async function fetchMatch(id: number): Promise<Match> {
  const { data } = await api.get<Match>(`/matches/${id}`);
  return data;
}
