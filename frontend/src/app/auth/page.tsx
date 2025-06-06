"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);

      // Role-based redirection
      switch (data.user.role) {
        case 'super_admin':
          router.push('/dashboard/super-admin');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'faculty':
          router.push('/dashboard/faculty');
          break;
        case 'student':
          router.push('/dashboard/student');
          break;
        case 'staff':
          router.push('/dashboard/staff');
          break;
        default:
          router.push('/dashboard');
          break;
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      {/* Full screen container with proper flexbox centering */}
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Centered form container */}
        <div className="w-full max-w-md">
          {/* Form card with enhanced styling */}
          <div className="p-8 space-y-6 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 px-4 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Dont have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
              <Link 
                href="/" 
                className="inline-block mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}