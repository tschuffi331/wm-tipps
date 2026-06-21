import api from './axiosInstance';

export interface AiTip {
  home_goals: number;
  away_goals: number;
  reasoning: string;
}

export async function fetchAiTip(matchId: number): Promise<AiTip> {
  const { data } = await api.get<AiTip>(`/ai/tip/${matchId}`);
  return data;
}
