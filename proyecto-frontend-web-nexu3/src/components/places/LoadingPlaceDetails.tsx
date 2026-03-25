import { Loader } from '@components/common';

export default function LoadingPlaceDetails() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Loader text="Cargando detalles del lugar..." size="text-4xl" />
    </div>
  );
} 