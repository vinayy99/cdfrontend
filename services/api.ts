const API_BASE_URL = import.meta.env.VITE_API_URL;

import type {
  User,
  Project,
  SkillSwap,
  SkillSwapMessage,
  SkillSwapStatusHistory
} from "../types";

// AUTH
export async function register(name: string, email: string, password: string, skills: string[], bio: string) {
  const r = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, skills, bio })
  });
  return await r.json();
}

export async function login(email: string, password: string) {
  const r = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return await r.json();
}

// USERS
export async function getUsers(): Promise<User[]> {
  const r = await fetch(`${API_BASE_URL}/users`);
  return await r.json();
}

// PROJECTS
export async function getProjects(): Promise<Project[]> {
  const r = await fetch(`${API_BASE_URL}/projects`);
  return await r.json();
}

// SKILL SWAPS
export async function getSkillSwaps(token: string): Promise<SkillSwap[]> {
  const r = await fetch(`${API_BASE_URL}/skill-swaps`, { headers: { Authorization: `Bearer ${token}` } });
  return await r.json();
}

export async function proposeSkillSwap(toUserId: number, offeredSkill: string, requestedSkill: string, message: string, token: string) {
  const r = await fetch(`${API_BASE_URL}/skill-swaps`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ toUserId, offeredSkill, requestedSkill, message })
  });
  return await r.json();
}

export async function updateSkillSwapStatus(id: number, status: 'accepted' | 'declined', token: string) {
  const r = await fetch(`${API_BASE_URL}/skill-swaps/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status })
  });
  return await r.json();
}

export async function getSkillSwapMessages(id: number, token: string): Promise<SkillSwapMessage[]> {
  const r = await fetch(`${API_BASE_URL}/skill-swaps/${id}/messages`, { headers: { Authorization: `Bearer ${token}` } });
  return await r.json();
}

export async function postSkillSwapMessage(id: number, message: string, token: string): Promise<SkillSwapMessage> {
  const r = await fetch(`${API_BASE_URL}/skill-swaps/${id}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message })
  });
  return await r.json();
}

export async function getSkillSwapHistory(id: number, token: string): Promise<SkillSwapStatusHistory[]> {
  const r = await fetch(`${API_BASE_URL}/skill-swaps/${id}/history`, { headers: { Authorization: `Bearer ${token}` } });
  return await r.json();
}
