import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, LayoutDashboard, Settings, LogOut, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useResumeStore from '@/store/resumeStore';
import { getInitials } from '@/utils/helpers';
import toast from 'react-hot-toast';

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const { createResume, isCreating } = useResumeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleCreateResume = async () => {
    const result = await createResume({ title: 'My Resume' });
    if (result.success) {
      navigate(`/editor/${result.resume._id}`);
    } else {
      toast.error(result.message || 'Failed to create resume');
    }
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-30 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 h-16 px-4 border-b border-slate-200 dark:border-slate-800`}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-slate-900 dark:text-white">Resumely</span>
          )}
        </div>

        {/* Create button */}
        <div className="p-3">
          <button
            onClick={handleCreateResume}
            disabled={isCreating}
            className={`btn btn-primary w-full ${collapsed ? 'px-2 justify-center' : 'btn-md'}`}
            title={collapsed ? 'Create Resume' : undefined}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>New Resume</span>}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && 'Logout'}
          </button>

          {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-lg text-xs ${
                  isActive ? 'text-brand-600' : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleCreateResume}
            disabled={isCreating}
            className="flex flex-col items-center gap-1 p-2 text-xs text-brand-600"
          >
            <Plus className="w-5 h-5" />
            New
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 p-2 text-xs text-slate-500 dark:text-slate-400"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default DashboardSidebar;
