import { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { updateUser } from '@services/users/updateUser';
import { getCurrentUser } from '@services/users/currentUser';
import { getPlansByUserId } from '@services/plans/getPlansByUserId';
import { getFavoritesPlacesToEatByUser } from '@services/placesToEat/getFavoritesPlacesToEatByUser';
import { getFavoritesPlacesToFunByUser } from '@services/placesToFun/getFavoritesPlacesToFunByUser';
import { deleteUser } from '@services/users/deleteUser';
import Navbar from '@components/Navbar';
import { ProfileInfo, ProfileEditForm, ProfileFavorites, ProfilePlans, ProfileDangerZone } from '@components/profile';
import { useToast } from '@components/ui/SimpleToast';
import { UsersResponseDto } from '@interfaces/user/UsersResponseDto';
import { PlansResponseDto } from '@interfaces/plans/PlansResponseDto';
import { PlacesToEatResponseDto } from '@interfaces/placesToEat/PlacesToEatResponseDto';
import { PlacesToFunResponseDto } from '@interfaces/placesToFun/PlacesToFunResponseDto';

export default function ProfilePage() {
	const [user, setUser] = useState<UsersResponseDto | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [plans, setPlans] = useState<PlansResponseDto[]>([]);
	const [favEat, setFavEat] = useState<PlacesToEatResponseDto[]>([]);
	const [favFun, setFavFun] = useState<PlacesToFunResponseDto[]>([]);
	const [loadingFavorites, setLoadingFavorites] = useState(false);
	const { showToast, ToastContainer } = useToast();
	const { logout } = useAuth();

	// Formulario de edición
	const [editForm, setEditForm] = useState({
		name: '',
		email: '',
		password: '', // Contraseña actual
		newPassword: '' // Nueva contraseña opcional
	});

	useEffect(() => {
		fetchUserData();
	}, []);

	const fetchUserData = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await getCurrentUser();
			setUser(response.data);
			setEditForm({
				name: response.data.name,
				email: response.data.email,
				password: '',
				newPassword: ''
			});

			// Cargar planes y favoritos
			await Promise.all([
				fetchPlans(response.data.id),
				fetchFavorites(response.data.id)
			]);
		} catch (err) {
			setError('Error al cargar la información del usuario');
			console.error('Error fetching user data:', err);
		} finally {
			setLoading(false);
		}
	};

	const fetchPlans = async (userId: number) => {
		try {
			const plansRes = await getPlansByUserId(userId);
			setPlans(plansRes.data || []);
		} catch (err) {
			console.error('Error fetching plans:', err);
		}
	};

	const fetchFavorites = async (userId: number) => {
		try {
			setLoadingFavorites(true);
			const [favEatRes, favFunRes] = await Promise.all([
				getFavoritesPlacesToEatByUser(userId),
				getFavoritesPlacesToFunByUser(userId)
			]);
			setFavEat(favEatRes.data || []);
			setFavFun(favFunRes.data || []);
		} catch (err) {
			console.error('Error fetching favorites:', err);
			// No mostrar error general, solo log
		} finally {
			setLoadingFavorites(false);
		}
	};


	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		try {
			if (!user) return;
			if (!editForm.password && !editForm.newPassword) {
				showToast('Debes ingresar tu contraseña actual o una nueva para guardar los cambios.', 'error');
				return;
			}
			const passwordToSend = editForm.newPassword ? editForm.newPassword : editForm.password;
			const payload = {
				name: editForm.name,
				email: editForm.email,
				password: passwordToSend
			};
			await updateUser(user.id, payload);

			// Si el email fue cambiado, cerrar sesión y redirigir a login
			if (editForm.email !== user.email) {
				showToast('Email actualizado. Por seguridad, inicia sesión nuevamente.', 'success');
				setTimeout(() => {
					logout();
					window.location.href = "/";
				}, 2000);
				return;
			}

			setIsEditing(false);
			await fetchUserData();
			setEditForm(prev => ({ ...prev, password: '', newPassword: '' }));
			showToast('¡Perfil actualizado correctamente!', 'success');
		} catch (err) {
			showToast('Error al actualizar el perfil.', 'error');
			console.error('Error al guardar:', err);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Restaurar valores originales
		if (user) {
			setEditForm({
				name: user.name,
				email: user.email,
				password: '',
				newPassword: ''
			});
		}
	};

	const handleDeleteAccount = async () => {
		try {
			if (!user) return;
			await deleteUser(user.id);
			showToast('Cuenta eliminada correctamente.', 'success');
			setTimeout(() => {
				logout();
				window.location.href = "/";
			}, 1500);
		} catch (err) {
			showToast('Error al eliminar la cuenta.', 'error');
			console.error('Error al eliminar cuenta:', err);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'INACTIVE':
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			case 'SUSPENDED':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return 'Activo';
			case 'INACTIVE':
				return 'Inactivo';
			case 'PENDING':
				return 'Pendiente';
			case 'SUSPENDED':
				return 'Suspendido';
			default:
				return status;
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<Navbar />
				<div className="pt-20 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-gray-600 dark:text-gray-300">Cargando perfil...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<Navbar />
				<div className="pt-20 flex items-center justify-center">
					<div className="text-center">
						<div className="text-red-500 text-2xl mb-4">⚠️</div>
						<p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
						<button
							onClick={fetchUserData}
							className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
						>
							Reintentar
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Navbar />
			
			<div className="pt-20 p-6">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Perfil de Usuario
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Gestiona tu información personal y configuración de cuenta
						</p>
					</div>

					{/* Información del usuario o formulario de edición */}
					{user && !isEditing && (
						<ProfileInfo
							user={user}
							isEditing={isEditing}
							onEdit={handleEdit}
							getStatusColor={getStatusColor}
							getStatusText={getStatusText}
						/>
					)}
					{user && isEditing && (
						<ProfileEditForm
							editForm={editForm}
							setEditForm={setEditForm}
							onSave={handleSave}
							onCancel={handleCancel}
							loading={loading}
						/>
					)}

					{/* Planes */}
					<ProfilePlans plans={plans} loading={loading} />

					{/* Favoritos */}
					<ProfileFavorites favEat={favEat} favFun={favFun} loadingFavorites={loadingFavorites} />

					{/* Zona de peligro */}
					<ProfileDangerZone
						onDelete={handleDeleteAccount}
						onCancel={() => setShowDeleteConfirm(false)}
						showDeleteConfirm={showDeleteConfirm}
						setShowDeleteConfirm={setShowDeleteConfirm}
					/>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
} 