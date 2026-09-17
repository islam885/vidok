import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Sparkles,
  LogOut,
  Save,
  Check,
  KeyRound,
  Tv,
} from 'lucide-react';
import { useAuth, AVATAR_PRESETS, NEON_COLORS } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';

interface UserProfileViewProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onOpenAuth }) => {
  const { currentUser, updateProfile, logout, isAuthenticated } = useAuth();
  const { rooms } = useRoom();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0]);
  const [selectedColor, setSelectedColor] = useState(currentUser?.avatarColor || NEON_COLORS[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim() || currentUser.username,
      bio: bio.trim(),
      avatar: selectedAvatar,
      avatarColor: selectedColor,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Profile Banner Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with selected neon glow */}
          <div
            style={{
              borderColor: selectedColor,
              boxShadow: `0 0 25px ${selectedColor}50`,
            }}
            className="w-24 h-24 rounded-3xl overflow-hidden border-2 shrink-0 p-0.5 bg-slate-950"
          >
            <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover rounded-[22px]" />
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold font-unbounded text-white truncate">
                {currentUser.displayName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                {isAuthenticated ? 'Rave ID' : 'Гостевой профиль'}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono">@{currentUser.username} • {currentUser.email}</p>
            <p className="text-xs text-slate-300 mt-2">{currentUser.bio || 'Люблю совместные видео тусовки ⚡'}</p>

            {/* Quick auth action if guest */}
            {!isAuthenticated && (
              <div className="mt-4 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-3">
                <div className="text-xs text-cyan-200">
                  Сохраните профиль и создавайте постоянные комнаты
                </div>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                >
                  Регистрация
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="rounded-3xl glass-card p-6 border border-white/10 space-y-5">
        <h3 className="font-unbounded font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Настройки профиля и внешнего вида</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Отображаемое имя
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Статус / О себе
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Короткий статус..."
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Аватар
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
              {AVATAR_PRESETS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 transition-transform ${
                    selectedAvatar === avatar
                      ? 'border-cyan-400 scale-110 shadow-lg shadow-cyan-500/40'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Неоновый цвет ауры
            </label>
            <div className="flex items-center gap-3">
              {NEON_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-unbounded font-bold text-xs shadow-md shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Сохранено!' : 'Сохранить изменения'}</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl glass-pill text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Выйти</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
