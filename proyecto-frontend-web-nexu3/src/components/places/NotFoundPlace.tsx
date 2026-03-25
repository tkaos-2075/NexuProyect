interface NotFoundPlaceProps {
  onBack: () => void;
}

export default function NotFoundPlace({ onBack }: NotFoundPlaceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-gray-600 dark:text-gray-400">Lugar no encontrado</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
} 