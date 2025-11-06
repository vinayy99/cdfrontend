import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { useAppContext } from '../context/AppContext';
import SkillBadge from './SkillBadge';

interface ProjectCardProps { project: Project; }

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { findUserById } = useAppContext();
  const creator = findUserById(project.creatorId);
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          {creator && (<img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full mr-3" />)}
          <div>
            <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
            {creator && <p className="text-sm text-gray-500">by {creator.name}</p>}
          </div>
        </div>
        <p className="text-gray-600 mb-4 h-24 overflow-hidden text-ellipsis">{project.description}</p>
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map(skill => (<SkillBadge key={skill} skill={skill} />))}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4">
        <Link to={`/project/${project.id}`} className="w-full text-center bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition block">View Details</Link>
      </div>
    </div>
  );
};

export default ProjectCard;



