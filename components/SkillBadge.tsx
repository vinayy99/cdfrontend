import React from 'react';

interface SkillBadgeProps { skill: string; }

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => (
  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
);

export default SkillBadge;



