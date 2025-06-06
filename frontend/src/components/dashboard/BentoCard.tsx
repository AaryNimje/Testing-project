import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BentoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-500',
  gradient = 'from-blue-500/10 to-purple-500/10',
  trend,
  size = 'medium',
  onClick,
  loading = false,
  children
}) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1 min-h-[120px]',
    medium: 'col-span-1 row-span-1 min-h-[140px] md:col-span-2',
    large: 'col-span-1 row-span-2 min-h-[280px] md:col-span-2'
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: { 
      rotate: 5, 
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  const valueVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2, duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm`}>
        <div className="p-4 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 
        bg-white dark:bg-gray-900/50 backdrop-blur-sm
        hover:border-gray-300 dark:hover:border-gray-700
        hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-gray-900/20
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Gradient Background */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 
        group-hover:opacity-100 transition-opacity duration-300
      `} />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="relative p-4 h-full flex flex-col justify-between z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
              {title}
            </h3>
            <motion.div 
              variants={valueVariants}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {value}
            </motion.div>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          
          <motion.div
            variants={iconVariants}
            className={`
              p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
              group-hover:bg-white dark:group-hover:bg-gray-700
              transition-colors duration-300
            `}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </motion.div>
        </div>

        {/* Content */}
        {children && (
          <div className="flex-1 py-3">
            {children}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {trend && (
            <div className="flex items-center space-x-1">
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                ${trend.isPositive 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }
              `}>
                <span className={trend.isPositive ? '↗' : '↘'}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {trend.label}
              </span>
            </div>
          )}
          
          {onClick && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
      </div>
    </motion.div>
  );
};

export default BentoCard;