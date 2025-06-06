import { LampContainer } from "@/components/aceternity/lamp-effect";
import { MovingCards } from "@/components/aceternity/moving-cards";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    // Main container for the single-screen layout and deep blue background
    <div className="min-h-screen max-h-screen overflow-hidden relative bg-gradient-to-b from-blue-900 to-black">
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
          {/* Fixed: Changed from /auth/signin to /auth */}
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

      {/* Hero Section with Enhanced Lamp Effect */}
      <LampContainer>
        <div className="text-center space-y-8">
          {/* Main Title */}
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
            {/* Fixed: Changed from /auth/signin to /auth */}
            <Link href="/auth">
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
      <div className="absolute bottom-8 left-0 w-full z-20">
         <MovingCards />
      </div>
    </div>
  );
}