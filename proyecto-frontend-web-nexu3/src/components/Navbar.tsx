// Barra de navegación principal de NexU
import { useAuthContext } from '@contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRoleCheck } from '@hooks/useRoleCheck';
import { useState } from 'react';
import ThemeToggle from '@components/ui/ThemeToggle';

export default function Navbar() {
	const { logout } = useAuthContext();
	const navigate = useNavigate();
	const { isViewer, isAdmin, isUser } = useRoleCheck();
	const [showViewerWarning, setShowViewerWarning] = useState(false);

	// Cierra sesión y redirige al inicio
	const handleLogout = () => {
		logout();
		navigate('/');
	};

	// Redirige a login
	const handleLogin = () => {
		navigate('/auth/login');
	};

	// Acceso al perfil solo para ADMIN y USER
	const handleProfileClick = () => {
		if (isAdmin || isUser) {
			navigate('/profile');
		} else {
			setShowViewerWarning(true);
		}
	};

	// Logo: viewers hacen logout, otros van al dashboard
	const handleLogoClick = () => {
		if (isViewer) {
			logout();
			navigate('/');
		} else {
			navigate('/dashboard');
		}
	};

	return (
		<>
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo NexU */}
						<span className="text-2xl font-bold gradient-text cursor-pointer" onClick={handleLogoClick}>NexU</span>
						{/* Controles y navegación */}
						<div className="flex items-center space-x-4">
							<ThemeToggle />
							<nav className="hidden md:flex space-x-8">
								<button
									onClick={() => navigate('/dashboard')}
									className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
								>
									Dashboard
								</button>
								<button
									onClick={() => navigate('/places')}
									className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
								>
									Lugares
								</button>
								<button
									onClick={() => navigate('/labels')}
									className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium"
								>
									Labels
								</button>
							</nav>
							{/* Perfil y login/logout */}
							<div className="flex items-center space-x-3">
								<button
									onClick={handleProfileClick}
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
								{isViewer ? (
									<button
										onClick={handleLogin}
										className="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 font-medium"
									>
										Login
									</button>
								) : (
									<button
										onClick={handleLogout}
										className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-full hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-gray-900 transition-all duration-300 font-medium"
									>
										Cerrar Sesión
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</nav>
			{/* Modal de advertencia para viewers */}
			{showViewerWarning && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
						<div className="flex items-center mb-4">
							<div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
								<span className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</span>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Acceso Restringido
							</h3>
						</div>
						<p className="text-gray-600 dark:text-gray-300 mb-6">
							Como usuario viewer, no tienes acceso a la página de perfil. Para acceder a todas las funcionalidades, inicia sesión con una cuenta registrada.
						</p>
						<div className="flex space-x-3">
							<button
								onClick={() => setShowViewerWarning(false)}
								className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								Cerrar
							</button>
							<button
								onClick={() => {
									setShowViewerWarning(false);
									navigate('/auth/login');
								}}
								className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								Ir a Login
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
