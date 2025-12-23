
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase, isSupabaseAvailable, ADMIN_TABLE_NAME } from './lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('ozapplabs_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    if (!isSupabaseAvailable() || !supabase) {
      console.error('Supabase is not available. Cannot authenticate.');
      console.error('Please check your .env.local file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
      return false;
    }

    try {
      // Fetch admin password from Supabase
      const { data, error } = await supabase
        .from(ADMIN_TABLE_NAME)
        .select('admin_password')
        .eq('id', 'main')
        .single();

      if (error) {
        console.error('Error fetching admin password from Supabase:', error);
        return false;
      }

      // Compare passwords
      if (data && data.admin_password === password) {
        setIsAuthenticated(true);
        localStorage.setItem('ozapplabs_auth', 'true');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ozapplabs_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
