'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { signup } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { ApiError } from '@/types';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const strengths: PasswordStrength[] = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Weak', color: 'bg-error' },
      { score: 2, label: 'Fair', color: 'bg-warning' },
      { score: 3, label: 'Good', color: 'bg-warning' },
      { score: 4, label: 'Strong', color: 'bg-success' },
      { score: 5, label: 'Very Strong', color: 'bg-success' },
    ];

    return strengths[Math.min(score, 5)];
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasLowerCase = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasMinLength = formData.password.length >= 8;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{7,20}$/; // Simple regex for phone numbers

    if (!formData.email) {
      newErrors.email = 'Email or phone number is required';
    } else if (!emailRegex.test(formData.email) && !phoneRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email or phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak. Mix uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreed) {
      newErrors.terms = 'You must agree to the terms';
    }

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const payload: { password: string; email?: string; phone?: string } = {
        password: formData.password,
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s-]{7,20}$/;

      if (emailRegex.test(formData.email)) payload.email = formData.email;
      else if (phoneRegex.test(formData.email)) payload.phone = formData.email;

      const res = await signup(payload);
      console.log(res.data);

      setUser(res.data.authUser);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      router.push('/onboarding');
    } catch (error) {
      const err = error as ApiError;
      const msg = err.response?.data?.error || 'Signup failed';

      setErrors({ email: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email or Phone Number
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors  ${
              errors.email
                ? 'border-error focus:border-error  '
                : 'border-border hover:border-primary/30 focus:border-ring focus:ring-ring/50 '
            }`}
          />
        </div>
        {errors.email && <p className="text-sm text-error font-medium">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-colors  ${
              errors.password
                ? 'border-error focus:border-error'
                : 'border-border hover:border-primary/30 focus:border-ring focus:ring-ring/50'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {formData.password && (
          <div className="space-y-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= passwordStrength.score ? passwordStrength.color : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                {hasMinLength ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={hasMinLength ? 'text-success' : 'text-muted-foreground'}>
                  8+ characters
                </span>
              </div>
              <div className="flex items-center gap-1">
                {hasNumber ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={hasNumber ? 'text-success' : 'text-muted-foreground'}>
                  Number (0-9)
                </span>
              </div>
              <div className="flex items-center gap-1">
                {hasLowerCase ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={hasLowerCase ? 'text-success' : 'text-muted-foreground'}>
                  Lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-1">
                {hasUpperCase ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={hasUpperCase ? 'text-success' : 'text-muted-foreground'}>
                  Uppercase letter
                </span>
              </div>
            </div>
          </div>
        )}

        {errors.password && <p className="text-sm text-error font-medium">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-colors  ${
              errors.confirmPassword
                ? 'border-error focus:border-error '
                : formData.confirmPassword && formData.password === formData.confirmPassword
                  ? 'border-success focus:border-success focus:ring-success/20'
                  : 'border-border hover:border-primary/30 focus:border-ring focus:ring-ring/50'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formData.confirmPassword &&
          (formData.password === formData.confirmPassword ? (
            <p className="text-sm text-success font-medium flex items-center gap-1">
              <Check className="w-4 h-4" /> Passwords match
            </p>
          ) : (
            <p className="text-sm text-error font-medium">
              {errors.confirmPassword || 'Passwords do not match'}
            </p>
          ))}
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked && errors.terms) {
                setErrors((prev) => ({ ...prev, terms: '' }));
              }
            }}
            className="w-5 h-5 border border-border rounded mt-0.5"
          />
          <span className="text-sm">
            I agree to the{' '}
            <Link href="#" className="underline font-medium hover:no-underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline font-medium hover:no-underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.terms && <p className="text-sm text-error font-medium">{errors.terms}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full border border-border rounded-lg py-3 font-medium hover:bg-surface transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-foreground hover:text-primary transition-colors"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
