import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Download, Maximize2, MoreVertical } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: Record<string, any>[];
  chartType: 'line' | 'area' | 'bar' | 'pie';
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  colors?: string[];
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  showTrend?: boolean;
  trendValue?: number;
  onExport?: () => void;
  onExpand?: () => void;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  data,
  chartType,
  dataKey,
  xAxisKey = 'name',
  color = '#3b82f6',
  colors = ['#3b82f6', '#8b5cf6', '#06d6a0', '#f59e0b', '#ef4444'],
  size = 'medium',
  loading = false,
  showTrend = false,
  trendValue,
  onExport,
  onExpand,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses: { [key in 'small' | 'medium' | 'large']: string } = {
    small: 'col-span-1 row-span-1 min-h-[200px]',
    medium: 'col-span-1 row-span-1 min-h-[300px] md:col-span-2',
    large: 'col-span-1 row-span-2 min-h-[400px] md:col-span-2 lg:col-span-3'
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.01,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2, duration: 0.3 }
    }
  };

  const chartVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { delay: 0.4, duration: 0.5 }
    }
  };

  // Custom tooltip component
  interface CustomTooltipProps {
    active?: boolean;
    payload?: {
      name: string;
      value: number;
      color: string;
    }[];
    label?: string;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render different chart types
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.3} />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.3} />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorArea)"
              animationDuration={1200}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.3} />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              label={({ name, percent }: { name: string; percent?: number }) => (percent ? `${name} ${(percent * 100).toFixed(0)}%` : name)}
              animationDuration={1000}
            >
              {data.map((entry: Record<string, any>, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      default:
        return <></>;
    }
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        ${sizeClasses[size]} 
        ${className}
        group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 
        bg-white dark:bg-gray-900/50 backdrop-blur-sm
        hover:border-gray-300 dark:hover:border-gray-700
        hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-gray-900/20
        transition-all duration-300 ease-out
      `}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 h-full flex flex-col z-10">
        {/* Header */}
        <motion.div 
          variants={headerVariants}
          className="flex items-start justify-between mb-6"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
            {showTrend && trendValue !== undefined && (
              <div className="flex items-center space-x-2 mt-2">
                {trendValue > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  trendValue > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {trendValue > 0 ? '+' : ''}{trendValue}%
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {onExport && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExport}
                className={`
                  p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                  hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
                  transition-all duration-200 opacity-0 group-hover:opacity-100
                `}
              >
                <Download className="w-4 h-4" />
              </motion.button>
            )}
            
            {onExpand && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExpand}
                className={`
                  p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                  hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
                  transition-all duration-200 opacity-0 group-hover:opacity-100
                `}
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
                transition-all duration-200 opacity-0 group-hover:opacity-100
              `}
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div 
          variants={chartVariants}
          className="flex-1 min-h-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Shine Effect */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isHovered ? 'animate-pulse' : ''}
      `}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
      </div>
    </motion.div>
  );
};

export default ChartCard;