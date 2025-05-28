import React from 'react';

const LoadingSpinner = ({ message = "Generating your recipe..." }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Cooking Icons */}
        <div className="relative">
          <div className="flex space-x-2 text-4xl">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🍳</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>👨‍🍳</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🤖</span>
          </div>
          
          {/* Spinning Circle */}
          <div className="absolute -inset-4 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
          <p className="text-gray-600">Our AI chef is crafting the perfect recipe for you...</p>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-md space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-600">Analyzing your ingredients</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-600">Considering your preferences</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Creating personalized recipe</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-400">Adding nutritional information</span>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-blue-50 rounded-lg p-4 max-w-md">
          <p className="text-sm text-blue-700">
            💡 <strong>Did you know?</strong> Our AI considers over 1000 flavor combinations 
            to create the perfect recipe for your ingredients!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 