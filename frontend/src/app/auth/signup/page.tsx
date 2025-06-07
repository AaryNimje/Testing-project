import { LampContainer } from "@/components/aceternity/lamp-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupPage() {
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
          <Link href="/auth">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm font-medium"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm font-medium"
            >
              Contact
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content wrapper with flex centering */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-88px)] py-10">
        {/* Form Container */}
        <div className="w-full max-w-md mx-auto relative z-10">
          {/* Title */}
          <h1 className="text-4xl font-black text-white mb-8 text-center">
            <span
              className="drop-shadow-2xl text-white filter contrast-150 brightness-110"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Join the Academic Revolution
            </span>
          </h1>
          
          {/* Signup Form */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
            <form className="space-y-5">
              <div className="space-y-2 text-left">
                <label htmlFor="name" className="text-gray-200 font-medium">Full Name</label>
                <Input
                  id="name"
                  type="text"
                  className="bg-white/10 border-white/20 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="email" className="text-gray-200 font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  className="bg-white/10 border-white/20 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="password" className="text-gray-200 font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  className="bg-white/10 border-white/20 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Create a password"
                />
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="institution" className="text-gray-200 font-medium">Institution</label>
                <Input
                  id="institution"
                  type="text"
                  className="bg-white/10 border-white/20 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Your school or university"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link href="/auth" className="text-cyan-300 hover:text-cyan-200 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Lamp Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}