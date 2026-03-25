interface ProfileButtonProps {
  isViewer: boolean;
  onProfileClick: () => void;
}

export default function ProfileButton({ isViewer, onProfileClick }: ProfileButtonProps) {
  return (
    <button
      onClick={onProfileClick}
      className={`flex items-center space-x-2 px-3 py-2 transition-colors duration-200 font-medium ${
        isViewer 
          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
      }`}
      title={isViewer ? 'Acceso restringido para viewers' : 'Ver perfil'}
    >
      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
        isViewer ? 'bg-gray-400 dark:bg-gray-500' : 'bg-primary'
      }`}>
        U
      </span>
      <span className="hidden sm:block">
        {isViewer ? 'Acceso Restringido' : 'Perfil'}
      </span>
    </button>
  );
} 