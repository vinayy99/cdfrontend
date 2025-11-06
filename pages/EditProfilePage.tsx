import React, { useState, FormEvent, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';

const EditProfilePage: React.FC = () => {
  const { currentUser, token } = useAppContext();
  const [form, setForm] = useState({ name: '', bio: '', avatar: '', links: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name,
        bio: (currentUser as any).bio || '',
        avatar: currentUser.avatar || '',
        links: Array.isArray((currentUser as any).links) ? ((currentUser as any).links as string[]).join(', ') : ''
      });
    }
  }, [currentUser]);

  if (!currentUser || !token) return <p className="text-center text-gray-600">Please log in.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const linksArray = form.links.split(',').map(s => s.trim()).filter(Boolean);
      await api.updateMyProfile({ name: form.name, bio: form.bio, avatar: form.avatar, links: linksArray }, token);
      setSuccess('Profile updated');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-dark mb-6">Edit Profile</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-md text-sm mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short bio" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="Avatar URL" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        <input name="links" value={form.links} onChange={handleChange} placeholder="Social links (comma-separated)" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        <button type="submit" className="px-5 py-2 bg-primary text-white rounded-md font-semibold hover:bg-blue-700">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfilePage;


