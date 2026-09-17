import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Search,
  MessageSquare,
  ListMusic,
  Users,
  Sparkles,
  Crown,
  Radio,
} from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { MediaPlayer } from './MediaPlayer';
import { RoomChat } from './RoomChat';
import { RoomQueue } from './RoomQueue';

interface RoomViewProps {
  onBack: () => void;
  onOpenSearch: () => void;
}

export const RoomView: React.FC<RoomViewProps> = ({ onBack, onOpenSearch }) => {
  const { currentRoom, leaveRoom, isHost } = useRoom();
  const [mobileTab, setMobileTab] = useState<'chat' | 'queue'>('chat');
  const [copied, setCopied] = useState(false);

  if (!currentRoom) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold font-unbounded text-white">Вы не находитесь ни в одной комнате</h2>
        <button
          onClick={onBack}
          className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Вернуться к списку комнат
        </button>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentRoom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    leaveRoom();
    onBack();
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. ROOM HEADER */}
      <div className="rounded-3xl glass-panel p-3.5 sm:p-5 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleLeave}
            id="room-leave-btn"
            className="p-2 rounded-xl text-slate-400 hover:text-white glass-pill border border-white/10 hover:border-cyan-400/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-unbounded font-extrabold text-sm sm:text-lg text-white truncate max-w-xs sm:max-w-md">
                {currentRoom.name}
              </h1>
              {isHost && (
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold flex items-center gap-1 shrink-0">
                  <Crown className="w-3 h-3" />
                  <span>Хост</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Создатель: <span className="text-cyan-300 font-medium">{currentRoom.hostName}</span> •{' '}
              {currentRoom.members.length} участников
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Room Code Badge with 1-click Copy */}
          <button
            onClick={handleCopyCode}
            id="room-copy-code-btn"
            className="px-3 py-1.5 rounded-xl glass-pill text-xs font-mono font-bold text-cyan-300 hover:text-white hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>КОД: {currentRoom.code}</span>
          </button>

          {/* Change Media button */}
          <button
            onClick={onOpenSearch}
            id="room-open-search-btn"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold font-unbounded text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Выбрать видео</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: Media Player + Sidebar Chat/Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left column: Video Player and details (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <MediaPlayer />

          {/* Mobile Tab Switcher between Chat and Queue */}
          <div className="flex lg:hidden rounded-2xl bg-slate-900/60 p-1 border border-white/10">
            <button
              onClick={() => setMobileTab('chat')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                mobileTab === 'chat'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Чат комнаты</span>
            </button>
            <button
              onClick={() => setMobileTab('queue')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                mobileTab === 'queue'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>Очередь ({currentRoom.queue.length})</span>
            </button>
          </div>

          {/* Mobile view content */}
          <div className="block lg:hidden">
            {mobileTab === 'chat' ? (
              <div className="h-[420px]">
                <RoomChat />
              </div>
            ) : (
              <RoomQueue onOpenSearch={onOpenSearch} />
            )}
          </div>
        </div>

        {/* Right column (Desktop): Interactive Chat & Playlist (4 cols) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 h-[680px]">
          <div className="flex-1 min-h-0">
            <RoomChat />
          </div>
          <div className="shrink-0">
            <RoomQueue onOpenSearch={onOpenSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};
