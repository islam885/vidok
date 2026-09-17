import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (loginOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    displayName: string;
    avatar?: string;
    avatarColor?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  quickGuestLogin: (customName?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const STORAGE_KEY_USER = 'rave_current_user';
const STORAGE_KEY_ACCOUNTS = 'rave_accounts_db';

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const NEON_COLORS = [
  '#00f0ff', // Cyan
  '#3b82f6', // Blue
  '#06b6d4', // Teal
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#10b981', // Emerald
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Default guest user initialization if none exists
  useEffect(() => {
    if (!currentUser) {
      const defaultUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 8),
        username: 'cyber_guest',
        email: 'guest@rave.party',
        displayName: 'Cyber Explorer',
        avatar: AVATAR_PRESETS[0],
        avatarColor: '#00f0ff',
        bio: 'Люблю ночные рейвы и музыку ⚡',
        createdAt: Date.now(),
      };
      setCurrentUser(defaultUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser));
    }
  }, []);

  const login = async (loginOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!loginOrEmail.trim() || !pass.trim()) {
      return { success: false, error: 'Заполните логин/email и пароль' };
    }

    try {
      const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      const accounts: Array<User & { passwordHash: string }> = accountsJson ? JSON.parse(accountsJson) : [];

      const found = accounts.find(
        (acc) =>
          acc.username.toLowerCase() === loginOrEmail.toLowerCase().trim() ||
          acc.email.toLowerCase() === loginOrEmail.toLowerCase().trim()
      );

      if (found) {
        if (found.passwordHash !== pass) {
          return { success: false, error: 'Неверный пароль' };
        }
        const { passwordHash, ...userClean } = found;
        setCurrentUser(userClean);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userClean));
        return { success: true };
      }

      // If account doesn't exist in local mock db, we seamlessly authenticate as newly recognized user
      const isEmail = loginOrEmail.includes('@');
      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        username: isEmail ? loginOrEmail.split('@')[0] : loginOrEmail,
        email: isEmail ? loginOrEmail : `${loginOrEmail}@rave.party`,
        displayName: isEmail ? loginOrEmail.split('@')[0] : loginOrEmail,
        avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
        avatarColor: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
        bio: 'В сети через Rave Liquid Glass',
        createdAt: Date.now(),
      };

      accounts.push({ ...newUser, passwordHash: pass });
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));

      setCurrentUser(newUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      return { success: true };
    } catch {
      return { success: false, error: 'Ошибка входа' };
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    displayName: string;
    avatar?: string;
    avatarColor?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.username.trim() || !data.email.trim() || !data.password.trim()) {
      return { success: false, error: 'Пожалуйста, заполните все обязательные поля' };
    }
    if (data.password.length < 4) {
      return { success: false, error: 'Пароль должен содержать минимум 4 символа' };
    }

    try {
      const accountsJson = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      const accounts: Array<User & { passwordHash: string }> = accountsJson ? JSON.parse(accountsJson) : [];

      const exists = accounts.some(
        (acc) =>
          acc.username.toLowerCase() === data.username.toLowerCase().trim() ||
          acc.email.toLowerCase() === data.email.toLowerCase().trim()
      );

      if (exists) {
        return { success: false, error: 'Пользователь с таким логином или почтой уже существует' };
      }

      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        username: data.username.trim(),
        email: data.email.trim(),
        displayName: data.displayName.trim() || data.username.trim(),
        avatar: data.avatar || AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
        avatarColor: data.avatarColor || NEON_COLORS[0],
        bio: 'Новый участник Rave комнаты',
        createdAt: Date.now(),
      };

      accounts.push({ ...newUser, passwordHash: data.password });
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));

      setCurrentUser(newUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      return { success: true };
    } catch {
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

  const quickGuestLogin = (customName?: string) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const guestUser: User = {
      id: 'guest_' + Math.random().toString(36).substring(2, 9),
      username: customName ? customName.toLowerCase().replace(/\s+/g, '_') : `raver_${randomNum}`,
      email: `raver_${randomNum}@rave.party`,
      displayName: customName || `Raver #${randomNum}`,
      avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
      avatarColor: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      bio: 'Гость Rave комнаты',
      createdAt: Date.now(),
    };
    setCurrentUser(guestUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(guestUser));
  };

  const logout = () => {
    quickGuestLogin();
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser && currentUser.username !== 'cyber_guest',
        login,
        register,
        quickGuestLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
