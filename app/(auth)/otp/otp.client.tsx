'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Clock } from 'lucide-react';
import AuthService from '@/services/authService';
import { useAuthStore } from '@/features/auth/store/auth.store';
import toast from 'react-hot-toast';

export default function OtpPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { setUser, setTokens } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer
  useEffect(() => {
    if (canResend) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.verifyOtp({
        email,
        otp: otpCode,
      });

      setUser(response.user);
      setTokens(response.token, response.refreshToken);

      toast.success('Email verified successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(60);

    try {
      await AuthService.resendOtp(email);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
      setCanResend(true);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code sent to {email}
        </p>
      </motion.div>

      {/* OTP Inputs */}
      <motion.div variants={itemVariants} className="flex gap-2 justify-center my-8">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            autoFocus={index === 0}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="w-12 h-12 text-center text-lg font-semibold rounded-lg bg-input border-2 border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        ))}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        variants={itemVariants}
        type="submit"
        disabled={isLoading || otp.join('').length !== 6}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </motion.button>

      {/* Resend Section */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-primary hover:underline text-sm font-semibold"
          >
            Resend Code
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} />
            Resend code in {resendTimer}s
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Didn't receive the code? Check your spam folder or{' '}
          <button
            type="button"
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            go back
          </button>
        </p>
      </motion.div>
    </motion.form>
  );
}
