import React from 'react';
import './common.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
