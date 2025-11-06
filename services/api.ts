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
    credentials: "include", // ✅ send cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, skills, bio })
  });
  return await r.json();
}

export async function login(email: string, password: string) {
  const r = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include", // ✅ send cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return await r.json();
}

// USERS
export async function getUsers(): Promise<User[]> {
  const r = await fetch(`${API_BASE_URL}/users`, {
    credentials: "include" // ✅ ensure logged in user is recognized
  });
  return await r.json();
}

// PROJECTS
export async function getProjects(): Promise<Project[]> {
  const r = await fetch(`${API_BASE_URL}/projects`, {
    credentials: "include"
  });
  return await r.json();
}

// SKILL SWAPS
export async function getSkillSwaps(token: string): Promise<SkillSwap[]> {
  const r = await fetch(`${API_BASE_URL}/skill-swaps`, {
    credentials: "include", // ✅ required
    headers: { Authorization: `Bearer ${token}` }
  });
  return await r.json();
}

export async function proposeSkillSwap(toUserId: number, offeredSkill: string, requestedSkill: string, message: string, token: string) {
  const r = await fetch(`${API_BASE_URL}/skill-swaps`, {
    method: "POST",
    credentials: "include", // ✅
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ toUserId, offeredSkill, requestedSkill, message })
  });
  return await r.json();
}

export async function updateSkillSwapStatus(id: number, status: 'accepted' | 'declined', token: string) {
  const r = await fetch(`${API_BASE_URL}/skill-swaps/${id}/status`, {
    method: "PATCH",
    credentials: "include", // ✅
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status })
  });
  return await r.json();
}

export async function getSkillSwapMessages(id: number, token: string): Promise<SkillSwapMessage[]> {
  const r = await fetch(`${API_BASE_URL}/skill-swaps/${id}/messages`, {
    credentials: "include", // ✅
    headers: { Authorization: `Bearer ${token}` }
  });
  return await r.json();
}

export async function postSkillSwapMessage(id: number, message: string, token: string): Promise<SkillSwapMessage> {
  const r = await fetch(`${API_BASE_URL}/skill-swaps/${id}/messages`, {
    method: "POST",
    credentials: "include", // ✅
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message })
  });
  return await r.json();
}

export async function getSkillSwapHistory(id: number, token: string): Promise<SkillSwapStatusHistory[]> {
  const r = await fetch(`${API_BASE_URL}/skill-swaps/${id}/history`, {
    credentials: "include", // ✅
    headers: { Authorization: `Bearer ${token}` }
  });
  return await r.json();
}
