import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { LoginRequest } from '@interfaces/auth/LoginRequest';

/**
 * Hook personalizado para manejar la autenticación en la aplicación
 * 
 * UTILIDAD:
 * - Centraliza toda la lógica de autenticación (login, loginAsViewer)
 * - Maneja estados de carga (loading) para mostrar indicadores visuales
 * - Gestiona errores de autenticación de forma consistente
 * - Proporciona navegación automática después del login exitoso
 * - Elimina duplicación de código entre componentes
 * 
 * ARCHIVOS QUE LO UTILIZAN:
 * - src/pages/WelcomePage.tsx: Para login automático como viewer
 * - src/components/LoginForm.tsx: Para login con credenciales del usuario
 * 
 * FUNCIONES PRINCIPALES:
 * - login(): Login con credenciales personalizadas
 * - loginAsViewer(): Login automático con credenciales del backend
 * - isLoading: Estado para mostrar pantallas de carga/spinners
 * - error: Manejo de errores de autenticación
 * - clearError(): Limpiar errores del estado
 */
interface UseAuthOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { login: authLogin, logout: authLogout } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { onSuccess, onError, redirectTo = '/dashboard' } = options;

  /**
   * Realiza login con credenciales personalizadas
   * @param credentials - Credenciales del usuario (email, password)
   */
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await authLogin(credentials);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectTo);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza login automático como viewer usando credenciales del backend
   * Lee las variables de entorno VITE_VIEWER_EMAIL y VITE_VIEWER_PASSWORD
   */
  const loginAsViewer = async () => {
    const viewerEmail = import.meta.env.VITE_VIEWER_EMAIL;
    const viewerPassword = import.meta.env.VITE_VIEWER_PASSWORD;
    
    if (!viewerEmail || !viewerPassword) {
      setError('Credenciales de viewer no configuradas');
      return;
    }

    await login({
      email: viewerEmail,
      password: viewerPassword
    });
  };

  return {
    login,
    loginAsViewer,
    logout: authLogout,
    isLoading,      // Para mostrar spinners/pantallas de carga
    error,          // Para mostrar mensajes de error
    clearError: () => setError(null)
  };
} 