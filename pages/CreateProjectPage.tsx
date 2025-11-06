import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CreateProjectPage: React.FC = () => {
  const { createProject, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', skills: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return <p className="text-center text-gray-600">Please log in to create a project.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const requiredSkills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
    if (!form.title || !form.description || requiredSkills.length === 0) {
      setError('Please fill in all fields with at least one required skill.');
      return;
    }
    try {
      setSubmitting(true);
      const ok = await createProject(form.title, form.description, requiredSkills);
      if (ok) {
        setSuccess('Project created successfully!');
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        setError('Failed to create project.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-dark mb-6">Create a New Project</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-md text-sm mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Project title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <textarea
          name="description"
          placeholder="Describe your project and what you’re building"
          rows={5}
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Required skills (comma-separated, e.g., React, Node.js)"
          value={form.skills}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <button type="submit" disabled={submitting} className="px-5 py-2 bg-primary text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectPage;


