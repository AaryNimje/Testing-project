import { LampContainer } from "@/components/aceternity/lamp-effect";
import { MovingCards } from "@/components/aceternity/moving-cards";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 right-0 z-50 p-6">
        <div className="flex space-x-4">
          <Link href="/auth/signup">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm font-medium"
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/auth/signin">
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

      {/* Hero Section with Enhanced Lamp Effect */}
      <LampContainer>
        <div className="text-center space-y-8">
          {/* Main Title - Enhanced with different font and more bold */}
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
            <span 
              className="drop-shadow-2xl text-white filter contrast-150 brightness-110"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Academic AI Platform
            </span>
          </h1>
          
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-6 font-light leading-relaxed">
              Revolutionizing education through intelligent automation
            </p>
            <p className="text-lg text-cyan-300 max-w-2xl mx-auto mb-8 font-medium">
              Empowering educators, inspiring learners, transforming institutions
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link href="/auth/signin">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started Now
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                className="bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:text-white backdrop-blur-sm font-semibold px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </LampContainer>

      {/* Moving Cards Section */}
      <MovingCards />

      {/* Additional Info Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Lightning Fast</h3>
              <p className="text-gray-600 font-light">Get results in seconds, not hours. Our AI processes requests instantly.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Precision Focused</h3>
              <p className="text-gray-600 font-light">Tailored specifically for academic environments and educational workflows.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-sans">Secure & Private</h3>
              <p className="text-gray-600 font-light">Enterprise-grade security with complete data privacy and FERPA compliance.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}