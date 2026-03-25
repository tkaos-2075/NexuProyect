import { useMemo, useEffect, useState } from 'react';
import { getRoleBasedOnToken } from '@utils/getRoleBasedOnToken';

export function useRoleCheck() {
  const [tokenChange, setTokenChange] = useState(0);

  // Escuchar cambios en el token
  useEffect(() => {
    const handleStorageChange = () => {
      setTokenChange(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios locales (cuando se actualiza el token en el mismo tab)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if (key === 'token') {
        setTokenChange(prev => prev + 1);
      }
      return originalSetItem.apply(this, [key, value]);
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const role = useMemo(() => {
    try {
      const detectedRole = getRoleBasedOnToken();
      // Normalizar el rol a mayúsculas para consistencia
      const normalizedRole = String(detectedRole).toUpperCase();
      return normalizedRole;
    } catch (error) {
      console.error('❌ useRoleCheck - Error al obtener rol:', error);
      return undefined;
    }
  }, [tokenChange]);

  const permissions = useMemo(() => {
    if (!role) return {};

    const basePermissions = {
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canManageLabels: false,
    };

    switch (role) {
      case 'ADMIN':
        return {
          ...basePermissions,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canManageLabels: true,
        };
      
      case 'USER':
        return {
          ...basePermissions,
          canCreate: true,
          canEdit: true,
          canDelete: false,
          canManageLabels: false,
        };
      
      case 'VIEWER':
        return {
          ...basePermissions,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canManageLabels: false,
        };
      
      default:
        return basePermissions;
    }
  }, [role]);

  const result = {
    role,
    permissions,
    isAdmin: role === 'ADMIN',
    isUser: role === 'USER',
    isViewer: role === 'VIEWER',
    hasRole: (allowedRoles: string[]) => role ? allowedRoles.map(r => r.toUpperCase()).includes(role) : false,
  };

  return result;
} 