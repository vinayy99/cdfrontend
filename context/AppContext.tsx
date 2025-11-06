import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Project, SkillSwap } from '../types';
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
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillSwaps, setSkillSwaps] = useState<SkillSwap[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [usersData, projectsData] = await Promise.all([
        api.getUsers(),
        api.getProjects()
      ]);
      setUsers(usersData);
      setProjects(projectsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (token && currentUser) { fetchSkillSwaps(); } }, [token, currentUser]);

  const fetchSkillSwaps = async () => {
    if (!token) return;
    try { setSkillSwaps(await api.getSkillSwaps(token)); }
    catch { console.error("Failed to fetch skill swaps"); }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await api.login(email, password);
      setCurrentUser(result.user);
      setToken(result.token);
      localStorage.setItem('token', result.token);
      await fetchData();
      await fetchSkillSwaps();
      return true;
    } catch {
      setError('Invalid email or password.');
      return false;
    } finally { setLoading(false); }
  };

  const logout = () => { setCurrentUser(null); setToken(null); localStorage.removeItem('token'); };

  const signup = async (newUser: Omit<User, 'id' | 'avatar' | 'available'>) => {
    setLoading(true);
    try {
      const result = await api.register(newUser.name, newUser.email, newUser.password || '', newUser.skills, newUser.bio);
      setCurrentUser(result.user);
      setToken(result.token);
      localStorage.setItem('token', result.token);
      await fetchData();
      await fetchSkillSwaps();
      return true;
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      return false;
    } finally { setLoading(false); }
  };

  const findUserById = (id: number) => users.find(u => u.id === id);
  const findProjectById = (id: number) => projects.find(p => p.id === id);

  const joinProject = async (projectId: number) => {
    if (!currentUser || !token) return;
    await api.joinProject(projectId, token);
    await fetchData();
  };

  const createProject = async (title: string, description: string, requiredSkills: string[]): Promise<boolean> => {
    if (!currentUser || !token) return false;
    try {
      await api.createProject(title, description, requiredSkills, token);
      await fetchData(); // ✅ Refresh projects so everyone sees the new one
      return true;
    } catch (err) {
      console.error('Failed to create project:', err);
      return false;
    }
  };

  const toggleAvailability = async () => {
    if (!currentUser) return;
    await api.toggleUserAvailability(currentUser.id);
    await fetchData();
  };

  const updateSkillSwapStatus = async (swapId: number, status: 'accepted' | 'declined') => {
    if (!token) return;
    await api.updateApplicationStatus(swapId, status, token);
    await fetchSkillSwaps();
  };

  const proposeSkillSwap = async (swapData: Omit<SkillSwap, 'id' | 'status' | 'fromUserId'>) => {
    if (!currentUser || !token) return;
    await api.proposeSkillSwap(swapData.toUserId, swapData.offeredSkill, swapData.requestedSkill, swapData.message, token);
    await fetchSkillSwaps();
  };

  const refreshData = () => { fetchData(); if (token) fetchSkillSwaps(); };
  const clearError = () => { setError(null); };

  return (
    <AppContext.Provider value={{ users, projects, skillSwaps, currentUser, token, loading, error, login, logout, signup, findUserById, findProjectById, joinProject, createProject, toggleAvailability, updateSkillSwapStatus, proposeSkillSwap, refreshData, clearError }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
