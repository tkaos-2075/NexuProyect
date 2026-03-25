import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { LoginRequest } from "@interfaces/auth/LoginRequest";
import SubmitButton from '@components/forms/SaveButton';
import FormField from '@components/common/FormField';

interface LoginFormProps {
	onLoadingChange?: (loading: boolean) => void;
}

export default function LoginForm({ onLoadingChange }: LoginFormProps) {
	const { login, isLoading, error, clearError } = useAuth({
		onError: (err: unknown) => {
			console.error("Error al iniciar sesión:", err);
		}
	});

	const [formData, setFormData] = useState<LoginRequest>({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<Partial<LoginRequest>>({});
	const [showPassword, setShowPassword] = useState(false);

	// Sincroniza el estado de carga con el componente padre
	useEffect(() => {
		onLoadingChange?.(isLoading);
	}, [isLoading, onLoadingChange]);

	// Muestra errores del hook en el formulario
	useEffect(() => {
		if (error) {
			setErrors({ email: error });
			clearError();
		}
	}, [error, clearError]);

	// Validación de campos
	function validateForm(): boolean {
		const newErrors: Partial<LoginRequest> = {};
		if (!formData.email) {
			newErrors.email = "El email es requerido";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "El email no es válido";
		}
		if (!formData.password) {
			newErrors.password = "La contraseña es requerida";
		} else if (formData.password.length < 4) {
			newErrors.password = "La contraseña debe tener al menos 4 caracteres";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	// Maneja cambios en los campos
	function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof LoginRequest]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	}

	// Envía el formulario de login
	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!validateForm()) return;
		try {
			await login(formData);
		} catch (err: unknown) {
			console.error("Error al iniciar sesión:", err);
			setErrors({ email: "Credenciales incorrectas. Verifica tu email y contraseña." });
		}
	}

	return (
		<div className="login-form-container">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Iniciar Sesión</h2>
				<p className="text-gray-700 dark:text-white/70">Ingresa tus credenciales para continuar</p>
			</div>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Campo email */}
				<FormField
					label="Correo Electrónico"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="tu@email.com"
					required
					error={errors.email}
					disabled={isLoading}
					className="login-input"
				/>
				
				{/* Campo contraseña */}
				<div className="relative">
					<FormField
						label="Contraseña"
						name="password"
						type={showPassword ? "text" : "password"}
						value={formData.password}
						onChange={handleChange}
						placeholder="••••••••"
						required
						error={errors.password}
						disabled={isLoading}
						className="login-input pr-12"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 transition-colors"
						disabled={isLoading}
					>
						{showPassword ? "🙈" : "👁️"}
					</button>
				</div>
				
				{/* Botón de login centrado */}
				<div className="flex justify-center">
					<SubmitButton loading={isLoading} text="Iniciar Sesión" />
				</div>
				
				{/* Links de ayuda y registro */}
				<div className="text-center space-y-2">
					<Link to="/auth/forgot-password" className="login-link text-sm">
						¿Olvidaste tu contraseña?
					</Link>
					<div className="text-gray-600 dark:text-white/70 text-sm">
						¿No tienes cuenta? <Link to="/auth/register" className="login-link font-medium">Regístrate aquí</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
