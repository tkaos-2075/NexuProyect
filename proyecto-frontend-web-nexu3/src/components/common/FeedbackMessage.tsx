import React from "react";

export type FeedbackType = "error" | "info" | "success" | "warning";

interface FeedbackMessageProps {
  type?: FeedbackType;
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

const icons: Record<FeedbackType, React.ReactNode> = {
  error: "❌",
  info: "ℹ️",
  success: "✅",
  warning: "⚠️"
};

const baseClasses = {
  error: "text-red-500 bg-red-50 border border-red-200",
  info: "text-blue-500 bg-blue-50 border border-blue-200",
  success: "text-green-500 bg-green-50 border border-green-200",
  warning: "text-yellow-600 bg-yellow-50 border border-yellow-200"
};

export default function FeedbackMessage({ type = "info", message, icon, className = "" }: FeedbackMessageProps) {
  return (
    <div className={`flex items-center space-x-2 rounded px-3 py-2 text-sm ${baseClasses[type]} ${className}`}>
      <span className="text-lg">{icon || icons[type]}</span>
      <span>{message}</span>
    </div>
  );
} 