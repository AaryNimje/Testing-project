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
    gradient: "from-blue-400 to-cyan-400"
  },
  {
    id: 2,
    title: "Intelligent Tutoring System",
    description: "24/7 personalized tutoring that adapts to each student's learning pace and style.",
    icon: "🧠",
    gradient: "from-purple-400 to-pink-400"
  },
  {
    id: 3,
    title: "Automated Assessment",
    description: "Create quizzes, grade assignments, and provide instant feedback with AI assistance.",
    icon: "✅",
    gradient: "from-green-400 to-emerald-400"
  },
  {
    id: 4,
    title: "Google Workspace Integration",
    description: "Seamlessly connect with Gmail, Calendar, Drive, and Sheets for unified workflow.",
    icon: "🔗",
    gradient: "from-orange-400 to-red-400"
  },
  {
    id: 5,
    title: "Real-time Analytics",
    description: "Track student progress, engagement metrics, and learning outcomes with detailed insights.",
    icon: "📊",
    gradient: "from-indigo-400 to-blue-400"
  },
  {
    id: 6,
    title: "Role-Based Access",
    description: "Secure platform with customized interfaces for students, faculty, and administrators.",
    icon: "🛡️",
    gradient: "from-teal-400 to-cyan-400"
  }
];

export function MovingCards() {
  return (
    <div className="relative overflow-hidden py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4 font-serif">
          Transforming Education Through Innovation
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
          Discover how our AI-powered platform revolutionizes the way we teach, learn, and manage academic institutions
        </p>
      </div>
      
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
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="w-80 h-64 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                <CardContent className={cn(
                  "p-6 h-full bg-gradient-to-br",
                  card.gradient,
                  "text-white relative"
                )}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-4">{card.icon}</div>
                      <h3 className="text-xl font-bold mb-3 font-sans">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed font-light">
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