import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { registerSchema } from '@/validations/schemas';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    const result = await registerUser(data.name, data.email, data.password);
    if (result.success) {
      toast.success('Account created! Welcome to Resumely 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold">Resumely</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Start your resume in 60 seconds
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Free forever. No credit card required. Build as many resumes as you need.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { val: '6', label: 'Templates' },
              { val: 'Free', label: 'Always' },
              { val: 'PDF', label: 'Export' },
              { val: 'AI', label: 'Assistance' },
            ].map(({ val, label }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold">{val}</div>
                <div className="text-white/70 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Resumely</span>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="name" type="text" autoComplete="name" placeholder="John Doe"
                  className={`input pl-9 ${errors.name ? 'input-error' : ''}`}
                  {...register('name')} />
              </div>
              {errors.name && <p className="error-msg">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
                  className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
                  {...register('email')} />
              </div>
              {errors.email && <p className="error-msg">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="label">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="••••••••"
                  className={`input pl-9 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword')} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle confirm password">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword.message}</p>}
            </div>

            <p className="text-xs text-slate-500">
              By creating an account you agree to our{' '}
              <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={isLoading} className="btn btn-primary btn-md w-full">
              {isLoading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
