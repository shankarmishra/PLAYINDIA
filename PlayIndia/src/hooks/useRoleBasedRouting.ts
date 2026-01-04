import { useState, useEffect } from 'react';
import useAuth from './useAuth';

type Role = 'admin' | 'coach' | 'store' | 'user' | null;

export const useRoleBasedRouting = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    if (user) {
      setRole(user.role);
    } else {
      setRole(null);
    }
  }, [user]);

  return {
    role,
    isAdmin: role === 'admin',
    isCoach: role === 'coach',
    isStore: role === 'store',
    isUser: role === 'user',
  };
};

