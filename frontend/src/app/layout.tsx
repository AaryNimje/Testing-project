// src/app/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

// Font configuration
const inter = Inter({ subsets: ['latin'] });

// Metadata
export const metadata: Metadata = {
  title: 'Academic AI Platform',
  description: 'A comprehensive AI-powered educational workflow automation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}