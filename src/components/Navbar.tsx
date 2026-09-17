import React from 'react';
import {
  Sparkles,
  KeyRound,
  Plus,
  Tv,
  Compass,
  Layers,
  Search,
  User as UserIcon,
  LogOut,
  Radio,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenJoinCode: () => void;
  onOpenCreateRoom: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenJoinCode,
  onOpenCreateRoom,
  onOpenSearch,
}) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { currentRoom, leaveRoom } = useRoom();
  const [copiedCode, setCopiedCode] = React.useState(false);

  const handleCopyCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <>
      {/* 1. TOP DESKTOP & MOBILE HEADER */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl glass-panel p-2.5 sm:px-5 flex items-center justify-between gap-3 border border-cyan-500/20 shadow-xl shadow-black/40">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#060a12] rounded-[10px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-unbounded font-black text-base sm:text-lg tracking-wider text-white">
                  RAVE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold tracking-wide hidden sm:block">
                СИНХРОННЫЙ ПРОСМОТР
              </p>
            </div>
          </div>

          {/* Active Room Pill (if in a room) */}
          {currentRoom && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <div className="text-xs">
                <span className="text-slate-400 hidden sm:inline">В комнате: </span>
                <button
                  onClick={() => setActiveTab('room')}
                  className="font-bold text-cyan-300 hover:underline max-w-[120px] sm:max-w-[180px] truncate inline-block align-bottom"
                >
                  {currentRoom.name}
                </button>
              </div>

              {/* Copy Code button */}
              <button
                onClick={handleCopyCode}
                title="Скопировать код комнаты"
                className="ml-1 px-2 py-0.5 rounded-lg glass-pill text-[10px] font-mono text-cyan-200 hover:text-white border border-cyan-500/30 flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{currentRoom.code}</span>
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Join by Code Button */}
            <button
              onClick={onOpenJoinCode}
              id="nav-join-code-btn"
              className="px-3 py-2 rounded-xl glass-pill text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ввести код</span>
            </button>

            {/* Create Room Button */}
            <button
              onClick={onOpenCreateRoom}
              id="nav-create-room-btn"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-unbounded font-bold text-xs shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Создать комнату</span>
            </button>

            {/* User Profile Pill */}
            {currentUser ? (
              <div
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl glass-pill border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-colors"
              >
                <div
                  style={{ borderColor: currentUser.avatarColor || '#00f0ff' }}
                  className="w-7 h-7 rounded-full overflow-hidden border shadow-sm shrink-0"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white truncate max-w-[100px]">
                    {currentUser.displayName}
                  </div>
                  <div className="text-[10px] text-cyan-400">
                    {isAuthenticated ? 'Rave ID' : 'Гость'}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-2 rounded-xl glass-pill text-xs font-semibold text-white hover:border-cyan-400 transition-colors"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. BOTTOM FLOATING DOCK BAR (Optimized for iOS / iPhone & Android touch navigation) */}
      <nav className="fixed bottom-3 inset-x-0 z-40 px-4 flex justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]">
        <div className="pointer-events-auto rounded-3xl glass-panel p-2 flex items-center gap-1 sm:gap-3 border border-cyan-500/25 shadow-2xl shadow-cyan-950/60 bg-[#070e1e]/90 backdrop-blur-2xl">
          <button
            onClick={() => setActiveTab('home')}
            id="tab-home-btn"
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px]">Главная</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            id="tab-rooms-btn"
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === 'rooms'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px]">Комнаты</span>
          </button>

          {currentRoom && (
            <button
              onClick={() => setActiveTab('room')}
              id="tab-live-room-btn"
              className={`px-4 py-2 rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 transition-all relative ${
                activeTab === 'room'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-cyan-300 hover:text-white bg-cyan-500/10 border border-cyan-500/30'
              }`}
            >
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <Tv className="w-4 h-4" />
              <span className="text-[10px]">Плеер</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            id="tab-search-btn"
            className="px-3.5 py-2 rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-all"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px]">Медиа</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            id="tab-profile-btn"
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span className="text-[10px]">Профиль</span>
          </button>
        </div>
      </nav>
    </>
  );
};
