import React from 'react'

export const LoadingState: React.FC<{ message?: string; label?: string }> = ({ message, label }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{message || label || 'Đang tải...'}</p>
    </div>
  </div>
)
