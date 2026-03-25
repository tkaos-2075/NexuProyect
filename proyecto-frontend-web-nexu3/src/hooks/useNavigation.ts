import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { useRoleCheck } from '@hooks/useRoleCheck';
import { useState } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
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

  // Navegación a páginas principales
  const navigateToDashboard = () => navigate('/dashboard');
  const navigateToPlaces = () => navigate('/places');
  const navigateToLabels = () => navigate('/labels');

  return {
    // Estado
    showViewerWarning,
    setShowViewerWarning,
    
    // Roles
    isViewer,
    isAdmin,
    isUser,
    
    // Acciones de navegación
    handleLogout,
    handleLogin,
    handleProfileClick,
    handleLogoClick,
    navigateToDashboard,
    navigateToPlaces,
    navigateToLabels,
  };
}; 