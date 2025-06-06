import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'white';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    white: 'text-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main spinner */}
        <div
          className={`animate-spin rounded-full border-4 border-gray-200 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
          style={{
            borderTopColor: 'currentColor',
            animationDuration: '1s'
          }}
        />
        
        {/* Inner spinning dot for extra visual appeal */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse ${colorClasses[color]}`}
        >
          <div className={`rounded-full bg-current ${
            size === 'sm' ? 'w-1 h-1' :
            size === 'md' ? 'w-1.5 h-1.5' :
            size === 'lg' ? 'w-2 h-2' : 'w-3 h-3'
          }`} />
        </div>
      </div>
      
      {text && (
        <p className={`mt-3 text-sm font-medium ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Preset variations for common use cases
export const FullScreenLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <LoadingSpinner size="xl" color="blue" text={text} />
  </div>
);

export const CardLoader: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner size="lg" color="purple" text={text} />
  </div>
);

export const ButtonLoader: React.FC = () => (
  <LoadingSpinner size="sm" color="white" className="mr-2" />
);

export const TableLoader: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner size="lg" color="blue" text="Loading data..." />
  </div>
);

export default LoadingSpinner;