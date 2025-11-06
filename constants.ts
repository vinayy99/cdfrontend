import { User, Project, SkillSwap } from './types';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', skills: ['React','Node.js','UI/UX Design'], bio: 'Full-stack developer with a passion for creating beautiful and intuitive user interfaces.', avatar: 'https://picsum.photos/seed/alice/200', available: true },
  { id: 2, name: 'Bob Williams', email: 'bob@example.com', skills: ['Python','Data Science','Machine Learning'], bio: 'Data scientist focused on building predictive models and analyzing large datasets.', avatar: 'https://picsum.photos/seed/bob/200', available: false },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', skills: ['Graphic Design','Illustration','Branding'], bio: 'Creative graphic designer specializing in branding and digital illustration.', avatar: 'https://picsum.photos/seed/charlie/200', available: true }
];

export const MOCK_PROJECTS: Project[] = [
  { id: 1, title: 'Eco-Friendly Marketplace App', description: 'A mobile application to connect buyers and sellers of sustainable and eco-friendly products. We aim to build a community around conscious consumerism. We need a frontend developer to build the React Native app and a UI/UX designer to finalize the mockups.', requiredSkills: ['React Native','UI/UX Design','Firebase'], creatorId: 1, members: [1] },
  { id: 2, title: 'AI-Powered Personal Finance Advisor', description: 'Developing an AI tool that provides personalized financial advice based on user spending habits. The core of the project is a machine learning model that predicts future expenses and suggests savings strategies. We need data scientists and backend developers.', requiredSkills: ['Python','Machine Learning','Flask'], creatorId: 2, members: [2] },
  { id: 3, title: 'Branding for a New Tech Startup', description: 'We are a new startup in the ed-tech space looking for a talented designer to create our complete brand identity. This includes a logo, color palette, typography, and marketing materials. Experience with modern and minimalist design is a plus.', requiredSkills: ['Branding','Logo Design','Illustration'], creatorId: 3, members: [3] }
];

export const MOCK_SKILL_SWAPS: SkillSwap[] = [
  { id: 1, fromUserId: 2, toUserId: 1, offeredSkill: 'Python Basics', requestedSkill: 'React Fundamentals', status: 'pending', message: 'Hey Alice, I can teach you Python for data analysis if you could help me get started with React for a personal project. Let me know!' },
  { id: 2, fromUserId: 1, toUserId: 3, offeredSkill: 'Intro to Web Development', requestedSkill: 'Logo Design Principles', status: 'accepted', message: 'Hi Charlie, I love your design work! I can give you a crash course on HTML/CSS/JS if you can teach me some logo design basics.' }
];



