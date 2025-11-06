import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Project, SkillSwap } from "../types";
import * as api from "../services/api";

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillSwaps, setSkillSwaps] = useState<SkillSwap[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const load = async () => {
    try {
      setUsers(await api.getUsers());
      setProjects(await api.getProjects());
      if (token) setSkillSwaps(await api.getSkillSwaps(token));
    } catch {}
  };

  useEffect(() => { load(); }, [token, currentUser]);

  // ✅ FIXED LOGIN
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include", // ✅ IMPORTANT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      clearError();
      load();
      return true;
    } catch {
      setError("Invalid email or password");
      return false;
    }
  };

  // ✅ FIXED SIGNUP
  const signup = async ({ name, email, password, skills, bio }: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include", // ✅ IMPORTANT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, skills, bio }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      clearError();
      load();
      return true;
    } catch {
      setError("Signup failed. Try again.");
      return false;
    }
  };

  const clearError = () => setError(null);

  return (
    <AppContext.Provider value={{
      users, projects, skillSwaps, currentUser, token,
      login, signup, clearError, error
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
