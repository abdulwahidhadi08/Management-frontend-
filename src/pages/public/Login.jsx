import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, ShieldAlert, KeyRound, Mail, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to role dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectUser(user.role);
    }
  }, [isAuthenticated, user]);

  // Check for expired session queries
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      setError('Your session has expired. Please log in again.');
    }
  }, [location]);

  const redirectUser = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'headmaster') {
      navigate('/headmaster/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(cleanEmail, cleanPassword);
      redirectUser(loggedUser.role);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-100 text-slate-800">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Banner Header Logo */}
        <div className="bg-gradient-to-br from-[#022c22] to-[#044e36] px-8 py-10 text-center text-white border-b border-emerald-900/60 flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#044e36] to-emerald-900 text-amber-400 rounded-2xl flex items-center justify-center shadow-lg mb-3 border-2 border-amber-500/40">
            <GraduationCap className="w-8 h-8 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight font-serif text-white">Vanguard Academy</h1>
          <p className="text-[11px] text-amber-400 mt-1 font-extrabold uppercase tracking-widest">
            Management & Student Portal
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 text-xs font-bold text-rose-800 flex gap-2.5 items-center">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Email input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@vanguardacademy.com"
                className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#044e36] focus:ring-2 focus:ring-[#044e36]/20 transition-all bg-white"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-800">Password</label>
              <button
                type="button"
                onClick={() => setError('Password resets are managed by the school Registrar office.')}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <KeyRound className="w-4 h-4 text-slate-500" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#044e36] focus:ring-2 focus:ring-[#044e36]/20 transition-all bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#044e36] focus:ring-[#044e36] cursor-pointer"
            />
            <label htmlFor="remember_me" className="ml-2 block text-xs font-bold text-slate-700 cursor-pointer select-none">
              Remember my session
            </label>
          </div>

          {/* Login submit button */}
          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-[#044e36] hover:bg-[#022c22] text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in to portal...</span>
              </>
            ) : (
              'Log In to Portal'
            )}
          </button>

          {/* Seed credentials helpful tip */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 mt-6 text-xs leading-relaxed text-slate-700 shadow-sm">
            <p className="font-extrabold text-[#044e36] mb-1.5 uppercase text-[10px] tracking-wider">Demo Access Accounts:</p>
            <ul className="space-y-1 text-[11px] font-semibold">
              <li>• Admin: <span className="font-mono text-slate-900 font-bold">admin@vanguardacademy.com</span> / admin123</li>
              <li>• Headmaster: <span className="font-mono text-slate-900 font-bold">headmaster@vanguardacademy.com</span> / headmaster123</li>
              <li>• Student: <span className="font-mono text-slate-900 font-bold">student@vanguardacademy.com</span> / student123</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};
