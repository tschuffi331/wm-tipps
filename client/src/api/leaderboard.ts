import api from './axiosInstance';
import type { LeaderboardEntry } from '../types';

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await api.get<LeaderboardEntry[]>('/leaderboard');
  return data;
}
