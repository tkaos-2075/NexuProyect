import React, { useEffect, useState } from 'react';
import { getRoleBasedOnToken } from '@utils/getRoleBasedOnToken';
import { useAuthContext } from '@contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@components/ui/SimpleToast';

interface AuthorizationGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER' | 'VIEWER';
  onUnauthorized?: () => void;
  message?: string;
}

export default function AuthorizationGuard({
  children,
  requiredRole = 'USER',
  onUnauthorized,
  message = "No tienes permisos para acceder a esta funcionalidad."
}: AuthorizationGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const { session, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      navigate('/auth/login', { replace: true });
      return;
    }
    const checkAuthorization = () => {
      try {
        const userRole = getRoleBasedOnToken();
        
        // Mapeo de roles para comparación
        const roleHierarchy = {
          'VIEWER': 1,
          'USER': 2,
          'ADMIN': 3
        };
        
        const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole];
        
        if (userRoleLevel < requiredRoleLevel) {
          showToast(message, 'error');
          onUnauthorized?.();
        }
      } catch (error) {
        showToast(message, 'error');
        onUnauthorized?.();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthorization();
  }, [requiredRole, onUnauthorized, session, isLoading, navigate, message, showToast]);

  if (isLoading || isChecking) {
    return null; // O un loader si prefieres
  }

  return <>{children}</>;
} 