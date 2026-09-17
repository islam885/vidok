import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Shuffle, Lock, Globe, Sparkles } from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { generateRoomCode } from '../utils/mediaData';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { createRoom } = useRoom();
  const [name, setName] = useState('');
  const [code, setCode] = useState(generateRoomCode());
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    setCode(generateRoomCode());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createRoom(name, isPrivate, code);
    onCreated();
    onClose();
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
            id="close-create-room-btn"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Создание тусовки</span>
            </div>
            <h2 className="text-2xl font-bold font-unbounded tracking-tight text-white">
              Новая комната
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Запустите трансляцию для друзей по уникальному коду
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Название комнаты
              </label>
              <input
                type="text"
                id="create-room-name-input"
                required
                placeholder="Ночной просмотр клипов & YouTube"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Код для подключения
                </label>
                <button
                  type="button"
                  id="regenerate-code-btn"
                  onClick={handleRegenerateCode}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Сгенерировать другой</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="create-room-code-input"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full font-unbounded text-center tracking-widest text-base font-bold bg-slate-900/80 border border-cyan-500/30 rounded-xl py-2.5 px-4 text-cyan-300 uppercase focus:outline-none focus:border-cyan-400"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Друзья смогут присоединиться к комнате, введя этот код
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Доступность
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="privacy-public-btn"
                  onClick={() => setIsPrivate(false)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                    !isPrivate
                      ? 'border-cyan-400 bg-cyan-500/10 text-white shadow-sm'
                      : 'border-white/5 bg-slate-900/40 text-slate-400 hover:bg-slate-900/70'
                  }`}
                >
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Открытая</div>
                    <div className="text-[10px] text-slate-400">В списке комнат</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="privacy-private-btn"
                  onClick={() => setIsPrivate(true)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                    isPrivate
                      ? 'border-cyan-400 bg-cyan-500/10 text-white shadow-sm'
                      : 'border-white/5 bg-slate-900/40 text-slate-400 hover:bg-slate-900/70'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Приватная</div>
                    <div className="text-[10px] text-slate-400">Только по коду</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="submit-create-room-btn"
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-unbounded font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Создать и войти</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
