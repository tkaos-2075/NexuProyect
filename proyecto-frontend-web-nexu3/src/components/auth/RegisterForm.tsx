import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "src/contexts/AuthContext";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import FormField from '@components/common/FormField';

interface RegisterFormProps {
	onLoadingChange?: (loading: boolean) => void;
}

export default function RegisterForm({ onLoadingChange }: RegisterFormProps) {
	const authContext = useAuthContext();
	const navigate = useNavigate();

	const [formData, setFormData] = useState<RegisterRequest>({
		name: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<Partial<RegisterRequest>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// Validación de campos del formulario
	function validateForm(): boolean {
		const newErrors: Partial<RegisterRequest> = {};
		if (!formData.name) {
			newErrors.name = "El nombre es requerido";
		} else if (formData.name.length < 2) {
			newErrors.name = "El nombre debe tener al menos 2 caracteres";
		}
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

	// Maneja cambios en los campos del formulario
	function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof RegisterRequest]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	}

	// Envía el formulario de registro
	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!validateForm()) return;
		setIsLoading(true);
		onLoadingChange?.(true);
		try {
			await authContext.register(formData);
			navigate("/dashboard");
		} catch (err: any) {
			console.error("Error al registrarse:", err);
			setErrors({
				email: "Error al crear la cuenta. Verifica tus datos e intenta nuevamente."
			});
		} finally {
			setIsLoading(false);
			onLoadingChange?.(false);
		}
	}

	return (
		<div className="register-form-container">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Crear Cuenta</h2>
				<p className="text-gray-700 dark:text-white/70">Completa tus datos para comenzar</p>
			</div>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Campo nombre */}
				<FormField
					label="Nombre Completo"
					name="name"
					type="text"
					value={formData.name}
					onChange={handleChange}
					placeholder="Tu nombre completo"
					required
					error={errors.name}
					disabled={isLoading}
					className="register-input"
				/>
				
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
					className="register-input"
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
						className="register-input pr-12"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 transition-colors"
						disabled={isLoading}
					>
						{showPassword ? "🙈" : "👁️"}
					</button>
					<div className="mt-2 text-xs text-gray-500 dark:text-white/60">
						La contraseña debe tener al menos 4 caracteres.
					</div>
				</div>
				
				{/* Botón de registro */}
				<button
					type="submit"
					disabled={isLoading}
					className="register-button"
				>
					{isLoading ? (
						<div className="flex items-center justify-center">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
							Creando cuenta...
						</div>
					) : (
						"Crear Cuenta"
					)}
				</button>
				
				{/* Términos y privacidad */}
				<div className="text-center text-xs text-gray-500 dark:text-white/60">
					Al crear una cuenta, aceptas nuestros{" "}
					<Link to="/terms" className="register-link">
						Términos de Servicio
					</Link>{" "}
					y <Link to="/privacy" className="register-link">Política de Privacidad</Link>
				</div>
			</form>
		</div>
	);
}
