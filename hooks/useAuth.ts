import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { session, user, loading, initializeAuth, signUp, signIn, signOut, forgotPassword } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    forgotPassword,
  };
};