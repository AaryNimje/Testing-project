// src/app/auth/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LampContainer } from "@/components/aceternity/lamp-effect";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const router = useRouter();
  
  const { login, isAuthenticated, user, loading, error, clearError } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = `/dashboard/${user.role}`;
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, router]);
  
  // Sync context error with local error
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(''); // Clear previous errors
    clearError(); // Clear context errors
    
    // Validate inputs
    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }
    
    try {
      await login({ email, password });
    } catch (err) {
      // Error is handled by the context
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
      <LampContainer>
        <div className="flex items-center justify-center w-full h-full py-12">
          <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your Academic AI Platform account</p>
            </div>
            
            {localError && (
              <Alert variant="destructive" className="mb-4 bg-red-900/40 border-red-800 text-white">
                <AlertDescription>{localError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="••••••••"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </LampContainer>
    </div>
  );
}