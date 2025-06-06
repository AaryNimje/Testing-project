"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { LampContainer } from "@/components/aceternity/lamp-effect";

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

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
        console.error('Login error:', err);
      } else {
        setError('An unknown error occurred.');
        console.error('An unknown error occurred:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
      <LampContainer>
        {/* Adjusted centering classes for vertical and horizontal alignment */}
         <div className="flex items-center justify-center w-full h-full py-12"> {/* Added py-12 for some vertical padding */}
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900">Sign In</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="text-center text-sm text-gray-600">
              Dont have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </LampContainer>
    </div>
  );
}
