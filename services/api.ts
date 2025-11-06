// ✅ Must already include /api at the end in your .env
const API_BASE_URL = import.meta.env.VITE_API_URL;

import type { User, Project, SkillSwap, SkillSwapMessage, SkillSwapStatus } from '../types';

// ------------------------------------
// AUTH
// ------------------------------------
export async function register(name: string, email: string, password: string, skills: string[], bio: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, skills, bio })
  });
  if (!response.ok) throw new Error('Registration failed');
  return await response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error('Login failed');
  return await response.json();
}

// ------------------------------------
// USERS
// ------------------------------------
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
}

// ------------------------------------
// PROJECTS
// ------------------------------------
export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  const projects = await response.json();
  return projects.map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    requiredSkills: p.requiredSkills || [],
    creatorId: p.creator_id,
    members: p.members || []
  }));
}

export async function createProject(title: string, description: string, requiredSkills: string[], token: string) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title, description, requiredSkills })
  });
  if (!response.ok) throw new Error('Failed to create project');
  return await response.json();
}

// ------------------------------------
// ✅ SKILL SWAPS (FIXED MAPPING)
// ------------------------------------
export async function getSkillSwaps(token: string): Promise<SkillSwap[]> {
  const res = await fetch(`${API_BASE_URL}/skill-swaps`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch skill swaps");
  const data = await res.json();
  return data.map((s: any) => ({
    id: s.id,
    fromUserId: s.from_user_id,
    toUserId: s.to_user_id,
    offeredSkill: s.offered_skill,
    requestedSkill: s.requested_skill,
    status: s.status,
    message: s.message || ''
  }));
}

export async function proposeSkillSwap(toUserId: number, offeredSkill: string, requestedSkill: string, message: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/skill-swaps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ toUserId, offeredSkill, requestedSkill, message })
  });
  if (!res.ok) throw new Error("Failed to propose skill swap");
  const s = await res.json();
  return {
    id: s.id,
    fromUserId: s.from_user_id,
    toUserId: s.to_user_id,
    offeredSkill: s.offered_skill,
    requestedSkill: s.requested_skill,
    status: s.status,
    message: s.message
  };
}

export async function updateSkillSwapStatus(swapId: number, status: 'accepted' | 'declined', token: string) {
  await fetch(`${API_BASE_URL}/skill-swaps/${swapId}/status`, {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status })
  });
}

// Messaging
export async function getSkillSwapMessages(id: number, token: string): Promise<SkillSwapMessage[]> {
  const res = await fetch(`${API_BASE_URL}/skill-swaps/${id}/messages`, { headers: { 'Authorization': `Bearer ${token}` } });
  return await res.json();
}

export async function postSkillSwapMessage(id: number, message: string, token: string): Promise<SkillSwapMessage> {
  const res = await fetch(`${API_BASE_URL}/skill-swaps/${id}/messages`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message })
  });
  return await res.json();
}

export async function getSkillSwapHistory(id: number, token: string): Promise<SkillSwapStatus[]> {
  const res = await fetch(`${API_BASE_URL}/skill-swaps/${id}/history`, { headers: { 'Authorization': `Bearer ${token}` } });
  return await res.json();
}
