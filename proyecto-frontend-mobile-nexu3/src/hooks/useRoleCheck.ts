import { useMemo, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRoleBasedOnToken } from '@utils/getRoleBasedOnToken';

export function useRoleCheck() {
  const [role, setRole] = useState<string | undefined>(undefined);

  // Cargar el rol desde el token almacenado
  const refreshRole = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const detectedRole = await getRoleBasedOnToken();
      const normalizedRole = String(detectedRole).toUpperCase();
      setRole(normalizedRole);
      console.log('🔍 useRoleCheck - Rol detectado:', detectedRole, 'Normalizado:', normalizedRole);
    } catch (error) {
      console.error('❌ useRoleCheck - Error al obtener rol:', error);
      setRole(undefined);
    }
  }, []);

  useEffect(() => {
    refreshRole();
  }, [refreshRole]);

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
    refreshRole,
  };

  return result;
} 