
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 bg-primary/20 rounded-full mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-darker border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter admin password"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
