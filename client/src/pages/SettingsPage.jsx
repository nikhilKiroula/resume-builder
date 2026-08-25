import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Moon, Sun, Camera, Save } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';
import { profileSchema, changePasswordSchema } from '@/validations/schemas';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';
import { getInitials } from '@/utils/helpers';

const SettingsPage = () => {
  const { user, updateUser } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', bio: user?.bio || '' },
  });

  // Password form
  const passwordForm = useForm({ resolver: zodResolver(changePasswordSchema) });

  const saveProfile = async (data) => {
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', data);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
    setSavingProfile(false);
  };

  const changePassword = async (data) => {
    setSavingPassword(true);
    try {
      await api.put('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setSavingPassword(false);
  };

  const tabs = [
    { key: 'profile', label: 'Account', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'preferences', label: 'Preferences', icon: isDark ? Moon : Sun },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === key
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="card p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <p className="text-xs text-slate-400 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" className={`input ${profileForm.formState.errors.name ? 'input-error' : ''}`}
                {...profileForm.register('name')} />
              {profileForm.formState.errors.name && (
                <p className="error-msg">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={user?.email} disabled className="input opacity-60 cursor-not-allowed" />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed currently</p>
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea rows={3} className="input resize-none" placeholder="Tell us a bit about yourself..."
                {...profileForm.register('bio')} />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={savingProfile} className="btn btn-primary btn-md">
                {savingProfile ? <Spinner size="sm" /> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">Change Password</h2>
          <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input type="password" className={`input ${passwordForm.formState.errors.currentPassword ? 'input-error' : ''}`}
                placeholder="Your current password"
                {...passwordForm.register('currentPassword')} />
              {passwordForm.formState.errors.currentPassword && (
                <p className="error-msg">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <label className="label">New Password</label>
              <input type="password" className={`input ${passwordForm.formState.errors.newPassword ? 'input-error' : ''}`}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                {...passwordForm.register('newPassword')} />
              {passwordForm.formState.errors.newPassword && (
                <p className="error-msg">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" className={`input ${passwordForm.formState.errors.confirmNewPassword ? 'input-error' : ''}`}
                placeholder="Confirm your new password"
                {...passwordForm.register('confirmNewPassword')} />
              {passwordForm.formState.errors.confirmNewPassword && (
                <p className="error-msg">{passwordForm.formState.errors.confirmNewPassword.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={savingPassword} className="btn btn-primary btn-md">
                {savingPassword ? <Spinner size="sm" /> : <><Lock className="w-4 h-4" /> Change Password</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preferences tab */}
      {activeTab === 'preferences' && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Preferences</h2>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-slate-500">Switch between light and dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-brand-600' : 'bg-slate-300'}`}
              aria-label="Toggle dark mode"
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDark ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            {isDark ? <Moon className="w-5 h-5 text-brand-600" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Currently using <strong>{isDark ? 'dark' : 'light'}</strong> mode
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
