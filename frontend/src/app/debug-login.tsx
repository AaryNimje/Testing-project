// app/debug-login.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function DebugLogin() {
  const router = useRouter();
  
  const loginAs = (role: string) => {
    // Create fake token
    const payload = {
      username: role,
      role: role,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000)
    };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    
    // Navigate to correct dashboard
    let path = '/dashboard';
    if (role === 'super_admin') path += '/superadmin';
    else path += `/${role}`;
    
    router.push(path);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50 border">
      <h3 className="font-bold mb-2">Debug Login</h3>
      <div className="space-y-2">
        <button onClick={() => loginAs('super_admin')} className="block w-full bg-purple-500 text-white p-1 rounded">SuperAdmin</button>
        <button onClick={() => loginAs('admin')} className="block w-full bg-blue-500 text-white p-1 rounded">Admin</button>
        <button onClick={() => loginAs('faculty')} className="block w-full bg-green-500 text-white p-1 rounded">Faculty</button>
        <button onClick={() => loginAs('staff')} className="block w-full bg-orange-500 text-white p-1 rounded">Staff</button>
        <button onClick={() => loginAs('student')} className="block w-full bg-gray-500 text-white p-1 rounded">Student</button>
      </div>
    </div>
  );
}