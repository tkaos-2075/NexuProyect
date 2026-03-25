import { useNavigate } from "react-router-dom";
import Logo from '@components/common/Logo';

export default function NotFoundPage() {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate('/');
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-6 pt-20">
			{/* Fondo decorativo */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
			</div>

			{/* Contenido principal */}
			<div className="relative z-10 text-center max-w-2xl mx-auto">
				{/* Logo y título */}
				<div className="mb-8">
					<Logo size="xl" className="mb-4" />
					<div className="text-8xl font-bold text-gray-300 dark:text-gray-700 mb-4">
						404
					</div>
				</div>

				{/* Mensaje principal */}
				<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
						¡Ups! Página no encontrada
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
						La página que buscas parece haberse perdido en el campus universitario. 
						No te preocupes, te ayudamos a encontrar el camino correcto.
					</p>
					
					{/* Ilustración */}
					<div className="text-6xl mb-6">
						🗺️
					</div>
				</div>

				{/* Sugerencias */}
				<div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 mb-8">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
						¿Qué puedes hacer?
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
						<div className="flex items-start space-x-3">
							<span className="text-2xl">🏠</span>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-white">Ir al inicio</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Regresa a la página principal</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<span className="text-2xl">🔙</span>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-white">Volver atrás</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Regresa a la página anterior</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<span className="text-2xl">🔍</span>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-white">Verificar URL</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Revisa que la dirección sea correcta</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<span className="text-2xl">📞</span>
							<div>
								<h4 className="font-medium text-gray-900 dark:text-white">Contactar soporte</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">Si el problema persiste</p>
							</div>
						</div>
					</div>
				</div>

				{/* Botones de acción */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={handleGoHome}
						className="bg-primary text-white font-semibold py-3 px-8 rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
					>
						🏠 Ir al Inicio
					</button>
					<button
						onClick={handleGoBack}
						className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-3 px-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
					>
						🔙 Volver Atrás
					</button>
				</div>

				{/* Información adicional */}
				<div className="mt-8 text-center">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						¿Necesitas ayuda? Contacta con el equipo de NexU
					</p>
					<div className="flex justify-center space-x-4 mt-2">
						<a href="mailto:soporte@nexu.edu" className="text-primary hover:text-primary-dark transition-colors">
							soporte@nexu.edu
						</a>
						<span className="text-gray-400">|</span>
						<a href="tel:+1234567890" className="text-primary hover:text-primary-dark transition-colors">
							+1 (234) 567-890
						</a>
					</div>
				</div>
			</div>

			{/* Elementos decorativos flotantes */}
			<div className="absolute top-20 left-20 text-4xl opacity-20 animate-bounce">
				📚
			</div>
			<div className="absolute top-40 right-20 text-3xl opacity-20 animate-pulse">
				🎓
			</div>
			<div className="absolute bottom-40 left-32 text-3xl opacity-20 animate-bounce">
				📝
			</div>
			<div className="absolute bottom-20 right-32 text-4xl opacity-20 animate-pulse">
				🔬
			</div>
		</div>
	);
}