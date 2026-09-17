import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Tv,
  Film,
  KeyRound,
  Sparkles,
  Search,
  Plus,
  Play,
  Copy,
  Check,
  Globe,
  Lock,
} from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { Room } from '../types';

interface RoomsListProps {
  onJoinRoom: (id: string) => void;
  onOpenCreate: () => void;
  onOpenJoinCode: () => void;
}

export const RoomsList: React.FC<RoomsListProps> = ({ onJoinRoom, onOpenCreate, onOpenJoinCode }) => {
  const { rooms } = useRoom();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('Все');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const tags = ['Все', 'YouTube', 'VK Video', 'EDM', 'Synthwave', '4K'];

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.hostName.toLowerCase().includes(search.toLowerCase());

    const matchesTag =
      selectedTag === 'Все' ||
      r.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase()) ||
      (selectedTag === 'YouTube' && r.currentMedia?.type === 'youtube') ||
      (selectedTag === 'VK Video' && r.currentMedia?.type === 'vk');

    return matchesSearch && matchesTag;
  });

  const handleCopyCode = (room: Room, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(room.code);
    setCopiedCodeId(room.id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Комнаты для совместного просмотра</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-unbounded text-white tracking-tight">
            Открытые тусовки
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Подключайтесь к трансляциям других пользователей или заходите по секретному коду
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenJoinCode}
            className="px-4 py-2.5 rounded-xl glass-pill text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold font-unbounded flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Войти по коду</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold font-unbounded text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Создать свою</span>
          </button>
        </div>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по названию или коду..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Tag chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full no-scrollbar pb-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'glass-pill text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-3xl glass-card border border-white/5">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-unbounded font-bold text-white text-base">Комнаты не найдены</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Попробуйте изменить параметры поиска или создайте свою первую комнату!
            </p>
            <button
              onClick={onOpenCreate}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Создать комнату
            </button>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const media = room.currentMedia;
            const isCopied = copiedCodeId === room.id;

            return (
              <motion.div
                key={room.id}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onClick={() => onJoinRoom(room.id)}
                className="rounded-3xl glass-card border border-white/10 hover:border-cyan-500/40 p-4 flex flex-col justify-between cursor-pointer group shadow-xl transition-all"
              >
                {/* Room Preview Thumbnail */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-3.5">
                  <img
                    src={
                      media?.thumbnailUrl ||
                      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=640'
                    }
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-transparent to-black/40" />

                  {/* Top Left: Media Type & Privacy */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg glass-panel text-[10px] font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      {media?.type === 'youtube' && <Tv className="w-3 h-3 text-red-500" />}
                      {media?.type === 'vk' && <Film className="w-3 h-3 text-blue-500" />}
                      {media?.type === 'local' && <Sparkles className="w-3 h-3 text-emerald-400" />}
                      <span className="uppercase">
                        {media?.type === 'youtube'
                          ? 'YouTube'
                          : media?.type === 'vk'
                          ? 'VK'
                          : 'Stream'}
                      </span>
                    </span>

                    {room.isPrivate && (
                      <span className="px-1.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Top Right: Viewers Count */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{room.members.length} в сети</span>
                  </div>

                  {/* Center Play Button Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom: Current video title */}
                  <div className="absolute bottom-2 inset-x-2.5">
                    <p className="text-[11px] font-semibold text-slate-200 truncate">
                      {media?.title || 'Ожидание видео'}
                    </p>
                  </div>
                </div>

                {/* Room Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-unbounded font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {room.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{room.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Bar: Host & Room Code */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-500/30 shrink-0">
                        <img
                          src={
                            room.members[0]?.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-slate-300 truncate max-w-[90px]">
                        {room.hostName}
                      </span>
                    </div>

                    {/* Code button */}
                    <button
                      onClick={(e) => handleCopyCode(room, e)}
                      title="Скопировать код для друзей"
                      className="px-2.5 py-1 rounded-xl glass-pill text-[10px] font-mono font-bold text-cyan-300 hover:text-white border border-cyan-500/30 flex items-center gap-1 transition-all"
                    >
                      {isCopied ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{room.code}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
