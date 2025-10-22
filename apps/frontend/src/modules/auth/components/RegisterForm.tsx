/**
 * Register Form Component
 * Form with validation using react-hook-form and Zod
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { RegisterFormData } from '../types/auth.types';

// Validation schema
const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const RegisterForm = ({ onSuccess, onError }: RegisterFormProps) => {
  const register = useAuthStore((state) => state.register);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
      onSuccess?.();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass p-8 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Register</h2>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2 text-foreground"
            >
              Name (optional)
            </label>
            <input
              {...registerField('name')}
              type="text"
              id="name"
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="John Doe"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-foreground"
            >
              Email
            </label>
            <input
              {...registerField('email')}
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-foreground"
            >
              Password
            </label>
            <input
              {...registerField('password')}
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2 text-foreground"
            >
              Confirm Password
            </label>
            <input
              {...registerField('confirmPassword')}
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
