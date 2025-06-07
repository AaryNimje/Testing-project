import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-b from-blue-900 to-black">
      {/* Navigation */}
      <nav className="sticky top-0 right-0 z-50 p-6 flex justify-end">
        <div className="flex space-x-4">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm font-medium"
            >
              Home
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm font-medium"
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/auth">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm font-medium"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content wrapper with flex centering */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-88px)] py-10">
        {/* Contact Container */}
        <div className="w-full max-w-lg mx-auto relative z-10">
          {/* Title */}
          <h1 className="text-4xl font-black text-white mb-6 text-center">
            <span
              className="drop-shadow-2xl text-white filter contrast-150 brightness-110"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Get in Touch
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 text-center mb-8 max-w-md mx-auto">
            Have questions about our platform? We're here to help you transform your educational experience.
          </p>
          
          {/* Contact Form */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl mb-8">
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 text-left">
                  <label htmlFor="name" className="text-gray-200 font-medium">Name</label>
                  <Input
                    id="name"
                    type="text"
                    className="bg-white/10 border-white/20 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="text-gray-200 font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-white/10 border-white/20 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="subject" className="text-gray-200 font-medium">Subject</label>
                <Input
                  id="subject"
                  type="text"
                  className="bg-white/10 border-white/20 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="What's this about?"
                />
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="message" className="text-gray-200 font-medium">Message</label>
                <Textarea
                  id="message"
                  rows={4}
                  className="bg-white/10 border-white/20 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Tell us how we can help you"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-cyan-300 text-lg font-medium mb-1">Email Us</div>
              <p className="text-gray-200">support@academic-ai.edu</p>
            </div>
            <div className="text-center bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-cyan-300 text-lg font-medium mb-1">Call Us</div>
              <p className="text-gray-200">+1 (800) 123-4567</p>
            </div>
            <div className="text-center bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-cyan-300 text-lg font-medium mb-1">Visit Us</div>
              <p className="text-gray-200">123 Education Ave, Innovation District</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Glow Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}