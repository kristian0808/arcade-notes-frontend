// src/components/common/ErrorMessage.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Use a suitable icon

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 text-center text-red-700 bg-red-100 border border-red-300 rounded-lg ${className}`}>
      <AlertTriangle className="w-8 h-8 mb-2 text-red-500" />
      <p className="text-sm font-medium mb-3">{message || 'An unexpected error occurred.'}</p>
      {onRetry && (
        <button
          className="px-4 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;