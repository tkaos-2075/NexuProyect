import { useNavigate } from 'react-router-dom';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';
import { useFavorites } from '@hooks/useFavorites';

interface PlaceCardProps {
	place: PlacesToEatResponseDto | PlacesToFunResponseDto;
	compact?: boolean;
	detailed?: boolean;
	onShowOnMap?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
}

export default function PlaceCard({ place, compact = false, detailed = false, onShowOnMap }: PlaceCardProps) {
	const navigate = useNavigate();
	const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		e.stopPropagation(); // Evitar que se active la navegación
		await toggleFavorite(place);
	};

	const handleCardClick = () => {
		try {
			// Verificaciones básicas de seguridad
			if (!place) return;
			if (typeof place !== 'object') return;
			if (place === null) return;
			if (!place.id || typeof place.id !== 'number') return;
			
			// Verificar si es un lugar de comida de manera segura
			const isEat = place.hasOwnProperty('placeCategoryToEat');
			const placeType = isEat ? 'eat' : 'fun';
			navigate(`/place/${placeType}/${place.id}`);
		} catch (error) {
			console.error('Error en handleCardClick:', error);
		}
	};

	const getCategoryName = () => {
		try {
			// Verificaciones básicas de seguridad
			if (!place) return 'Sin categoría';
			if (typeof place !== 'object') return 'Sin categoría';
			if (place === null) return 'Sin categoría';
			
			// Verificar si es un lugar de comida de manera segura
			const isEat = place.hasOwnProperty('placeCategoryToEat');
			
			if (isEat) {
				return (place as PlacesToEatResponseDto).placeCategoryToEat;
			} else if (place.hasOwnProperty('placeCategoryToFun')) {
				return (place as PlacesToFunResponseDto).placeCategoryToFun;
			}
			return 'Sin categoría';
		} catch (error) {
			console.error('Error en getCategoryName:', error);
			return 'Sin categoría';
		}
	};

	const getCategoryEmoji = (category: string) => {
		switch (category) {
			case 'RESTAURANT': return '🍽️';
			case 'COFFEE': return '☕';
			case 'PARK': return '🌳';
			case 'GAMES': return '🎮';
			default: return '📍';
		}
	};

	const getStatusColor = (status: string | undefined) => {
		if (!status || typeof status !== 'string') {
			return 'bg-gray-100 text-gray-800';
		}
		
		switch (status.toLowerCase()) {
			case 'open':
			case 'abierto':
				return 'bg-green-100 text-green-800';
			case 'closed':
			case 'cerrado':
				return 'bg-red-100 text-red-800';
			case 'maintenance':
			case 'mantenimiento':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const favorite = place ? isFavorite(place) : false;

	const labelNames = (place.labelNames || []) as string[];
	let labelsDisplay = '';
	if (labelNames.length > 0) {
		labelsDisplay = labelNames.slice(0, 2).join(', ');
		if (labelNames.length > 2) {
			labelsDisplay += ',...';
		}
	}

	if (compact) {
		return (
			<div 
				className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600"
				onClick={handleCardClick}
			>
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center space-x-2 flex-1 min-w-0">
						<span className="text-lg">{getCategoryEmoji(getCategoryName())}</span>
						<h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
							{place.name}
						</h3>
					</div>
					<button
						onClick={handleFavoriteClick}
						disabled={favoritesLoading}
						className={`text-sm transition-colors duration-200 ${
							favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'
						} ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
						title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
					>
						{favoritesLoading ? '⏳' : (favorite ? '★' : '☆')}
					</button>
				</div>
				
				<div className="text-xs text-gray-600 dark:text-gray-400 truncate">
					{place.address}
				</div>
				
				<div className="flex items-center justify-between mt-2">
					<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(place.status)}`}>
						{place.status || 'Sin estado'}
					</span>
				</div>
			</div>
		);
	}

	if (detailed) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
				<div className="flex justify-between items-start mb-4">
					<div className="flex-1">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							{place.name}
						</h2>
						<div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
							<span className="flex items-center">
								<span className="mr-1">{getCategoryEmoji(getCategoryName())}</span>
								{getCategoryName()}
							</span>
							<span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(place.status)}`}>
								{place.status || 'Sin estado'}
							</span>
						</div>
					</div>
					<button
						onClick={handleFavoriteClick}
						disabled={favoritesLoading}
						className={`text-2xl transition-colors duration-200 ${
							favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'
						} ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
						title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
					>
						{favoritesLoading ? '⏳' : (favorite ? '★' : '☆')}
					</button>
				</div>

				<div className="space-y-3">
					<div>
						<span className="font-medium text-gray-700 dark:text-gray-300">Dirección:</span>
						<p className="text-gray-900 dark:text-white">{place.address}</p>
					</div>
					
					<div>
						<span className="font-medium text-gray-700 dark:text-gray-300">Capacidad:</span>
						<p className="text-gray-900 dark:text-white">{place.capacity} personas</p>
					</div>
					
					{labelNames.length > 0 && (
						<div>
							<span className="font-medium text-gray-700 dark:text-gray-300">Etiquetas:</span>
							<div className="flex flex-wrap gap-2 mt-1">
								{labelNames.map((label, index) => (
									<span
										key={index}
										className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm"
									>
										{label}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div 
			className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-[1.03] hover:border-blue-300 dark:hover:border-blue-600 min-h-[150px] flex flex-col justify-between"
			onClick={handleCardClick}
			style={{ minHeight: 150, maxWidth: 400 }}
		>
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-base font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2">
					{place.name}
				</h3>
				<button
					onClick={handleFavoriteClick}
					disabled={favoritesLoading}
					className={`text-xl transition-colors duration-200 ${
						favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'
					} ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
					title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
				>
					{favoritesLoading ? '⏳' : (favorite ? '★' : '☆')}
				</button>
			</div>

			<div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-2">
				{/* Estado */}
				<div className="flex items-center">
					<span className="font-medium text-gray-600 dark:text-gray-400 mr-1">Estado:</span>
					<span className={`px-2 py-0.5 rounded-full font-medium ${getStatusColor(place.status)}`}>{place.status || 'Sin estado'}</span>
				</div>
				{/* Categoría */}
				<div className="flex items-center">
					<span className="font-medium text-gray-600 dark:text-gray-400 mr-1">Categoría:</span>
					<span className="text-gray-900 dark:text-white">{getCategoryName()}</span>
				</div>
				{/* Etiquetas */}
				{labelsDisplay && (
					<div className="col-span-2 flex items-center mt-1">
						<span className="font-medium text-gray-600 dark:text-gray-400 mr-1">Etiquetas:</span>
						<span className="text-xs font-medium text-blue-700 dark:text-blue-300">{labelsDisplay}</span>
					</div>
				)}
				{/* Dirección */}
				<div className="col-span-2 flex items-start mt-2">
					<span className="font-medium text-gray-600 dark:text-gray-400 mr-1">Dirección:</span>
					<span className="text-gray-900 dark:text-white flex-1 truncate">{place.address}</span>
				</div>
			</div>

			{/* Botón Ver en mapa */}
			{onShowOnMap && (
				<button
					onClick={e => { e.stopPropagation(); onShowOnMap(place); }}
					className="mt-2 px-3 py-1 rounded text-xs font-medium transition-colors w-fit
					bg-cyan-400 hover:bg-cyan-500 text-white
					dark:bg-gray-800 dark:border dark:border-blue-400 dark:text-white dark:hover:bg-blue-900"
					title="Ver en el mapa"
				>
					🗺️ Ver en mapa
				</button>
			)}

			{/* Indicador de clic */}
			<div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
				<span className="text-[10px] text-gray-400 dark:text-gray-500">Haz clic para ver más detalles</span>
				<span className="text-blue-500 text-xs">→</span>
			</div>
		</div>
	);
} 