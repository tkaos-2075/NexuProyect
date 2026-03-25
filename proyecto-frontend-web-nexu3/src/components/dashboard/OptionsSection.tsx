import { useState } from 'react';

export default function OptionsSection() {
	const [settings, setSettings] = useState({
		notifications: true,
		darkMode: false,
		locationSharing: true,
		emailUpdates: false
	});

	const handleSettingChange = (setting: string, value: boolean) => {
		setSettings(prev => ({ ...prev, [setting]: value }));
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
			<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configuración</h2>

			<div className="space-y-6">
				{/* Notificaciones */}
				<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">Notificaciones</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Recibe alertas sobre nuevos lugares y actualizaciones
						</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={settings.notifications}
							onChange={(e) => handleSettingChange('notifications', e.target.checked)}
							className="sr-only peer"
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
					</label>
				</div>

				{/* Modo Oscuro */}
				<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">Modo Oscuro</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Cambia entre tema claro y oscuro
						</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={settings.darkMode}
							onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
							className="sr-only peer"
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
					</label>
				</div>

				{/* Compartir Ubicación */}
				<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">Compartir Ubicación</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Permite que otros vean tu ubicación en el mapa
						</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={settings.locationSharing}
							onChange={(e) => handleSettingChange('locationSharing', e.target.checked)}
							className="sr-only peer"
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
					</label>
				</div>

				{/* Actualizaciones por Email */}
				<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">Actualizaciones por Email</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Recibe resúmenes semanales por correo electrónico
						</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={settings.emailUpdates}
							onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
							className="sr-only peer"
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
					</label>
				</div>
			</div>

			{/* Información de la cuenta */}
			<div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información de la Cuenta</h3>
				<div className="space-y-3 text-sm">
					<div className="flex justify-between">
						<span className="text-gray-600 dark:text-gray-400">Email:</span>
						<span className="text-gray-900 dark:text-white">Cargando...</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600 dark:text-gray-400">Miembro desde:</span>
						<span className="text-gray-900 dark:text-white">Cargando...</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600 dark:text-gray-400">Lugares agregados:</span>
						<span className="text-gray-900 dark:text-white">Cargando...</span>
					</div>
				</div>
			</div>

			{/* Acciones */}
			<div className="mt-6 flex space-x-3">
				<button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
					Guardar Cambios
				</button>
				<button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					Restablecer
				</button>
			</div>
		</div>
	);
} 