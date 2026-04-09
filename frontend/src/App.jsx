import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import SuperAdminLayout from './components/layout/SuperAdminLayout';
import AdminLayout from './components/layout/AdminLayout';
import EmployeeLayout from './components/layout/EmployeeLayout';

// Shared
import Login from './pages/Login';
import SuspendedScreen from './pages/shared/SuspendedScreen';

// Super Admin Pages
import SuperDashboard from './pages/superadmin/SuperDashboard';
import Companies from './pages/superadmin/Companies';
import CompanyDetail from './pages/superadmin/CompanyDetail';
import SuperSettings from './pages/superadmin/SuperSettings';
import ActivityFeed from './pages/superadmin/ActivityFeed';
import CampaignsOverview from './pages/superadmin/CampaignsOverview';
import GlobalCommunications from './pages/superadmin/GlobalCommunications';
import SuperLeads from './pages/superadmin/SuperLeads';
import SuperEmployees from './pages/superadmin/SuperEmployees';
import SuperCallLogs from './pages/superadmin/SuperCallLogs';
import SuperAnalytics from './pages/superadmin/SuperAnalytics';
import { ShieldAlert } from 'lucide-react';

// Admin/Employee Shared Pages
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LeadDetail from './pages/LeadDetail';
import EmployeesPage from './pages/EmployeesPage';
import LeadsPage from './pages/LeadsPage';
import CallLogsPage from './pages/CallLogsPage';
import FollowUpsPage from './pages/FollowUpsPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import EmployeeLeads from './pages/EmployeeLeads';
import EmployeeFollowUps from './pages/EmployeeFollowUps';
import PerformancePage from './pages/PerformancePage';
import HomePage from './pages/HomePage';

// New Pages
import AdminCampaigns from './pages/admin/Campaigns';
import OutboundLeads from './pages/admin/OutboundLeads';
import AdminCommunications from './pages/admin/Communications';
import Blacklist from './pages/admin/Blacklist';
import RetryQueue from './pages/admin/RetryQueue';
import OutboundWorkspace from './pages/employee/OutboundWorkspace';

// New Master Update Pages
import LotteryManagement from './pages/admin/LotteryManagement';
import DeveloperAPI from './pages/admin/DeveloperAPI';
import AuditLog from './pages/admin/AuditLog';
import CampaignDetail from './pages/admin/CampaignDetail';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  // 1. Loading State (Full screen to prevent FOUC/flashing)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex flex-col items-center justify-center font-heading">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
        <div className="text-indigo-900 font-black tracking-[0.2em] text-xs uppercase animate-pulse">
          Synchronizing Secure Tunnel...
        </div>
      </div>
    );
  }

  // 2. Auth Check
  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Multi-tenant Subscription Check
  if (user.role !== 'superadmin' && (user.subscription_status === 'suspended' || user.subscription_status === 'cancelled')) {
    return <SuspendedScreen />;
  }
  
  // 4. Role Check
  if (roles && !roles.includes(user.role)) {
    // Redirect to their own dashboard if they try to access a route they don't have access to
    const dashboardMapping = {
      superadmin: '/super/dashboard',
      admin: '/admin',
      employee: '/dashboard'
    };
    return <Navigate to={dashboardMapping[user.role] || '/'} replace />;
  }
  
  // 5. Layout Selection based on role
  const layouts = {
    superadmin: SuperAdminLayout,
    admin: AdminLayout,
    employee: EmployeeLayout
  };

  const Layout = layouts[user.role] || EmployeeLayout;
  return <Layout>{children}</Layout>;
};

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('⚠️ [ErrorBoundary] Logic Failure Captured:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border border-rose-100">
             <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                <ShieldAlert size={40} />
             </div>
             <h1 className="text-3xl font-heading font-black text-indigo-900 mb-4 tracking-tight">Component Crash</h1>
             <p className="text-[#6B7280] font-medium leading-relaxed mb-10">
                The requested module encountered a critical logic error. Our engineers have been notified.
             </p>
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-8 text-left">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Error Trace</p>
                <p className="text-xs font-mono text-rose-600 truncate">{this.state.error?.message || 'Unknown Runtime Exception'}</p>
             </div>
             <button 
               onClick={() => window.location.href = '/'}
               className="w-full bg-primary text-white h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
             >
               Return to Safe Zone
             </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
            
            {/* SUPER ADMIN ROUTES */}
            <Route path="/super/*" element={<ProtectedRoute roles={['superadmin']}>
              <Routes>
                <Route path="dashboard" element={<SuperDashboard />} />
                <Route path="companies" element={<Companies />} />
                <Route path="companies/:id" element={<CompanyDetail />} />
                <Route path="leads" element={<SuperLeads />} />
                <Route path="employees" element={<SuperEmployees />} />
                <Route path="call-logs" element={<SuperCallLogs />} />
                <Route path="analytics" element={<SuperAnalytics />} />
                <Route path="activity" element={<ActivityFeed />} />
                <Route path="campaigns" element={<CampaignsOverview />} />
                <Route path="communications" element={<GlobalCommunications />} />
                <Route path="blacklist" element={<div className="p-20 text-center font-bold text-gray-400">Blacklist Monitor Stub</div>} />
                <Route path="audit" element={<AuditLog />} />
                <Route path="api-keys" element={<DeveloperAPI />} />
                <Route path="lottery" element={<LotteryManagement />} />
                <Route path="settings" element={<SuperSettings />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>} />

            {/* COMPANY ADMIN ROUTES ... */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/leads" element={<ProtectedRoute roles={['admin']}><LeadsPage /></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute roles={['admin']}><EmployeesPage /></ProtectedRoute>} />
            <Route path="/admin/call-logs" element={<ProtectedRoute roles={['admin']}><CallLogsPage /></ProtectedRoute>} />
            <Route path="/admin/follow-ups" element={<ProtectedRoute roles={['admin']}><FollowUpsPage /></ProtectedRoute>} />
            <Route path="/admin/campaigns" element={<ProtectedRoute roles={['admin']}><AdminCampaigns /></ProtectedRoute>} />
            <Route path="/admin/outbound-leads" element={<ProtectedRoute roles={['admin']}><OutboundLeads /></ProtectedRoute>} />
            <Route path="/admin/communications" element={<ProtectedRoute roles={['admin']}><AdminCommunications /></ProtectedRoute>} />
            <Route path="/admin/blacklist" element={<ProtectedRoute roles={['admin']}><Blacklist /></ProtectedRoute>} />
            <Route path="/admin/retry-queue" element={<ProtectedRoute roles={['admin']}><RetryQueue /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>} />
            
            {/* New Admin Routes */}
            <Route path="/admin/lottery" element={<ProtectedRoute roles={['admin']}><LotteryManagement /></ProtectedRoute>} />
            <Route path="/admin/lottery/:id" element={<ProtectedRoute roles={['admin']}><CampaignDetail /></ProtectedRoute>} />
            <Route path="/admin/developer" element={<ProtectedRoute roles={['admin']}><DeveloperAPI /></ProtectedRoute>} />
            <Route path="/admin/audit" element={<ProtectedRoute roles={['admin']}><AuditLog /></ProtectedRoute>} />

            {/* EMPLOYEE ROUTES */}
            <Route path="/dashboard" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/leads" element={<ProtectedRoute roles={['employee']}><EmployeeLeads /></ProtectedRoute>} />
            <Route path="/dashboard/leads/:id" element={<ProtectedRoute roles={['employee']}><LeadDetail /></ProtectedRoute>} />
            <Route path="/dashboard/follow-ups" element={<ProtectedRoute roles={['employee']}><EmployeeFollowUps /></ProtectedRoute>} />
            <Route path="/dashboard/outbound" element={<ProtectedRoute roles={['employee']}><OutboundWorkspace /></ProtectedRoute>} />
            <Route path="/dashboard/performance" element={<ProtectedRoute roles={['employee']}><PerformancePage /></ProtectedRoute>} />
            <Route path="/dashboard/calls" element={<ProtectedRoute roles={['employee']}><CallLogsPage /></ProtectedRoute>} />
            <Route path="/dashboard/communications" element={<ProtectedRoute roles={['employee']}><div className="p-20 text-center font-bold text-gray-400">My Comms Stub</div></ProtectedRoute>} />
            {/* FALLBACK */}


            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}

const AuthRedirect = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
      <div className="font-heading font-black text-indigo-900 tracking-widest text-xs uppercase animate-pulse">
        Establishing Secure Protocol...
      </div>
    </div>
  );

  if (isAuthenticated && user) {
    const dashboardMapping = {
      superadmin: '/super/dashboard',
      admin: '/admin',
      employee: '/dashboard'
    };
    return <Navigate to={dashboardMapping[user.role]} replace />;
  }

  return children;
};

export default App;
