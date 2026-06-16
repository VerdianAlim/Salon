import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validators';
import { loginAdmin } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { z } from 'zod';

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const admin = await loginAdmin(data.username, data.password); // data.username = email untuk supabase
      login(admin);
      toast.success(`Selamat datang!`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError('password', { message: err.message || 'Email atau password salah' });
      toast.error('Login gagal. Periksa kembali kredensial Anda.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-900/40">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Salon Widya</h1>
          <p className="text-slate-400 text-sm mt-1">Panel Administrasi</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-1">Masuk ke Dashboard</h2>
          <p className="text-slate-400 text-sm mb-6">Gunakan email & password admin Anda</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Admin</label>
              <input
                id="admin-username"
                type="email"
                {...register('username')}
                className="w-full px-4 py-2.5 rounded-xl border text-white text-sm bg-slate-700 border-slate-600 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="admin@contoh.com"
              />
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border text-white text-sm bg-slate-700 border-slate-600 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              id="admin-login-submit"
              type="submit"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
            >
              Masuk ke Dashboard
            </Button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3 bg-slate-700/50 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              Login menggunakan email dan password akun Auth Supabase Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
