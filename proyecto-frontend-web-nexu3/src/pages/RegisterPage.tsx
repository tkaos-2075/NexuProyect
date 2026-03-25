import { Link } from 'react-router-dom';
import { RegisterForm } from '@components/auth';
import ThemeToggle from '@components/ui/ThemeToggle';

export default function RegisterPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-200 via-sky-100 to-sky-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link to="/" className="flex items-center">
							<span className="text-2xl font-bold gradient-text">NexU</span>
						</Link>
						<div className="flex items-center space-x-4">
							<ThemeToggle />
							<Link
								to="/auth/login"
								className="px-4 py-2 text-black dark:text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
							>
								Iniciar Sesión
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
						
						{/* Left Side - Welcome Message */}
						<div className="text-center lg:text-left">
							<div className="space-y-6">
								<h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
									Únete a <span className="gradient-text">NexU</span>
								</h1>
								<p className="text-xl text-black/90 dark:text-white/90 mb-8 max-w-lg mx-auto lg:mx-0">
									Crea tu cuenta y comienza a descubrir los mejores lugares cerca de tu universidad
								</p>
								<div className="space-y-4">
									<div className="flex items-center space-x-3 text-gray-800 dark:text-white/80">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
											<span className="text-sm">🚀</span>
										</div>
										<span>Acceso inmediato a recomendaciones exclusivas</span>
									</div>
									<div className="flex items-center space-x-3 text-gray-800 dark:text-white/80">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
											<span className="text-sm">💬</span>
										</div>
										<span>Comparte experiencias con la comunidad</span>
									</div>
									<div className="flex items-center space-x-3 text-gray-800 dark:text-white/80">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
											<span className="text-sm">⭐</span>
										</div>
										<span>Valora y descubre nuevos lugares</span>
									</div>
									<div className="flex items-center space-x-3 text-gray-800 dark:text-white/80">
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
											<span className="text-sm">🎯</span>
										</div>
										<span>Planes personalizados según tus intereses</span>
									</div>
								</div>
							</div>
						</div>

						{/* Right Side - Register Form */}
						<div className="flex justify-center">
							<div className="w-full max-w-md">
								<RegisterForm />
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Background Decoration */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
			</div>
		</div>
	);
}
