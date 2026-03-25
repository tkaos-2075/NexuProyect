interface AuthButtonsProps {
  isViewer: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AuthButtons({ isViewer, onLogin, onLogout }: AuthButtonsProps) {
  if (isViewer) {
    return (
      <button
        onClick={onLogin}
        className="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 font-medium"
      >
        Login
      </button>
    );
  }

  return (
    <button
      onClick={onLogout}
      className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-full hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-gray-900 transition-all duration-300 font-medium"
    >
      Cerrar Sesión
    </button>
  );
} 