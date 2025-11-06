import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Project, SkillSwap } from '../types';
import * as api from '../services/api';

interface CtxType {
  users: User[];
  projects: Project[];
  skillSwaps: SkillSwap[];
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (user: Omit<User, 'id' | 'avatar' | 'available'>) => Promise<boolean>;
  proposeSkillSwap: (data: Omit<SkillSwap, 'id' | 'status' | 'fromUserId'>) => void;
  updateSkillSwapStatus: (id: number, status: 'accepted' | 'declined') => void;
}

const Ctx = createContext<CtxType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillSwaps, setSkillSwaps] = useState<SkillSwap[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const refresh = async () => {
    try {
      const [u, p] = await Promise.all([api.getUsers(), api.getProjects()]);
      setUsers(u);
      setProjects(p);
      if (token) setSkillSwaps(await api.getSkillSwaps(token));
    } catch {}
  };

  useEffect(() => { refresh(); }, [token]);

  const login = async (email: string, password: string) => {
    const r = await api.login(email, password);
    setCurrentUser(r.user);
    setToken(r.token);
    localStorage.setItem("token", r.token);
    refresh();
    return true;
  };

  const logout = () => { setCurrentUser(null); setToken(null); localStorage.removeItem('token'); };

  const signup = async (data: any) => {
    const r = await api.register(data.name, data.email, data.password, data.skills, data.bio);
    setCurrentUser(r.user);
    setToken(r.token);
    localStorage.setItem("token", r.token);
    refresh();
    return true;
  };

  const proposeSkillSwap = async (data: any) => {
    if (!token || !currentUser) return;
    await api.proposeSkillSwap(data.toUserId, data.offeredSkill, data.requestedSkill, data.message, token);
    refresh();
  };

  const updateSkillSwapStatus = async (id: number, status: 'accepted' | 'declined') => {
    if (!token) return;
    await api.updateSkillSwapStatus(id, status, token);
    refresh();
  };

  return (
    <Ctx.Provider value={{ users, projects, skillSwaps, currentUser, token, login, logout, signup, proposeSkillSwap, updateSkillSwapStatus }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAppContext = () => useContext(Ctx)!;
