
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="my-8 p-6 bg-red-700/30 border border-red-500 rounded-lg text-center">
      <h3 className="text-xl font-semibold text-red-300 mb-3">Oops! Algo deu errado.</h3>
      <p className="text-red-200 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-yellow-500 text-slate-900 font-semibold rounded-md hover:bg-yellow-600 transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;