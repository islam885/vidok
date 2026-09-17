import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  KeyRound,
  Plus,
  Sparkles,
  Tv,
  Film,
  FileVideo,
  Radio,
  Users,
  MessageSquare,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { Room } from '../types';

interface HomeViewProps {
  onJoinRoom: (id: string) => void;
  onOpenCreate: () => void;
  onOpenJoinCode: () => void;
  onOpenSearch: () => void;
  onViewAllRooms: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onJoinRoom,
  onOpenCreate,
  onOpenJoinCode,
  onOpenSearch,
  onViewAllRooms,
}) => {
  const { rooms } = useRoom();

  const totalViewers = rooms.reduce((acc, r) => acc + r.members.length, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/25 p-6 sm:p-10 shadow-2xl">
        {/* Glow ambient spots */}
        <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-cyan-300 text-xs font-bold mb-4 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Liquid Glass Rave Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-unbounded text-white tracking-tight leading-[1.15]">
            Смотри видео <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">вместе с друзьями</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-3 sm:mt-4 leading-relaxed max-w-xl">
            Синхронный просмотр YouTube, VK видео и локальных файлов в комнатах по коду.
            Живой чат, реакции и плавный iOS Liquid Glass интерфейс.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8">
            <button
              onClick={onOpenCreate}
              id="hero-create-btn"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold font-unbounded text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Создать комнату</span>
            </button>

            <button
              onClick={onOpenJoinCode}
              id="hero-join-code-btn"
              className="px-6 py-3.5 rounded-2xl glass-pill text-cyan-200 hover:text-white border border-cyan-500/30 hover:bg-cyan-500/20 font-bold font-unbounded text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Войти по коду</span>
            </button>

            <button
              onClick={onOpenSearch}
              id="hero-search-btn"
              className="px-5 py-3.5 rounded-2xl glass-pill text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Tv className="w-4 h-4 text-red-400" />
              <span>Медиатека</span>
            </button>
          </div>

          {/* Live stats strip */}
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">В эфире:</span>
              <span className="font-bold text-white font-mono">{totalViewers} зрителей</span>
            </div>

            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">Комнат:</span>
              <span className="font-bold text-white font-mono">{rooms.length} активных</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEATURE TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl glass-card p-5 border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
            <Tv className="w-5 h-5" />
          </div>
          <h3 className="font-unbounded font-bold text-sm text-white">YouTube синхрон</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Поиск клипов, lofi стримов и фестивалей с точной синхронизацией времени между всеми.
          </p>
        </div>

        <div className="rounded-3xl glass-card p-5 border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
            <Film className="w-5 h-5" />
          </div>
          <h3 className="font-unbounded font-bold text-sm text-white">VK Видео & Клипы</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Вставляйте ссылки на любимые записи и клипы из VK для совместного просмотра.
          </p>
        </div>

        <div className="rounded-3xl glass-card p-5 border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <FileVideo className="w-5 h-5" />
          </div>
          <h3 className="font-unbounded font-bold text-sm text-white">Локальные файлы</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Запускайте видео прямо из памяти iPhone, Android или ПК без загрузки на сервер.
          </p>
        </div>

        <div className="rounded-3xl glass-card p-5 border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-unbounded font-bold text-sm text-white">Чат & Реакции</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Взлетающие неоновые эмодзи, голосовой статус участников и живой текст.
          </p>
        </div>
      </div>

      {/* 3. TRENDING ROOMS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-cyan-400" />
            <h2 className="font-unbounded font-bold text-lg sm:text-xl text-white">
              Популярные тусовки прямо сейчас
            </h2>
          </div>

          <button
            onClick={onViewAllRooms}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Смотреть все ({rooms.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rooms.slice(0, 3).map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ y: -4 }}
              onClick={() => onJoinRoom(room.id)}
              className="rounded-3xl glass-card border border-white/10 hover:border-cyan-500/40 p-4 cursor-pointer group shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-3">
                <img
                  src={room.currentMedia?.thumbnailUrl || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=640'}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{room.members.length} в сети</span>
                </div>

                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                    {room.currentMedia?.type || 'Stream'}
                  </span>
                  <p className="text-xs font-semibold text-white truncate">
                    {room.currentMedia?.title || 'В эфире'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-unbounded font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {room.name}
                </h3>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-xs text-slate-400">
                  <span>Хост: {room.hostName}</span>
                  <span className="font-mono text-cyan-300 font-bold">{room.code}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
