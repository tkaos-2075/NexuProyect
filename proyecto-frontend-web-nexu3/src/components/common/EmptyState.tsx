import React from "react";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ message, icon = "📭", className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-gray-500 dark:text-gray-400 text-center">{message}</p>
    </div>
  );
} 