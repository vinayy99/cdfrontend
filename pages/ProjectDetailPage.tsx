import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';
import SkillBadge from '../components/SkillBadge';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : undefined;
  const { findProjectById, findUserById, currentUser, token, joinProject, proposeSkillSwap } = useAppContext();
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [swapData, setSwapData] = useState({
    offeredSkill: '',
    requestedSkill: '',
    message: ''
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [applyStatus, setApplyStatus] = useState<string>('');
  const [applications, setApplications] = useState<api.ProjectApplication[]>([]);

  const project = projectId ? findProjectById(projectId) : undefined;
  
  if (!project) {
    return <p className="text-center text-gray-500">Project not found.</p>;
  }

  const creator = findUserById(project.creatorId);
  const members = project.members.map(memberId => findUserById(memberId)).filter(Boolean);

  const isMember = currentUser ? project.members.includes(currentUser.id) : false;
  const isCreator = currentUser?.id === project.creatorId;

  useEffect(() => {
    const fetchApplications = async () => {
      if (isCreator && token && project.id) {
        try {
          const apps = await api.getProjectApplications(project.id, token);
          setApplications(apps);
        } catch {
          setApplications([]);
        }
      }
    };
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreator, token, project.id]);

  const handleJoin = () => {
    if(project.id) {
      joinProject(project.id);
    }
  };

  const handleSwapInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSwapData({ ...swapData, [e.target.name]: e.target.value });
  };

  const handleProposeSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!creator || !swapData.offeredSkill || !swapData.requestedSkill || !swapData.message) {
        setFormError('Please fill out all fields.');
        return;
    }
    
    proposeSkillSwap({
        toUserId: creator.id,
        offeredSkill: swapData.offeredSkill,
        requestedSkill: swapData.requestedSkill,
        message: swapData.message,
    });
    
    setSuccessMessage('Proposal sent successfully!');
    setSwapData({ offeredSkill: '', requestedSkill: '', message: '' });
    setShowSwapForm(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !token || !project.id) { setApplyStatus('Please login to apply.'); return; }
    try {
      await api.applyToProject(project.id, applyMessage, token);
      setApplyStatus('Application submitted!');
      setApplyMessage('');
    } catch (err: any) {
      setApplyStatus(err.message || 'Failed to apply');
    }
  };

  const handleApplicationAction = async (applicationId: number, status: 'accepted' | 'declined') => {
    if (!token) return;
    try {
      const updated = await api.updateApplicationStatus(applicationId, status, token);
      setApplications(prev => prev.map(a => a.id === applicationId ? updated : a));
    } catch {
      // ignore UI-only errors for now
    }
  };


  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-dark mb-2">{project.title}</h1>
      {creator && <p className="text-gray-500 mb-6">Created by {creator.name}</p>}

      <p className="text-gray-700 text-lg leading-relaxed mb-8">{project.description}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-dark mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map(skill => <SkillBadge key={skill} skill={skill} />)}
          </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-dark mb-3">Project Team</h3>
            <div className="flex flex-wrap gap-4">
            {members.map(member => (
                member && (
                    <div key={member.id} className="flex items-center space-x-2">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                        <span className="text-gray-700">{member.name}</span>
                    </div>
                )
            ))}
            </div>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
                onClick={handleJoin}
                disabled={isMember}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition ${isMember ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-700'}`}
            >
                {isMember ? 'You are a member' : 'Join Project'}
            </button>
            <button
                onClick={() => setShowSwapForm(!showSwapForm)}
                disabled={isCreator}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition bg-secondary text-white hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {showSwapForm ? 'Cancel Swap' : 'Propose Skill Swap'}
            </button>
        </div>

        {successMessage && !showSwapForm && <p className="text-green-600 mt-4">{successMessage}</p>}
        
        {showSwapForm && !isCreator && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border transition-all duration-300 ease-in-out">
                <h4 className="text-lg font-semibold text-dark mb-4">Propose Skill Swap to {creator?.name}</h4>
                <form onSubmit={handleProposeSwap} className="space-y-4">
                    <input type="text" name="offeredSkill" placeholder="Skill you can offer" value={swapData.offeredSkill} onChange={handleSwapInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="text" name="requestedSkill" placeholder="Skill you want to learn" value={swapData.requestedSkill} onChange={handleSwapInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    <textarea name="message" placeholder="Write a short message..." rows={3} value={swapData.message} onChange={handleSwapInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                    <div className="flex items-center space-x-2">
                        <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md font-semibold hover:bg-emerald-600 transition">
                            Send Proposal
                        </button>
                    </div>
                    {formError && <p className="text-sm text-red-500 mt-2">{formError}</p>}
                </form>
            </div>
        )}

        {!isCreator && !isMember && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
            <h4 className="text-lg font-semibold text-dark mb-4">Apply to Join</h4>
            <form onSubmit={handleApply} className="space-y-3">
              <textarea
                name="applyMessage"
                rows={2}
                placeholder="Write a short message (optional)"
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-blue-700">Submit Application</button>
              {applyStatus && <p className="text-sm text-gray-600 mt-2">{applyStatus}</p>}
            </form>
          </div>
        )}

        {isCreator && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-dark mb-3">Applications</h4>
            {applications.length === 0 ? (
              <p className="text-gray-500">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="p-4 bg-white border rounded-md flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {app.user_avatar && <img src={app.user_avatar} alt={app.user_name || ''} className="w-8 h-8 rounded-full" />}
                      <div>
                        <p className="font-medium text-gray-800">{app.user_name} <span className="text-xs text-gray-500">({app.user_email})</span></p>
                        <p className="text-sm text-gray-600">{app.message || 'No message'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : app.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{app.status}</span>
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => handleApplicationAction(app.id, 'accepted')} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Accept</button>
                          <button onClick={() => handleApplicationAction(app.id, 'declined')} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Decline</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;