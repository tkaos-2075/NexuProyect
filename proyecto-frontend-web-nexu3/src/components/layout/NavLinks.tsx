interface NavLinksProps {
  onDashboard: () => void;
  onPlaces: () => void;
  onLabels: () => void;
}

export default function NavLinks({ onDashboard, onPlaces, onLabels }: NavLinksProps) {
  return (
    <nav className="hidden md:flex space-x-8">
      <button
        onClick={onDashboard}
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
      >
        Dashboard
      </button>
      <button
        onClick={onPlaces}
        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
      >
        Lugares
      </button>
      <button
        onClick={onLabels}
        className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium"
      >
        Labels
      </button>
    </nav>
  );
} 