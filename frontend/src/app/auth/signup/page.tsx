"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!email || !password || !firstName || !lastName) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }

      const data = await response.json();
      console.log('Signed up user:', data.user); // Example use

      setSuccess('Account created successfully! Redirecting to sign in...');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/auth');
      }, 2000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during sign up.');
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
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600">Join our academic platform today</p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSignUp}>
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email field */}
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
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Password field */}
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
                  placeholder="At least 6 characters"
                />
              </div>

              {/* Confirm password field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 px-4 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Repeat your password"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/auth" 
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Sign in here
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
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}