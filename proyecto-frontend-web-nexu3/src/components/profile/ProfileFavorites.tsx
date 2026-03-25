import React from 'react';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { PlaceCard } from '@components/places';

interface ProfileFavoritesProps {
  favEat: PlacesToEatResponseDto[];
  favFun: PlacesToFunResponseDto[];
  loadingFavorites?: boolean;
}

const ProfileFavorites: React.FC<ProfileFavoritesProps> = ({ favEat, favFun, loadingFavorites }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Favoritos</h2>
    {loadingFavorites ? (
      <p className="text-gray-600 dark:text-gray-300">Cargando favoritos...</p>
    ) : (
      <>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2 mb-2">Para Comer</h3>
        {favEat.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No tienes lugares favoritos para comer.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {favEat.filter(place => place != null).map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2 mb-2">Para Divertirse</h3>
        {favFun.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No tienes lugares favoritos para divertirte.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favFun.filter(place => place != null).map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </>
    )}
  </div>
);

export default ProfileFavorites; 