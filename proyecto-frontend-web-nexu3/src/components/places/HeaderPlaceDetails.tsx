interface HeaderPlaceDetailsProps {
  name: string;
  onBack: () => void;
}

export default function HeaderPlaceDetails({ name, onBack }: HeaderPlaceDetailsProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Volver</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>
    </div>
  );
} 