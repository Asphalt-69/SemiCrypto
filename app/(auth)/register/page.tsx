'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import AuthService from '@/services/authService';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;
  const isPasswordStrong = Object.values(passwordRequirements).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordStrong) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Registration successful! Redirecting to OTP verification...');
      router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const PasswordCheck = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check size={14} className="text-gain" />
      ) : (
        <X size={14} className="text-loss" />
      )}
      <span className={met ? 'text-gain' : 'text-muted-foreground'}>{label}</span>
    </div>
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 max-h-[90vh] overflow-y-auto"
    >
      <motion.h2 variants={inputVariants} className="text-2xl font-bold mb-6">
        Create Account
      </motion.h2>

      {/* Name Input */}
      <motion.div variants={inputVariants} className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="John Doe"
          className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </motion.div>

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

        {/* Password Requirements */}
        {formData.password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 bg-muted/50 rounded-lg space-y-1"
          >
            <PasswordCheck met={passwordRequirements.length} label="At least 8 characters" />
            <PasswordCheck met={passwordRequirements.uppercase} label="One uppercase letter" />
            <PasswordCheck met={passwordRequirements.lowercase} label="One lowercase letter" />
            <PasswordCheck met={passwordRequirements.number} label="One number" />
          </motion.div>
        )}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={inputVariants} className="space-y-2">
        <label className="text-sm font-medium">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className={`w-full px-4 py-2 rounded-lg bg-input border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all pr-10 ${
              formData.confirmPassword
                ? passwordsMatch
                  ? 'border-gain focus:ring-gain'
                  : 'border-loss focus:ring-loss'
                : 'border-border focus:ring-primary'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Terms Checkbox */}
      <motion.div variants={inputVariants} className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border cursor-pointer mt-1"
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
          I agree to the Terms of Service and Privacy Policy
        </label>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        variants={inputVariants}
        type="submit"
        disabled={isLoading || !isPasswordStrong || !passwordsMatch || !formData.termsAccepted}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </motion.button>

      {/* Social Signup */}
      <motion.div variants={inputVariants} className="space-y-3 mt-6">
        <button
          type="button"
          className="w-full py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          Sign up with Google
        </button>
        <button
          type="button"
          className="w-full py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          Sign up with Apple
        </button>
      </motion.div>

      {/* Login Link */}
      <motion.p variants={inputVariants} className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Login
        </Link>
      </motion.p>
    </motion.form>
  );
}
