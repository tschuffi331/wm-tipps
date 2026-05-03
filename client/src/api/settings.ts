import api from './axiosInstance';
import type { PasswordRules, WmPhase } from '../types';

export async function getPasswordRules(): Promise<PasswordRules> {
  const { data } = await api.get<PasswordRules>('/admin/settings');
  return data;
}

export async function updatePasswordRules(rules: Partial<PasswordRules>): Promise<PasswordRules> {
  const { data } = await api.put<PasswordRules>('/admin/settings', rules);
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.put('/users/me/password', { currentPassword, newPassword });
}

export async function getPublicPhase(): Promise<WmPhase> {
  const { data } = await api.get<{ wmPhase: WmPhase }>('/settings/phase');
  return data.wmPhase;
}
