interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export default function UserSearchBar({ 
  searchQuery, 
  onSearchChange, 
  onSelectAll, 
  isAllSelected 
}: UserSearchBarProps) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          onClick={onSelectAll}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm"
        >
          {isAllSelected ? "Deseleccionar Todo" : "Seleccionar Todo"}
        </button>
      </div>
    </div>
  );
} 