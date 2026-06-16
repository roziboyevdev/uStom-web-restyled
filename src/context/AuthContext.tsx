import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Enrollment } from '../types';
import { api } from '../lib/api/client';

interface AuthContextType {
  user: User | null;
  enrollments: Enrollment[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  cancelEnrollment: (enrollmentId: string) => Promise<void>;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchUserData = async (token: string) => {
    try {
      const uProfile = await api.getProfile(token);
      setUser(uProfile);
      
      const uEnrollments = await api.getMyEnrollments(token);
      setEnrollments(uEnrollments.filter(e => e.status === 'active'));
    } catch (e: any) {
      console.error('Failed to restore session profile:', e);
      // Unauthentic
      localStorage.removeItem('ustom_access_token');
      localStorage.removeItem('ustom_refresh_token');
      document.cookie = "ustom_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      setEnrollments([]);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('ustom_access_token');
      if (token) {
        await fetchUserData(token);
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const refreshUserData = async () => {
    const token = localStorage.getItem('ustom_access_token');
    if (token) {
      await fetchUserData(token);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const tokens = await api.login(email, password);
      localStorage.setItem('ustom_access_token', tokens.access_token);
      localStorage.setItem('ustom_refresh_token', tokens.refresh_token);
      
      await fetchUserData(tokens.access_token);
    } catch (e: any) {
      setError(e.message || 'Kirishda xatolik yuz berdi.');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // First register
      await api.register(name, email, password);
      // Then login immediately
      await login(email, password);
    } catch (e: any) {
      setError(e.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi.');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (e) {
      console.warn('Silent logout warning:', e);
    } finally {
      setUser(null);
      setEnrollments([]);
      setIsLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    const token = localStorage.getItem('ustom_access_token');
    if (!token) {
      throw new Error('Iltimos, avval ro\'yxatdan o\'ting yoki profilingizga kiring.');
    }
    
    try {
      await api.enrollInCourse(token, courseId);
      // Refresh user enrollments and profile to update seat counts
      await fetchUserData(token);
    } catch (e: any) {
      setError(e.message || 'Kursga yozilish amalga oshmadi.');
      throw e;
    }
  };

  const cancelEnrollment = async (enrollmentId: string) => {
    const token = localStorage.getItem('ustom_access_token');
    if (!token) return;

    try {
      await api.cancelEnrollment(token, enrollmentId);
      await fetchUserData(token);
    } catch (e: any) {
      setError(e.message || 'Yozilishni bekor qilib bo\'lmadi.');
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        enrollments,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        enrollInCourse,
        cancelEnrollment,
        clearError,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
