import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import MapMarkers from "./MapMarkers";

interface GoogleMapProps {
	center?: { lat: number; lng: number };
	zoom?: number;
	onLocationRequest?: () => void;
	onMapCenterChange?: (center: { lat: number; lng: number }) => void;
	places?: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
	onMarkerClick?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
	onMapClick?: (coords: { lat: number; lng: number }) => void;
	selectPlaceMode?: boolean;
	onSelectPlaceModeChange?: (active: boolean) => void;
	onMapReady?: (map: any) => void;
}

function MapWithControls({ 
	onLocationRequest, 
	onMapCenterChange,
	places,
	onMarkerClick,
	onMapClick,
	selectPlaceMode,
	onSelectPlaceModeChange,
	onMapReady
}: { 
	onLocationRequest?: () => void;
	onMapCenterChange?: (center: { lat: number; lng: number }) => void;
	places?: (PlacesToEatResponseDto | PlacesToFunResponseDto)[];
	onMarkerClick?: (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => void;
	onMapClick?: (coords: { lat: number; lng: number }) => void;
	selectPlaceMode?: boolean;
	onSelectPlaceModeChange?: (active: boolean) => void;
	onMapReady?: (map: any) => void;
}) {
	const map = useMap();
	const [isLocating, setIsLocating] = useState(false);
	const [showIcons, setShowIcons] = useState(true);

	// Llama a onMapReady cuando el mapa esté disponible
	useEffect(() => {
		if (map && onMapReady) {
			onMapReady(map);
		}
	}, [map]);

	// Escuchar cambios en el centro del mapa
	useEffect(() => {
		if (map && onMapCenterChange) {
			const listener = map.addListener('center_changed', () => {
				const center = map.getCenter();
				if (center) {
					onMapCenterChange({ lat: center.lat(), lng: center.lng() });
				}
			});

			return () => {
				google.maps.event.removeListener(listener);
			};
		}
	}, [map]);

	// Listener para clicks en el mapa
	useEffect(() => {
		if (map && onMapClick) {
			const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
				if (e.latLng) {
					onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
				}
			});
			return () => {
				google.maps.event.removeListener(clickListener);
			};
		}
	}, [map]);

	const handleGetCurrentLocation = () => {
		if (!navigator.geolocation) {
			alert("La geolocalización no está soportada en este navegador.");
			return;
		}

		setIsLocating(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				map?.panTo({ lat: latitude, lng: longitude });
				map?.setZoom(15);
				setIsLocating(false);
				onLocationRequest?.();
			},
			(error) => {
				console.error("Error obteniendo ubicación:", error);
				alert("No se pudo obtener tu ubicación actual.");
				setIsLocating(false);
			}
		);
	};

	const toggleIcons = () => {
		setShowIcons(!showIcons);
		// Cambiar el estilo del mapa para ocultar/mostrar solo iconos de lugares
		if (map) {
			if (showIcons) {
				// Ocultar solo iconos de lugares, mantener direcciones
				const hiddenIconsStyle = [
					{
						featureType: "poi",
						elementType: "labels.icon",
						stylers: [{ visibility: "off" }]
					},
					{
						featureType: "transit",
						elementType: "labels.icon",
						stylers: [{ visibility: "off" }]
					},
					{
						featureType: "business",
						elementType: "labels.icon",
						stylers: [{ visibility: "off" }]
					}
				];
				map.setOptions({ styles: hiddenIconsStyle });
			} else {
				// Mostrar iconos (estilo por defecto)
				map.setOptions({ styles: [] });
			}
		}
	};

	return (
		<>
			{/* Controles en la esquina superior derecha */}
			<div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
				{/* Botón de ubicación actual */}
				<button
					onClick={handleGetCurrentLocation}
					disabled={isLocating}
					className="bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-700 rounded-lg shadow-lg p-3 transition-all duration-200 hover:shadow-xl"
					title="Obtener mi ubicación actual"
				>
					{isLocating ? (
						<span className="animate-spin text-lg">⏳</span>
					) : (
						<span className="text-lg">📍</span>
					)}
				</button>

				{/* Botón para ocultar/mostrar iconos */}
				<button
					onClick={toggleIcons}
					className="bg-white hover:bg-gray-100 text-gray-700 rounded-lg shadow-lg p-3 transition-all duration-200 hover:shadow-xl"
					title={showIcons ? "Ocultar iconos del mapa" : "Mostrar iconos del mapa"}
				>
					<span className="text-lg">
						{showIcons ? "🚫" : "👁️"}
					</span>
				</button>

				{/* Botón para activar/desactivar modo selección de lugar */}
				<button
					onClick={() => onSelectPlaceModeChange && onSelectPlaceModeChange(!selectPlaceMode)}
					className={`bg-white hover:bg-green-100 text-green-700 rounded-lg shadow-lg p-3 transition-all duration-200 hover:shadow-xl border-2 border-green-500 ${selectPlaceMode ? 'ring-2 ring-green-400' : ''}`}
					title={selectPlaceMode ? "Cancelar selección de lugar" : "Seleccionar un punto para agregar lugar"}
				>
					<span className="text-lg">➕</span>
				</button>
			</div>

			{/* Marcadores del mapa */}
			{places && places.length > 0 && (
				<MapMarkers 
					places={places} 
					onMarkerClick={onMarkerClick}
				/>
			)}
		</>
	);
}

export default function GoogleMap({ 
	center, 
	zoom,
	onLocationRequest,
	onMapCenterChange,
	places,
	onMarkerClick,
	onMapClick,
	selectPlaceMode,
	onSelectPlaceModeChange,
	onMapReady,
	children
}: GoogleMapProps & { children?: React.ReactNode }) {
	const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
	
	// Coordenadas por defecto: UTEC
	const defaultCenter = { lat: -12.139066, lng: -77.015552 };
	const defaultZoom = 16.8;

	return (
		<APIProvider apiKey={API_KEY}>
			<Map
				style={{ width: "100%", height: "90vh" }}
				defaultCenter={defaultCenter}
				center={center || undefined}
				defaultZoom={defaultZoom}
				zoom={zoom || undefined}
				gestureHandling={"cooperative"}
				disableDefaultUI={false}
				zoomControl={true}
				scrollwheel={true}
				streetViewControl={false}
				mapTypeControl={false}
				fullscreenControl={false}
			>
				<MapWithControls 
					onLocationRequest={onLocationRequest} 
					onMapCenterChange={onMapCenterChange}
					places={places}
					onMarkerClick={onMarkerClick}
					onMapClick={onMapClick}
					selectPlaceMode={selectPlaceMode}
					onSelectPlaceModeChange={onSelectPlaceModeChange}
					onMapReady={onMapReady}
				/>
				{children}
			</Map>
		</APIProvider>
	);
} 