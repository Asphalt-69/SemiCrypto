'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthService from '@/services/authService';
import { useAuthStore } from '@/features/auth/store/auth.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      setUser(response.user);
      setTokens(response.token, response.refreshToken);
      
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <motion.h2 variants={inputVariants} className="text-2xl font-bold mb-6">
        Welcome Back
      </motion.h2>

      {/* Email Input */}
      <motion.div variants={inputVariants} className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </motion.div>

      {/* Password Input */}
      <motion.div variants={inputVariants} className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Remember Me */}
      <motion.div variants={inputVariants} className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border cursor-pointer"
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm cursor-pointer">
          Remember me
        </label>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        variants={inputVariants}
        type="submit"
        disabled={isLoading}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {isLoading ? 'Logging in...' : 'Login'}
      </motion.button>

      {/* Social Login */}
      <motion.div variants={inputVariants} className="space-y-3 mt-6">
        <button
          type="button"
          className="w-full py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          Continue with Google
        </button>
        <button
          type="button"
          className="w-full py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          Continue with Apple
        </button>
      </motion.div>

      {/* Signup Link */}
      <motion.p variants={inputVariants} className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary hover:underline font-semibold">
          Sign up
        </Link>
      </motion.p>
    </motion.form>
  );
}
