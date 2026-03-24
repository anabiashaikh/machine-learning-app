import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Cpu, Lock, User, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import API_URL from '../config';

const Login = ({ onLogin }) => {
  const [view, setView] = useState('login'); // 'login', 'register', 'success'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onLogin();
      } else {
        setError(data.detail || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Failed to connect to authentication server. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setView('success');
        setTimeout(() => {
          setView('login');
          setPassword('');
          setConfirmPassword('');
        }, 3000);
      } else {
        setError(data.detail || 'Failed to register account.');
      }
    } catch (err) {
      setError('Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-navy">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-glow/20 rounded-full blur-[100px] pointer-events-none"></div>

      <Card className="w-full max-w-md relative z-10 p-8 border-t border-l border-white/20">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-navy border border-electric-blue/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,210,255,0.2)]">
            <Cpu className="text-electric-blue" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Machine AI System</h1>
          <p className="text-slate-400 text-sm h-5">
            {view === 'login' && "Sign in to monitor predictive health"}
            {view === 'register' && "Register a new secure account"}
            {view === 'success' && "Registration successful!"}
          </p>
        </div>

        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Account</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-glass-border rounded-xl leading-5 bg-navy/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-glass-border focus:ring-electric-blue'} rounded-xl leading-5 bg-navy/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>

            <Button type="submit" fullWidth className="mt-8" disabled={loading}>
              {loading ? 'Authenticating...' : 'Secure Login'}
            </Button>
            
            <button type="button" onClick={() => { setView('register'); setError(''); setPassword(''); }} className="flex items-center justify-center w-full mt-4 text-sm text-slate-400 hover:text-white transition-colors">
              Don't have an account? Register here
            </button>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-glass-border rounded-xl leading-5 bg-navy/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-glass-border rounded-xl leading-5 bg-navy/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="New Password (min 8 chars)"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${password !== confirmPassword && confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-glass-border focus:ring-electric-blue'} rounded-xl leading-5 bg-navy/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="Confirm New Password"
                  required
                />
              </div>
              {password !== confirmPassword && confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>

            <Button type="submit" fullWidth className="mt-8" disabled={!password || password !== confirmPassword || loading}>
              {loading ? 'Registering...' : 'Register Account'}
            </Button>

            <button type="button" onClick={() => { setView('login'); setError(''); }} className="flex items-center justify-center w-full mt-4 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Back to Login
            </button>
          </form>
        )}

        {view === 'success' && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
            <CheckCircle2 size={64} className="text-green-400" />
            <h2 className="text-xl font-semibold text-white">Registration Successful!</h2>
            <p className="text-slate-400 text-sm mb-6">Your secure account has been created. You will be redirected to securely login momentarily.</p>
            <Button onClick={() => { setView('login'); setPassword(''); setConfirmPassword(''); }} fullWidth>
              Return to Login Now
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
