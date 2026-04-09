import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi } from '../api';
import { ShieldAlert, Clock, LogOut } from 'lucide-react';

const AuthContext = createContext();

// Constants for idle timeout
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_THRESHOLD = 2 * 60 * 1000; // 2 minutes before timeout

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  const timerRef = useRef(null);
  const warningTimerRef = useRef(null);

  const resetTimers = () => {
    if (!user) return; // Only track for logged in users

    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    setShowIdleWarning(false);

    // Set warning timer (Show modal 2 minutes before actual logout)
    warningTimerRef.current = setTimeout(() => {
      setShowIdleWarning(true);
    }, IDLE_TIMEOUT - WARNING_THRESHOLD);

    // Set final logout timer
    timerRef.current = setTimeout(() => {
      logout();
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    if (user) {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
      events.forEach(event => window.addEventListener(event, resetTimers));
      resetTimers(); // Initial start

      return () => {
        events.forEach(event => window.removeEventListener(event, resetTimers));
        if (timerRef.current) clearTimeout(timerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      };
    }
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (import.meta.env.DEV) console.log('🔐 [Auth] Verifying session with server...');
        const response = await authApi.getMe();
        // The server returns the user directly in response.data
        if (response.data && (response.data.id || response.data.user)) {
          setUser(response.data.user || response.data);
        }
      } catch (err) {
        if (import.meta.env.DEV) console.log('🔓 [Auth] No active session found or server offline.');
        setUser(null);
        localStorage.removeItem('leadflow_user');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const { user: userData } = response.data;
      setUser(userData);
      localStorage.setItem('leadflow_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('❌ [Auth] Single Sign-On Failed:', err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('⚠️ [Auth] Backend logout failed, clearing local state anyway');
    }
    setUser(null);
    localStorage.removeItem('leadflow_user');
    setShowIdleWarning(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}

      {/* Idle Warning Modal */}
      {showIdleWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-indigo-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden border border-amber-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-amber-50 flex items-center gap-4 text-amber-600">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-black">Security Alert</h2>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Inactive Session Detected</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Clock className="text-gray-400 mt-1 shrink-0" size={18} />
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Your session will expire in <span className="text-amber-600 font-black">2 minutes</span> due to inactivity. Would you like to stay logged in?
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={resetTimers}
                  className="w-full bg-primary text-white h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                >
                  Extend Session
                </button>
                <button
                  onClick={logout}
                  className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Check for module duplication or hierarchy leaks.');
  }
  return context;
};
