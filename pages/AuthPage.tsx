import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// Password validation function - only essential requirements
const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  
  return {
    isValid: minLength && hasUppercase && hasLowercase,
    minLength,
    hasUppercase,
    hasLowercase
  };
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', skills: '', bio: '' });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { login, signup, error: contextError, clearError } = useAppContext();
  const navigate = useNavigate();
  
  // Combine context error and local error for display
  const error = contextError || localError;
  
  // Password validation
  const passwordValidation = !isLogin ? validatePassword(formData.password) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Show password requirements when user starts typing password in signup mode
    if (!isLogin && e.target.name === 'password' && e.target.value.length > 0) {
      setShowPasswordRequirements(true);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); 
    setLocalError('');
    clearError(); // Clear any previous errors from context
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setLocalError('Invalid email or password.');
      } else {
        navigate('/dashboard');
      }
    } else {
      // Validate password before submitting
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setLocalError('Password does not meet requirements. Please check the requirements below.');
        setShowPasswordRequirements(true);
        return;
      }
      
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const success = await signup({ name: formData.name, email: formData.email, password: formData.password, skills: skillsArray, bio: formData.bio });
      if (!success) {
        // Error message is already set in context from the signup function
        if (!contextError) {
          setLocalError('Signup failed. Please try again.');
        }
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-dark mb-2">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
        <p className="text-center text-gray-500 mb-6">{isLogin ? 'Log in to continue your journey.' : 'Join the community of creators.'}</p>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (<input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />)}
          <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
          <div>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required 
              value={formData.password} 
              onChange={handleChange}
              onFocus={() => !isLogin && setShowPasswordRequirements(true)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                !isLogin && passwordValidation && !passwordValidation.isValid && formData.password.length > 0
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-primary'
              }`}
            />
            {!isLogin && showPasswordRequirements && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                <p className="font-semibold text-gray-700 mb-2">Password Requirements:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center ${passwordValidation?.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`mr-2 ${passwordValidation?.minLength ? 'text-green-500' : 'text-gray-400'}`}>
                      {passwordValidation?.minLength ? '✓' : '○'}
                    </span>
                    Minimum 8 characters
                  </li>
                  <li className={`flex items-center ${passwordValidation?.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`mr-2 ${passwordValidation?.hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                      {passwordValidation?.hasUppercase ? '✓' : '○'}
                    </span>
                    At least one uppercase letter (A-Z)
                  </li>
                  <li className={`flex items-center ${passwordValidation?.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`mr-2 ${passwordValidation?.hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                      {passwordValidation?.hasLowercase ? '✓' : '○'}
                    </span>
                    At least one lowercase letter (a-z)
                  </li>
                </ul>
              </div>
            )}
          </div>
          {!isLogin && (<><input type="text" name="skills" placeholder="Your Skills (comma-separated)" required value={formData.skills} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" /><textarea name="bio" placeholder="Short Bio" rows={3} required value={formData.bio} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" /></>)}
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">{isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={() => { 
            setIsLogin(!isLogin); 
            setLocalError(''); 
            clearError(); // Clear context errors when switching modes
            setShowPasswordRequirements(false);
            setFormData({ name: '', email: '', password: '', skills: '', bio: '' }); 
          }} className="font-semibold text-primary hover:underline ml-1">{isLogin ? 'Sign Up' : 'Login'}</button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;



