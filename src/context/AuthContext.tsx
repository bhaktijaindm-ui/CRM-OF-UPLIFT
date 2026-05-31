'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  avatar: string;
  role: 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginSimulated: (email: string, name: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALLOWED_ADMIN_EMAILS = ['upliftxdigi@gmail.com', 'sehajmutreja@gmail.com'];

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async (idToken: string) => {
    setLoading(true);
    try {
      const payload = decodeJwt(idToken);
      if (!payload || !payload.email) {
        return { success: false, error: 'Invalid Google account details' };
      }
      
      const email = payload.email.toLowerCase();
      if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
        return { 
          success: false, 
          error: `Access Denied: ${email} is not authorized to access this dashboard.` 
        };
      }

      const loggedInUser: AuthUser = {
        email,
        name: payload.name || payload.email,
        avatar: payload.picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'admin',
      };

      setUser(loggedInUser);
      localStorage.setItem('crm_user', JSON.stringify(loggedInUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginSimulated = async (email: string, name: string, avatar?: string) => {
    setLoading(true);
    try {
      const lowerEmail = email.toLowerCase();
      if (!ALLOWED_ADMIN_EMAILS.includes(lowerEmail)) {
        return { 
          success: false, 
          error: `Access Denied: ${lowerEmail} is not authorized to access this dashboard.` 
        };
      }

      const loggedInUser: AuthUser = {
        email: lowerEmail,
        name,
        avatar: avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'admin',
      };

      setUser(loggedInUser);
      localStorage.setItem('crm_user', JSON.stringify(loggedInUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true);
    try {
      const lowerEmail = email.toLowerCase();
      const adminUsers = ['upliftxdigi@gmail.com', 'sehajmutreja@gmail.com'];
      
      if (adminUsers.includes(lowerEmail)) {
        if (password === 'admin123') {
          const loggedInUser: AuthUser = {
            email: lowerEmail,
            name: lowerEmail === 'upliftxdigi@gmail.com' ? 'Uplift Digital' : 'Sehaj Mutreja',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            role: 'admin',
          };
          setUser(loggedInUser);
          localStorage.setItem('crm_user', JSON.stringify(loggedInUser));
          return { success: true };
        } else {
          return { success: false, error: 'Invalid password' };
        }
      }

      if (lowerEmail === 'sarah@example.com' && password === 'admin123') {
        const loggedInUser: AuthUser = {
          email: lowerEmail,
          name: 'Sarah Jenkins',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          role: 'admin',
        };
        setUser(loggedInUser);
        localStorage.setItem('crm_user', JSON.stringify(loggedInUser));
        return { success: true };
      }

      return { success: false, error: 'User email not authorized or password incorrect' };
    } catch (err) {
      return { success: false, error: 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithCredentials, loginSimulated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
