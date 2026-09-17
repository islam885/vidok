import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound, ArrowRight, Clipboard, Sparkles } from 'lucide-react';
import { useRoom } from '../context/RoomContext';

interface JoinCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: () => void;
}

export const JoinCodeModal: React.FC<JoinCodeModalProps> = ({ isOpen, onClose, onJoined }) => {
  const { joinRoomByCode, rooms } = useRoom();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError('Введите код комнаты');
      return;
    }

    const success = joinRoomByCode(code);
    if (success) {
      onJoined();
      onClose();
    } else {
      setError(`Комната с кодом "${code.toUpperCase()}" не найдена. Проверьте код или выберите из списка активных.`);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text.trim());
      }
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#040812]/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 z-10 border border-cyan-500/20 shadow-2xl shadow-cyan-950/50"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />

          <button
            onClick={onClose}
            id="close-join-code-btn"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-cyan-400 text-xs font-semibold mb-3">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Подключение к просмотру</span>
            </div>
            <h2 className="text-2xl font-bold font-unbounded tracking-tight text-white">
              Вход по коду
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Введите код комнаты от друга или выберите открытую комнату
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Код комнаты (например: RAVE-CYBER)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  id="room-code-input"
                  autoFocus
                  placeholder="RAVE-XXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full text-center font-unbounded text-lg tracking-widest uppercase bg-slate-900/80 border-2 border-cyan-500/30 rounded-2xl py-3 px-12 text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 shadow-inner"
                />
                <button
                  type="button"
                  id="paste-code-btn"
                  onClick={handlePaste}
                  title="Вставить из буфера"
                  className="absolute right-3 p-2 rounded-xl text-slate-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Clipboard className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="submit-join-code-btn"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-unbounded font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Присоединиться к комнате</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick recommendations */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Популярные открытые комнаты:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rooms.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setCode(r.code);
                    joinRoomByCode(r.code);
                    onJoined();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg glass-pill text-xs text-cyan-200 hover:text-white hover:bg-cyan-500/20 border border-cyan-500/20 transition-all"
                >
                  {r.code} • {r.members.length} в сети
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
