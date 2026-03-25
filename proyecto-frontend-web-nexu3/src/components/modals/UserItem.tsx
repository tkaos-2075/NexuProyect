interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: string;
}

interface UserItemProps {
  user: User;
  isSelected: boolean;
  onToggle: (userId: number) => void;
}

export default function UserItem({ user, isSelected, onToggle }: UserItemProps) {
  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
        isSelected
          ? "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
      onClick={() => onToggle(user.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
            {user.username && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                @{user.username}
              </p>
            )}
          </div>
        </div>
        <div className={`w-4 h-4 rounded border-2 ${
          isSelected
            ? "bg-blue-500 border-blue-500"
            : "border-gray-300 dark:border-gray-600"
        }`}>
          {isSelected && (
            <span className="text-white text-xs">✓</span>
          )}
        </div>
      </div>
    </div>
  );
} 