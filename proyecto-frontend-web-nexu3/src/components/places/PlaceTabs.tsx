// Tabs para alternar entre información y reviews de un lugar en NexU
import React from "react";

interface PlaceTabsProps {
  activeTab: 'info' | 'reviews';
  setActiveTab: (tab: 'info' | 'reviews') => void;
  reviewsCount: number;
  infoContent: React.ReactNode;
  reviewsContent: React.ReactNode;
}

export default function PlaceTabs({
  activeTab,
  setActiveTab,
  reviewsCount,
  infoContent,
  reviewsContent,
}: PlaceTabsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            📋 Información
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            ⭐ Reviews ({reviewsCount})
          </button>
        </nav>
      </div>
      <div className="p-6">
        {activeTab === 'info' ? infoContent : reviewsContent}
      </div>
    </div>
  );
} 