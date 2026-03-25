
interface CheckboxItem {
  id: number | string;
  name: string;
  category?: string;
  emoji?: string;
  isFavorite?: boolean;
}

interface CheckboxListProps {
  items: CheckboxItem[];
  selectedIds: (number | string)[];
  onToggle: (id: number | string) => void;
  searchQuery?: string;
  showAll?: boolean;
  onShowAll?: () => void;
  maxVisible?: number;
  className?: string;
}

export default function CheckboxList({
  items,
  selectedIds,
  onToggle,
  searchQuery = "",
  showAll = false,
  onShowAll,
  maxVisible = 5,
  className = ""
}: CheckboxListProps) {
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, maxVisible);
  const hasMoreItems = filteredItems.length > maxVisible && !showAll;

  return (
    <ul className={`bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto ${className}`}>
      {visibleItems.map((item) => (
        <li 
          key={item.id} 
          className="flex items-center px-4 py-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
          onClick={() => onToggle(item.id)}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => onToggle(item.id)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded mr-3"
          />
          {item.emoji && <span className="text-2xl mr-3">{item.emoji}</span>}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium truncate">{item.name}</span>
            {item.category && (
              <span className="text-xs text-blue-400 uppercase tracking-wide font-semibold truncate">
                {item.category}
              </span>
            )}
          </div>
          {item.isFavorite && (
            <span className="ml-2 text-yellow-400" title="Favorito">★</span>
          )}
        </li>
      ))}
      {hasMoreItems && onShowAll && (
        <li className="text-center py-2">
          <button 
            className="text-blue-400 hover:underline" 
            onClick={onShowAll}
          >
            Mostrar todos ({filteredItems.length - maxVisible} más)
          </button>
        </li>
      )}
    </ul>
  );
} 