import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { User } from '../data/mockdata';

interface EmailAuthInput {
  email: string;
  password: string;
}

interface RegisterInput extends EmailAuthInput {
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (input: EmailAuthInput) => Promise<void>;
  registerWithEmail: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = api.getStoredToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const nextUser = await api.getCurrentUser();
        setUser(nextUser);
      } catch {
        api.clearStoredToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const persistSession = (token: string, nextUser: User) => {
    api.setStoredToken(token);
    setUser(nextUser);
  };

  const loginWithEmail = async ({ email, password }: EmailAuthInput) => {
    const session = await api.loginWithEmail(email, password);
    persistSession(session.token, session.user);
  };

  const registerWithEmail = async (input: RegisterInput) => {
    const session = await api.registerWithEmail(input);
    persistSession(session.token, session.user);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Clear local auth state even if the server is unreachable.
    }
    api.clearStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithEmail, registerWithEmail, logout }}
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
