import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Eye, EyeOff, Square } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-radius-[24px] shadow-card border border-border w-full max-w-[440px] p-12 rounded-[24px]"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/20">
            <Square className="fill-white" size={24} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-1">Tricity Verified CRM</h1>
          <p className="text-text-secondary text-sm">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50/50 border border-red-100 text-red-500 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-medium">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-text-secondary uppercase tracking-wider block ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12 h-11"
                placeholder="email@crm.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[13px] font-medium text-text-secondary uppercase tracking-wider block">Password</label>
              <button type="button" className="text-primary text-[13px] font-semibold hover:underline">Forgot password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 pr-12 h-11"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 h-11 text-[15px] mt-2 flex items-center justify-center">
            Secure Sign In
          </button>
        </form>

        <div className="mt-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-gray-400"><span className="bg-white px-4">OR login with OTP</span></div>
          </div>

          <div className="space-y-4 opacity-40 grayscale pointer-events-none">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="flex gap-2">
                <input disabled className="input-field h-10 flex-1" placeholder="+91..." />
                <button disabled className="px-4 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Send OTP</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Enter OTP</label>
              <input disabled className="input-field h-10" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢" />
            </div>
            <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest">Login with OTP</button>
            <p className="text-[10px] text-center text-primary font-bold animate-pulse">OTP login coming soon in v1.1</p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="text-text-secondary text-[13px]">
            Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline ml-1">Contact admin</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

