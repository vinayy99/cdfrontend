
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';

const DiscoverPage: React.FC = () => {
  const { projects } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.requiredSkills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-dark">Discover Projects</h1>
        <p className="text-gray-600 mt-2">Find your next creative endeavor and the right team to build it with.</p>
      </div>

      <div className="mb-6 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search projects by title, description, or skill..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-center text-gray-500 md:col-span-2 lg:col-span-3">No projects found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
