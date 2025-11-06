// ✅ Must already include /api at the end in your .env
const API_BASE_URL = import.meta.env.VITE_API_URL;

import type { User } from '../types';

export interface Project { id: number; title: string; description: string; requiredSkills: string[]; creatorId: number; members: number[]; creator_id?: number; created_at?: string; updated_at?: string; creator?: User; }

export interface SkillSwap { id: number; fromUserId: number; toUserId: number; offeredSkill: string; requestedSkill: string; status: 'pending' | 'accepted' | 'declined'; message: string; fromUser?: User; toUser?: User; created_at?: string; updated_at?: string; }
export interface SkillSwapMessage { id: number; swap_id: number; sender_id: number; message: string; created_at?: string; sender_name?: string; sender_avatar?: string; }
export interface SkillSwapStatus { id: number; swap_id: number; status: 'pending' | 'accepted' | 'declined'; changed_by: number; created_at?: string; }

// Auth
export async function register(name: string, email: string, password: string, skills: string[], bio: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, skills, bio }) });
  if (!response.ok) { const errorData = await response.json().catch(() => ({ error: 'Registration failed' })); throw new Error(errorData.error || `Registration failed: ${response.status}`); }
  return await response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!response.ok) throw new Error('Login failed');
  return await response.json();
}

// Users
export async function getUsers(): Promise<User[]> { const response = await fetch(`${API_BASE_URL}/users`); if (!response.ok) throw new Error('Failed to fetch users'); return await response.json(); }
export async function getUserById(id: number): Promise<User> { const response = await fetch(`${API_BASE_URL}/users/${id}`); if (!response.ok) throw new Error('Failed to fetch user'); return await response.json(); }
export async function toggleUserAvailability(id: number): Promise<{ available: boolean }> { const response = await fetch(`${API_BASE_URL}/users/${id}/availability`, { method: 'PATCH' }); if (!response.ok) throw new Error('Failed to toggle availability'); return await response.json(); }

// Projects
export async function getProjects(): Promise<Project[]> { const response = await fetch(`${API_BASE_URL}/projects`); if (!response.ok) throw new Error('Failed to fetch projects'); const projects = await response.json(); return projects.map((p: any) => ({ ...p, creatorId: p.creator_id || p.creator_id, requiredSkills: p.requiredSkills || [] })); }
export async function getProjectById(id: number): Promise<Project> { const response = await fetch(`${API_BASE_URL}/projects/${id}`); if (!response.ok) throw new Error('Failed to fetch project'); const project = await response.json(); return { ...project, creatorId: project.creator_id || project.creatorId, requiredSkills: project.requiredSkills || [] }; }
export async function createProject(title: string, description: string, requiredSkills: string[], token: string): Promise<Project> { const response = await fetch(`${API_BASE_URL}/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }, body: JSON.stringify({ title, description, requiredSkills }) }); if (!response.ok) throw new Error('Failed to create project'); const project = await response.json(); return { ...project, creatorId: project.creator_id || project.creatorId, requiredSkills: project.requiredSkills || [] }; }
export async function joinProject(projectId: number, token: string): Promise<void> { const response = await fetch(`${API_BASE_URL}/projects/${projectId}/join`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }); if (!response.ok) throw new Error('Failed to join project'); }

// Applications
export interface ProjectApplication { id: number; project_id: number; user_id: number; message?: string; status: 'pending' | 'accepted' | 'declined'; created_at?: string; updated_at?: string; user_name?: string; user_email?: string; user_avatar?: string; }

export async function applyToProject(projectId: number, message: string, token: string): Promise<ProjectApplication> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ message }) });
  if (!response.ok) { const err = await response.json().catch(() => ({ error: 'Failed to apply' })); throw new Error(err.error || 'Failed to apply'); }
  return await response.json();
}

export async function getProjectApplications(projectId: number, token: string): Promise<ProjectApplication[]> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/applications`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to fetch applications');
  return await response.json();
}

export async function updateApplicationStatus(applicationId: number, status: 'accepted' | 'declined', token: string): Promise<ProjectApplication> {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status }) });
  if (!response.ok) throw new Error('Failed to update application');
  return await response.json();
}

// Skill Swaps
export async function getSkillSwaps(token: string): Promise<SkillSwap[]> { const response = await fetch(`${API_BASE_URL}/skill-swaps`, { headers: { 'Authorization': `Bearer ${token}` } }); if (!response.ok) throw new Error('Failed to fetch skill swaps'); const swaps = await response.json(); return swaps; }

export async function proposeSkillSwap(toUserId: number, offeredSkill: string, requestedSkill: string, message: string, token: string): Promise<SkillSwap> {
  const response = await fetch(`${API_BASE_URL}/skill-swaps`, { method: 'POST', headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` }, body: JSON.stringify({ toUserId, offeredSkill, requestedSkill, message }) });
  if (!response.ok) throw new Error('Failed to propose skill swap');
  return await response.json();
}

// Notifications
export interface NotificationItem { id: number; user_id: number; type: string; title: string; body?: string; link?: string; read_at?: string; created_at?: string; }

export async function getNotifications(token: string): Promise<NotificationItem[]> {
  const res = await fetch(`${API_BASE_URL}/notifications`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return await res.json();
}

export async function getUnreadCount(token: string): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to fetch unread count');
  const data = await res.json();
  return data.count ?? 0;
}

export async function markNotificationRead(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to mark read');
}
