export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  skills: string[];
  bio: string;
  avatar: string;
  available: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  creatorId: number;
  members: number[];
}

export type SkillSwapStatus = 'pending' | 'accepted' | 'declined';

export interface SkillSwap {
  id: number;
  fromUserId: number;
  toUserId: number;
  offeredSkill: string;
  requestedSkill: string;
  status: SkillSwapStatus;
  message: string;
}



