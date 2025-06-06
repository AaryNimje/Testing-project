import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academic AI Platform",
  description: "Revolutionizing education through intelligent automation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* @ts-ignore */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}