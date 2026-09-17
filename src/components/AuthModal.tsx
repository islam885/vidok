import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useAuth, AVATAR_PRESETS, NEON_COLORS } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, quickGuestLogin } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  
  // Form states
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [selectedColor, setSelectedColor] = useState(NEON_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isLoginMode) {
      const res = await login(loginInput, password);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Ошибка входа');
      }
    } else {
      const res = await register({
        username: loginInput,
        email,
        password,
        displayName: displayName || loginInput,
        avatar: selectedAvatar,
        avatarColor: selectedColor,
      });
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Ошибка регистрации');
      }
    }
  };

  const handleGuest = () => {
    quickGuestLogin();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop with strong blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#040812]/80 backdrop-blur-xl"
        />

        {/* Modal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 z-10 border border-cyan-500/20 shadow-2xl shadow-cyan-950/50"
        >
          {/* Glowing gradient background accents */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            id="close-auth-modal-btn"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rave ID System</span>
            </div>
            <h2 className="text-2xl font-bold font-unbounded tracking-tight text-white">
              {isLoginMode ? 'Вход в аккаунт' : 'Регистрация'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {isLoginMode
                ? 'Войдите, чтобы создавать и сохранять комнаты'
                : 'Создайте профиль и смотрите видео вместе с друзьями'}
            </p>
          </div>

          {/* Mode switch pills */}
          <div className="flex rounded-2xl bg-slate-900/60 p-1.5 mb-6 border border-white/5">
            <button
              type="button"
              id="switch-to-login-btn"
              onClick={() => {
                setIsLoginMode(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                isLoginMode
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              id="switch-to-register-btn"
              onClick={() => {
                setIsLoginMode(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                !isLoginMode
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Регистрация
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Login / Username field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isLoginMode ? 'Логин или Email' : 'Логин (никнейм)'}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  id="auth-login-input"
                  required
                  placeholder={isLoginMode ? 'alex_rave или rave@party.io' : 'dj_cyberpunk'}
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Email field for registration */}
            {!isLoginMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Электронная почта
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    id="auth-email-input"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* Display name for registration */}
            {!isLoginMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Отображаемое имя (необязательно)
                </label>
                <input
                  type="text"
                  id="auth-display-name-input"
                  placeholder="Alex Night"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  id="auth-password-input"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Avatar & Neon selection for registration */}
            {!isLoginMode && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Выберите аватар и неоновый цвет
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 transition-transform ${
                        selectedAvatar === avatar
                          ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/50'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                      {selectedAvatar === avatar && (
                        <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {NEON_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        selectedColor === color ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              id="auth-submit-btn"
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-unbounded font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Обработка...' : isLoginMode ? 'Войти в Rave' : 'Зарегистрироваться'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick guest action */}
          <div className="mt-5 pt-4 border-t border-white/5 text-center">
            <button
              type="button"
              id="auth-guest-btn"
              onClick={handleGuest}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors underline underline-offset-4"
            >
              Продолжить как гость (быстрый вход)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
