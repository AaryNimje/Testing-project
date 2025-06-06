"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSuccess('Thank you for your message! We\'ll get back to you soon.');
      setLoading(false);
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-xl">
            Academic AI Platform
          </Link>
          <div className="flex space-x-4">
            <Link href="/auth/signup">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Sign Up
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-2xl">
          {/* Contact form card */}
          <div className="p-8 space-y-6 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Get In Touch</h1>
              <p className="text-gray-600 text-lg">
                Have questions about our platform? Wed love to hear from you.
              </p>
            </div>

            {/* Contact form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
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
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-700 font-medium">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-12 px-4 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="What's this about?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-medium">
                  Message
                </Label>
                <textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Success message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600">{success}</p>
                </div>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                You can also reach us at{' '}
                <a href="mailto:contact@academicai.com" className="text-blue-600 hover:text-blue-800">
                  contact@academicai.com
                </a>
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
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}