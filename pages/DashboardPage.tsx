import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import SkillBadge from '../components/SkillBadge';

const DashboardPage: React.FC = () => {
  const { currentUser, projects, toggleAvailability, users, proposeSkillSwap } = useAppContext();
  const [swapData, setSwapData] = useState({
    toUserId: '',
    offeredSkill: '',
    requestedSkill: '',
    message: ''
  });
  const [swapMessage, setSwapMessage] = useState('');

  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  const userProjects = projects.filter(
    p => p.creatorId === currentUser.id || p.members.includes(currentUser.id)
  );

  const handleSwapInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSwapData({ ...swapData, [e.target.name]: e.target.value });
  };

  const handleProposeSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapData.toUserId || !swapData.offeredSkill || !swapData.requestedSkill || !swapData.message) {
        setSwapMessage('Please fill out all fields.');
        return;
    }
    
    proposeSkillSwap({
        toUserId: parseInt(swapData.toUserId, 10),
        offeredSkill: swapData.offeredSkill,
        requestedSkill: swapData.requestedSkill,
        message: swapData.message,
    });
    
    setSwapMessage('Skill swap proposal sent successfully!');
    setSwapData({ toUserId: '', offeredSkill: '', requestedSkill: '', message: '' });
    setTimeout(() => setSwapMessage(''), 3000);
  };

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary"
          />
          <h2 className="text-2xl font-bold text-dark">{currentUser.name}</h2>
          <p className="text-gray-500 mb-4">{currentUser.email}</p>
          <p className="text-gray-600 mb-4">{currentUser.bio}</p>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {currentUser.skills.map(skill => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 mt-6">
            <span className={`text-sm font-medium ${currentUser.available ? 'text-green-600' : 'text-gray-500'}`}>
              Available for collaboration
            </span>
            <button
                onClick={toggleAvailability}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${currentUser.available ? 'bg-primary' : 'bg-gray-200'}`}
            >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${currentUser.available ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects and Skill Swap Section */}
      <div className="lg:col-span-2 space-y-8">
        {/* My Projects */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-dark mb-4">My Projects</h3>
          {userProjects.length > 0 ? (
            <ul className="space-y-4">
              {userProjects.map(project => (
                <li key={project.id} className="p-4 border rounded-md hover:bg-gray-50 transition">
                  <Link to={`/project/${project.id}`} className="block">
                    <h4 className="font-semibold text-primary">{project.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You haven't created or joined any projects yet.</p>
          )}
        </div>

        {/* Skill Swap Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-dark mb-4">Propose a Skill Swap</h3>
            <p className="text-gray-600 mb-4">
              Offer one of your skills in exchange for learning another from a fellow collaborator.
            </p>
            <form onSubmit={handleProposeSwap} className="space-y-4">
              <select name="toUserId" value={swapData.toUserId} onChange={handleSwapInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                <option value="" disabled>Select a user to contact</option>
                {otherUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <input type="text" name="offeredSkill" placeholder="Skill I can offer (e.g., React)" value={swapData.offeredSkill} onChange={handleSwapInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" name="requestedSkill" placeholder="Skill I want to learn (e.g., Python)" value={swapData.requestedSkill} onChange={handleSwapInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
              <textarea name="message" placeholder="Write a short message..." rows={2} value={swapData.message} onChange={handleSwapInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
              <button type="submit" className="w-full bg-secondary text-white py-2 rounded-md font-semibold hover:bg-emerald-600 transition">
                Send Proposal
              </button>
              {swapMessage && <p className={`text-sm text-center mt-2 ${swapMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{swapMessage}</p>}
            </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;