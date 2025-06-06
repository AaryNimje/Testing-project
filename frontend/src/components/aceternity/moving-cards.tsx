"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const cards = [
  {
    id: 1,
    title: "AI-Powered Lesson Planning",
    description: "Generate comprehensive lesson plans with learning objectives, activities, and assessments in minutes.",
    icon: "📚",
    // Removed gradient as background is handled by the main page
  },
  {
    id: 2,
    title: "Intelligent Tutoring System",
    description: "24/7 personalized tutoring that adapts to each student's learning pace and style.",
    icon: "🧠",
    // Removed gradient
  },
  {
    id: 3,
    title: "Automated Assessment",
    description: "Create quizzes, grade assignments, and provide instant feedback with AI assistance.",
    icon: "✅",
    // Removed gradient
  },
  {
    id: 4,
    title: "Google Workspace Integration",
    description: "Seamlessly connect with Gmail, Calendar, Drive, and Sheets for unified workflow.",
    icon: "🔗",
    // Removed gradient
  },
  {
    id: 5,
    title: "Real-time Analytics",
    description: "Track student progress, engagement metrics, and learning outcomes with detailed insights.",
    icon: "📊",
    // Removed gradient
  },
  {
    id: 6,
    title: "Role-Based Access",
    description: "Secure platform with customized interfaces for students, faculty, and administrators.",
    icon: "🛡️",
    // Removed gradient
  }
];

export function MovingCards() {
  return (
    // Removed background gradient and padding from this container
    <div className="relative overflow-hidden">
      {/* Removed the title and description section */}
      {/* <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4 font-serif">
          Transforming Education Through Innovation
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
          Discover how our AI-powered platform revolutionizes the way we teach, learn, and manage academic institutions
        </p>
      </div> */}

      <div className="relative">
        <motion.div
          className="flex space-x-6"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...cards, ...cards].map((card, index) => (
            <motion.div
              key={`${card.id}-${index}`}
              className="flex-shrink-0"
              // Updated hover effect: removed scale, kept subtle glow
              whileHover={{
                 boxShadow: "0 0 25px rgba(56, 189, 248, 0.6), 0 0 50px rgba(56, 189, 248, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Updated card styling: increased height (h-40) */}
              <Card className="w-72 h-40 shadow-xl hover:shadow-2xl transition-all duration-300 border border-cyan-500/20 overflow-hidden bg-slate-800/70 backdrop-blur-sm"> {/* Changed h-32 to h-40 */}
                <CardContent className={cn(
                  "p-4 h-full text-white relative flex flex-col justify-between", // Adjusted padding and added flex properties
                  // Removed card.gradient as background is now static
                )}>
                  {/* Removed the black overlay div */}
                  {/* <div className="absolute inset-0 bg-black/20"></div> */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      {/* Adjusted icon size and margin */}
                      <div className="text-2xl mb-2">{card.icon}</div>
                      {/* Updated title text color and font */}
                      <h3 className="text-lg font-bold font-serif text-white"> {/* Changed text-xl to text-lg, added text-white, changed font-sans to font-serif */}
                        {card.title}
                      </h3>
                    </div>
                    {/* Updated description text color and font */}
                    <p className="text-xs opacity-90 leading-relaxed font-light text-cyan-100"> {/* Changed text-sm to text-xs, added text-cyan-100 */}
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
