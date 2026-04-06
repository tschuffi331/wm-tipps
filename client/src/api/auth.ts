import api from './axiosInstance';
import type { AuthResponse, User } from '../types';

export async function register(
  username: string,
  password: string,
  avatarFile?: File
): Promise<AuthResponse> {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);
  if (avatarFile) form.append('avatar', avatarFile);
  const { data } = await api.post<AuthResponse>('/auth/register', form);
  return data;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { username, password });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}
