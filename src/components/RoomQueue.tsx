import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListMusic, Play, Trash2, Plus, Disc3 } from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { formatTime } from '../utils/mediaData';

interface RoomQueueProps {
  onOpenSearch: () => void;
}

export const RoomQueue: React.FC<RoomQueueProps> = ({ onOpenSearch }) => {
  const { currentRoom, removeFromQueue, playNextInQueue } = useRoom();

  const currentMedia = currentRoom?.currentMedia;
  const queue = currentRoom?.queue || [];

  return (
    <div className="rounded-3xl glass-card border border-cyan-500/20 p-4 bg-slate-950/60 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-cyan-400" />
          <h3 className="font-unbounded font-bold text-xs text-white">Очередь воспроизведения</h3>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
            {queue.length}
          </span>
        </div>

        <button
          onClick={onOpenSearch}
          className="px-2.5 py-1 rounded-xl glass-pill text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Добавить</span>
        </button>
      </div>

      {/* Currently Playing Card */}
      {currentMedia && (
        <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3">
          <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
            {currentMedia.thumbnailUrl ? (
              <img src={currentMedia.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
              Сейчас играет
            </span>
            <h4 className="text-xs font-bold text-white truncate">{currentMedia.title}</h4>
            <p className="text-[10px] text-slate-400 truncate">
              {currentMedia.author || currentMedia.addedByName}
            </p>
          </div>
        </div>
      )}

      {/* Queue items */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {queue.length === 0 ? (
          <div className="text-center py-4 text-slate-500 text-xs">
            Очередь пуста. Добавьте следующие видео для просмотра вместе!
          </div>
        ) : (
          queue.map((item, index) => (
            <motion.div
              key={item.id + index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="p-2 rounded-xl glass-panel border border-white/5 flex items-center justify-between gap-2 group hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-mono font-bold text-slate-500 w-4 text-center">
                  {index + 1}
                </span>
                <img
                  src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=120'}
                  alt=""
                  className="w-10 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h5 className="text-xs font-semibold text-white truncate group-hover:text-cyan-300">
                    {item.title}
                  </h5>
                  <span className="text-[10px] text-slate-400">{formatTime(item.duration || 0)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {index === 0 && (
                  <button
                    onClick={playNextInQueue}
                    title="Включить сейчас"
                    className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                )}
                <button
                  onClick={() => removeFromQueue(item.id)}
                  title="Удалить из очереди"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
