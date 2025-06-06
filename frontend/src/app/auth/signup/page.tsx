"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { LampContainer } from "@/components/aceternity/lamp-effect";

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }

      const data = await response.json();
      setSuccess(data.message || 'Sign up successful! Redirecting to sign in...');
      router.push('/auth'); // Redirect to the sign-in page at /auth

    } catch (err: unknown) {
       if (err instanceof Error) {
        setError(err.message);
        console.error('Sign up error:', err);
      } else {
        setError('An unknown error occurred during sign up.');
        console.error('An unknown error occurred during sign up:', err);
      }
    }
  };

  return (
    // Main container with deep blue gradient and relative positioning for absolute children
    <div className="min-h-screen max-h-screen overflow-hidden relative bg-gradient-to-b from-blue-900 to-black">
      {/* LampContainer for the upper lamp effect area */}
      <LampContainer>
         {/* Optional: Add a title or subtitle inside the lamp area */}
         <div className="text-center space-y-4 mt-20"> {/* Added margin top to push content down slightly */}
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              <span
                className="drop-shadow-2xl text-white filter contrast-150 brightness-110"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
              </span>
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
              Create your account
            </p>
          </div>
      </LampContainer>

      {/* Sign-up form block - positioned absolutely below the lamp area */}
      {/* Adjusted bottom value and added flex justify-center for horizontal centering */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center z-20"> {/* Positioned absolutely, centered horizontally */}
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
             <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth" className="font-medium text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
