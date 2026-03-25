import { useState, useEffect } from "react";
import { useAuthContext } from "@contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import PlaceCard from "@components/places/PlaceCard";
import CreatePlanForm from "@components/forms/CreatePlanForm";
import InteractiveMap from "@components/map/InteractiveMap";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { useToast } from '@components/ui/SimpleToast';
import { getRoleBasedOnToken } from '@utils/getRoleBasedOnToken';

export default function DashboardPage() {
	const { session, isLoading } = useAuthContext();
	const navigate = useNavigate();
	const location = useLocation();
	const { showToast, ToastContainer } = useToast();

	const [places, setPlaces] = useState<(PlacesToEatResponseDto | PlacesToFunResponseDto)[]>([]);
	const [showPlaces, setShowPlaces] = useState(false);
	const [showCreatePlan, setShowCreatePlan] = useState(false);
	const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
	const [mapZoom, setMapZoom] = useState<number | null>(null);

	// Redirigir si no hay sesión
	useEffect(() => {
		if (!isLoading && !session) {
			navigate('/');
		}
	}, [session, isLoading, navigate]);

	// Centrar el mapa si se recibe lat/lng por location.state
	useEffect(() => {
		if (location.state && location.state.lat && location.state.lng) {
			setMapCenter({ lat: location.state.lat, lng: location.state.lng });
			setMapZoom(17);
		}
	}, [location.state]);

	// Si está cargando, no mostrar nada
	if (isLoading) return null;
	if (!session) return null;

	const handlePlacesLoaded = (loadedPlaces: (PlacesToEatResponseDto | PlacesToFunResponseDto)[]) => {
		setPlaces(loadedPlaces);
		setShowPlaces(true);
		setShowCreatePlan(false); // Ocultar formulario de plan si está abierto
	};

	const handleCreatePlan = () => {
		if (places.length === 0) {
			alert("Primero debes cargar los lugares de Nexu");
			return;
		}
		// Controlar acceso por rol antes de mostrar el formulario
		let userRole = null;
		try {
			userRole = getRoleBasedOnToken();
		} catch {
			userRole = null;
		}
		if (userRole !== 'USER' && userRole !== 'ADMIN') {
			showToast('No tienes permisos para crear planes.', 'error');
			return;
		}
		setShowCreatePlan(true);
		setShowPlaces(false); // Ocultar lista de lugares
	};

	const handlePlanCreated = () => {
		// Aquí puedes agregar lógica adicional cuando se crea un plan
		console.log("Plan creado exitosamente");
	};

	const handlePlanFormClose = () => {
		// Forzar recarga de lugares y mostrar la lista
		setShowCreatePlan(false);
		setShowPlaces(false); // Oculta primero para forzar el render
		setTimeout(() => setShowPlaces(true), 0); // Vuelve a mostrar para disparar el render
	};

	const handleShowOnMap = (place: PlacesToEatResponseDto | PlacesToFunResponseDto) => {
		setMapCenter({ lat: place.latitude, lng: place.longitude });
		setMapZoom(17);
	};

	const renderRightPanel = () => {
		if (showCreatePlan) {
			return (
				<CreatePlanForm
					places={places}
					onClose={handlePlanFormClose}
					onPlanCreated={handlePlanCreated}
				/>
			);
		}

		if (showPlaces) {
			return (
				<div className="space-y-4 ml-8 max-w-2xl w-full">
					<div className="mb-4">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Lugares de Nexu ({places.length})
						</h2>
					</div>
					{places.length > 0 ? (
						<div className="space-y-4">
							{places.filter(place => place != null).map((place) => (
								<PlaceCard
									key={place.id}
									place={place}
									onShowOnMap={handleShowOnMap}
								/>
							))}
						</div>
					) : (
						<div className="space-y-4">
							<div className="text-center py-8 text-gray-500 dark:text-gray-400">
								No se encontraron lugares
							</div>
						</div>
					)}
				</div>
			);
		}

		return (
			<div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
				<div className="text-center">
					<div className="text-4xl mb-4">🏢</div>
					<p className="text-lg font-semibold">No hay lugares</p>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-cyan-300/40 dark:bg-[#0a1929]">
			<ToastContainer />
			{/* Contenido principal */}
			<div className="dashboard-container">
				<div className="dashboard-content pt-16">
					<div className="flex h-screen">
						{/* Contenido principal */}
						<div className="flex-1 p-6">
							<div className="h-full flex">
								{/* Espacio izquierdo (5%) */}
								<div className="w-[5%]"></div>

								{/* Mapa interactivo (50%) */}
								<div className="w-[50%]">
									<InteractiveMap 
										className="h-full" 
										onPlacesLoaded={handlePlacesLoaded}
										onCreatePlan={handleCreatePlan}
										center={mapCenter}
										zoom={mapZoom}
									/>
								</div>

								{/* Espacio central (3%) */}
								<div className="w-[3%]"></div>

								{/* Panel derecho (35%) */}
								<div className="w-[35%]">
									<div className="h-full overflow-y-auto custom-scrollbar">
										{renderRightPanel()}
										{/* Secciones adicionales */}
									</div>
								</div>

								{/* Espacio derecho (5%) */}
								<div className="w-[5%]"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
