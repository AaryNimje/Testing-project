"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LampContainer } from "@/components/aceternity/lamp-effect";

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);

      // Fixed routing to match existing dashboard structure
      switch (data.user.role) {
        case 'super_admin':
          router.push('/dashboard/superadmin');
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
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: string, pass: string) => {
    setUsername(role);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
      <LampContainer>
        <div className="flex items-center justify-center w-full h-full py-12">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900">Academic AI Platform</h2>
            
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
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
                  placeholder="Enter password"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Quick Login Demo Accounts */}
            <div className="text-center text-sm border-t pt-4">
              <p className="font-medium mb-3 text-gray-700">Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickLogin('superadmin', 'admin123')}
                >
                  Super Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickLogin('admin', 'admin123')}
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickLogin('faculty', 'faculty123')}
                >
                  Faculty
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickLogin('student', 'student123')}
                >
                  Student
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-2"
                onClick={() => quickLogin('staff', 'staff123')}
              >
                Staff
              </Button>
            </div>
          </div>
        </div>
      </LampContainer>
    </div>
  );
}