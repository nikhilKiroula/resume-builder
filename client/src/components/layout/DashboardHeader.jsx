import { Bell, Moon, Sun, Search } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';
import { getInitials } from '@/utils/helpers';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
      {/* Page context (empty — page titles handled by each page) */}
      <div />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="btn-ghost btn-sm p-2 rounded-lg"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <Link to="/settings">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-brand-700 transition-colors">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name || 'U')
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
