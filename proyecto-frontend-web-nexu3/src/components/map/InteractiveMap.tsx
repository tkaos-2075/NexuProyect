import { useEffect, useRef } from "react";
import GoogleMap from "./GoogleMap";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { Marker } from "@vis.gl/react-google-maps";
import MapSearchControls from './MapSearchControls';
import MapAddPlaceModal from './MapAddPlaceModal';
import { useMapState } from '@hooks/useMapState';
import { useMapSearch } from '@hooks/useMapSearch';
import { useToast } from '@components/ui/SimpleToast';
import { getRoleBasedOnToken } from '@utils/getRoleBasedOnToken';

interface InteractiveMapProps {
	className?: string;
	onPlacesLoaded?: (places: (PlacesToEatResponseDto | PlacesToFunResponseDto)[]) => void;
	onCreatePlan?: () => void;
	center?: { lat: number; lng: number } | null;
	zoom?: number | null;
}

export default function InteractiveMap({ 
	className = "", 
	onPlacesLoaded, 
	onCreatePlan = () => {}, 
	center, 
	zoom 
}: InteractiveMapProps) {
	// Hook para manejar el estado del mapa
	const mapState = useMapState({ center, zoom, onPlacesLoaded });
	
	// Hook para manejar búsquedas
	const { loadNexuPlaces, searchLocation } = useMapSearch({
		onPlacesLoaded,
		setLoading: mapState.setLoading,
		updateLoadedPlaces: mapState.updateLoadedPlaces,
	});

	const { showToast, ToastContainer } = useToast();

	// Ref para mantener el valor más reciente de isSelectingPlace
	const isSelectingPlaceRef = useRef(mapState.isSelectingPlace);
	useEffect(() => {
		isSelectingPlaceRef.current = mapState.isSelectingPlace;
	}, [mapState.isSelectingPlace]);

	// Carga automática de lugares al montar el componente
	useEffect(() => {
		loadNexuPlaces();
	}, []);

	// Permite buscar con Enter
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	// Busca una dirección y centra el mapa
	const handleSearch = async () => {
		const coords = await searchLocation(mapState.searchQuery);
		if (coords) {
			mapState.updateMapCenter(coords);
			mapState.updateMapZoom(15);
		}
	};

	// Al hacer click en un marcador, centra el mapa y muestra detalles
	const handleMarkerClick = (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
		mapState.updateMapCenter({ lat: place.latitude, lng: place.longitude });
		mapState.updateMapZoom(17);
		mapState.updateSelectedPlace(place);
		mapState.updateSidebarOpen(true);
	};

	// Permite seleccionar coordenadas en el mapa para agregar un nuevo lugar
	const handleMapClickForAdd = (coords: { lat: number; lng: number }) => {
		console.log('Map click detected:', coords, 'isSelectingPlace:', isSelectingPlaceRef.current);
		if (isSelectingPlaceRef.current) {
			mapState.updateSelectedCoords(coords);
			console.log('Updated selected coords:', coords);
		}
	};

	// Cuando el usuario mueva el mapa, deja de forzar el centro
	const handleMapCenterChange = (newCenter: { lat: number; lng: number }) => {
		if (mapState.shouldForceCenter) {
			mapState.resetForceCenter();
		} else {
			mapState.updateMapCenter(newCenter);
		}
	};

	// Cierra el modal de agregar lugar
	const handleCloseAddPlace = () => {
		mapState.updateShowAddPlace(false);
		mapState.updateSelectedCoords(null);
		mapState.updateSelectingPlace(false);
	};

	// Botón flotante para agregar lugar en la posición seleccionada
	const handleAddPlaceClick = () => {
		let userRole = null;
		try {
			userRole = getRoleBasedOnToken();
		} catch {
			userRole = null;
		}
		if (userRole !== 'USER' && userRole !== 'ADMIN') {
			showToast('No tienes permisos para agregar lugares.', 'error');
			return;
		}
		mapState.updateShowAddPlace(true);
	};

	return (
		<div
			className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden fixed top-20 left-6 z-40 ${className}`}
			style={{ height: 'calc(100vh - 6rem - 5px)', width: '50%' }}
		>
			<ToastContainer />
			{/* Header con barra de búsqueda y acciones */}
			<MapSearchControls
				searchQuery={mapState.searchQuery}
				onSearchQueryChange={mapState.updateSearchQuery}
				onSearch={handleSearch}
				isLoading={mapState.isLoading}
				onCreatePlan={onCreatePlan}
				canCreatePlan={!!mapState.loadedPlaces.length}
				onKeyPress={handleKeyPress}
			/>

			{/* Modal para agregar lugar */}
			<MapAddPlaceModal
				isOpen={mapState.showAddPlace}
				selectedCoords={mapState.selectedCoords}
				onClose={handleCloseAddPlace}
			/>

			{/* Contenido principal del mapa */}
			<div
				style={{ width: "100%", height: "calc(100vh - 6rem - 5px - 70px)", background: "#eee" }}
				className="relative"
			>
				{/* Botón flotante para agregar lugar en la posición seleccionada */}
				{mapState.selectedCoords && mapState.isSelectingPlace && !mapState.showAddPlace && (
					<button
						className="absolute z-50 top-6 left-1/2 -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold"
						onClick={handleAddPlaceClick}
					>
						Agregar lugar aquí
					</button>
				)}
				
				<GoogleMap 
					center={mapState.shouldForceCenter ? mapState.mapCenter : undefined}
					zoom={mapState.shouldForceCenter ? mapState.mapZoom : undefined}
					onLocationRequest={() => console.log("Ubicación actual obtenida")}
					places={mapState.loadedPlaces}
					onMarkerClick={handleMarkerClick}
					onMapClick={handleMapClickForAdd}
					selectPlaceMode={mapState.isSelectingPlace}
					onSelectPlaceModeChange={(active) => {
						console.log('Select place mode changed:', active);
						mapState.updateSelectingPlace(active);
					}}
					onMapReady={mapState.updateMapInstance}
					onMapCenterChange={handleMapCenterChange}
				>
					{/* Marcador temporal verde para la selección de lugar */}
					{mapState.selectedCoords && mapState.isSelectingPlace && (
						<Marker
							position={mapState.selectedCoords}
							icon={{
								path: window.google?.maps?.SymbolPath.CIRCLE || 0,
								scale: 10,
								fillColor: "#22c55e",
								fillOpacity: 1,
								strokeWeight: 2,
								strokeColor: "#fff",
							}}
							zIndex={9999}
						/>
					)}
				</GoogleMap>
			</div>
		</div>
	);
} 