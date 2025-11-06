import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Project, SkillSwap } from '../types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_SKILL_SWAPS } from '../constants';
import * as api from '../services/api';

interface AppContextType {
  users: User[];
  projects: Project[];
  skillSwaps: SkillSwap[];
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (newUser: Omit<User, 'id' | 'avatar' | 'available'>) => Promise<boolean>;
  findUserById: (id: number) => User | undefined;
  findProjectById: (id: number) => Project | undefined;
  joinProject: (projectId: number) => void;
  createProject: (title: string, description: string, requiredSkills: string[]) => Promise<boolean>;
  toggleAvailability: () => void;
  updateSkillSwapStatus: (swapId: number, status: 'accepted' | 'declined') => void;
  proposeSkillSwap: (swapData: Omit<SkillSwap, 'id' | 'status' | 'fromUserId'>) => void;
  refreshData: () => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [skillSwaps, setSkillSwaps] = useState<SkillSwap[]>(MOCK_SKILL_SWAPS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [usersData, projectsData] = await Promise.all([
        api.getUsers().catch(() => MOCK_USERS),
        api.getProjects().catch(() => MOCK_PROJECTS),
      ]);
      setUsers(usersData as User[]);
      setProjects(projectsData as Project[]);
    } catch (err) {
      console.log('Using mock data as backend is not available:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (token && currentUser) { fetchSkillSwaps(); } }, [token, currentUser]);

  const fetchSkillSwaps = async () => {
    if (!token) return;
    try { setSkillSwaps(await api.getSkillSwaps(token)); } catch { setSkillSwaps(MOCK_SKILL_SWAPS); }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      try {
        const result = await api.login(email, password);
        setCurrentUser(result.user); setToken(result.token); localStorage.setItem('token', result.token);
        setUsers(prev => (!prev.find(u => u.id === result.user.id) ? [...prev, result.user] : prev));
        await fetchSkillSwaps();
        return true;
      } catch (apiErr) {
        console.log('API login failed, trying mock data:', apiErr);
        const user = users.find(u => u.email === email);
        if (user) { setCurrentUser(user); return true; }
        setError('Invalid email or password.');
        return false;
      }
    } catch (err: any) { setError(err.message || 'Login failed'); return false; }
    finally { setLoading(false); }
  };

  const logout = () => { setCurrentUser(null); setToken(null); localStorage.removeItem('token'); };

  const signup = async (newUser: Omit<User, 'id' | 'avatar' | 'available'>) => {
    try {
      setLoading(true); setError(null);
      const result = await api.register(newUser.name, newUser.email, newUser.password || '', newUser.skills, newUser.bio);
      setCurrentUser(result.user); setToken(result.token); localStorage.setItem('token', result.token);
      setUsers(prev => [...prev, result.user]); await fetchSkillSwaps(); return true;
    } catch (err: any) { setError(err.message || 'Signup failed'); console.error('Signup error:', err); return false; }
    finally { setLoading(false); }
  };

  const findUserById = (id: number) => users.find(u => u.id === id);
  const findProjectById = (id: number) => projects.find(p => p.id === id);

  const joinProject = async (projectId: number) => {
    if (!currentUser || !token) return;
    try { await api.joinProject(projectId, token); setProjects(prev => prev.map(p => p.id === projectId && !p.members.includes(currentUser.id) ? { ...p, members: [...p.members, currentUser.id] } : p)); }
    catch { setProjects(prev => prev.map(p => p.id === projectId && !p.members.includes(currentUser.id) ? { ...p, members: [...p.members, currentUser.id] } : p)); }
  };

  const createProject = async (title: string, description: string, requiredSkills: string[]): Promise<boolean> => {
    if (!currentUser || !token) return false;
    try {
      const newProject = await api.createProject(title, description, requiredSkills, token);
      setProjects(prev => [...prev, { ...newProject, creatorId: newProject.creatorId || newProject.creator_id || currentUser.id, requiredSkills: newProject.requiredSkills || requiredSkills }]);
      return true;
    } catch (err) {
      console.error('Failed to create project:', err);
      // Fallback: add to local state
      const mockProject: Project = {
        id: Math.max(0, ...projects.map(p => p.id)) + 1,
        title,
        description,
        requiredSkills,
        creatorId: currentUser.id,
        members: [currentUser.id]
      };
      setProjects(prev => [...prev, mockProject]);
      return true;
    }
  };

  const toggleAvailability = async () => {
    if (!currentUser) return;
    try { if (token) await api.toggleUserAvailability(currentUser.id); const updated = { ...currentUser, available: !currentUser.available }; setCurrentUser(updated); setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u)); }
    catch { const updated = { ...currentUser, available: !currentUser.available }; setCurrentUser(updated); setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u)); }
  };

  const updateSkillSwapStatus = async (swapId: number, status: 'accepted' | 'declined') => {
    if (!token) return; try { await api.updateSkillSwapStatus(swapId, status, token); setSkillSwaps(prev => prev.map(s => s.id === swapId ? { ...s, status } : s)); }
    catch { setSkillSwaps(prev => prev.map(s => s.id === swapId ? { ...s, status } : s)); }
  };

  const proposeSkillSwap = async (swapData: Omit<SkillSwap, 'id' | 'status' | 'fromUserId'>) => {
    if (!currentUser || !token) return; try { const newSwap = await api.proposeSkillSwap(swapData.toUserId, swapData.offeredSkill, swapData.requestedSkill, swapData.message, token); setSkillSwaps(prev => [...prev, newSwap]); }
    catch { const newSwap: SkillSwap = { ...swapData, id: Math.max(0, ...skillSwaps.map(s => s.id)) + 1, status: 'pending', fromUserId: currentUser.id }; setSkillSwaps(prev => [...prev, newSwap]); }
  };

  const refreshData = () => { fetchData(); if (token) fetchSkillSwaps(); };
  
  const clearError = () => { setError(null); };

  const value = { users, projects, skillSwaps, currentUser, token, loading, error, login, logout, signup, findUserById, findProjectById, joinProject, createProject, toggleAvailability, updateSkillSwapStatus, proposeSkillSwap, refreshData, clearError };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};



