import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile, Mic, MicOff, Crown, Users, Sparkles, MessageSquare } from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { useAuth } from '../context/AuthContext';

const QUICK_EMOJIS = ['🔥', '❤️', '⚡', '🎉', '🚀', '🔊', '👏', '😂'];

export const RoomChat: React.FC = () => {
  const { currentRoom, chatMessages, sendMessage, sendReaction, toggleMic } = useRoom();
  const { currentUser } = useAuth();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  const currentMember = currentRoom?.members.find((m) => m.userId === currentUser?.id);

  return (
    <div className="flex flex-col h-full rounded-3xl glass-card border border-cyan-500/20 overflow-hidden bg-slate-950/60 shadow-xl">
      {/* 1. TOP STAGE: Voice & Members presence banner */}
      <div className="p-3.5 border-b border-white/10 bg-slate-900/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 shrink-0 mr-1">
            <Users className="w-3.5 h-3.5" />
            <span>{currentRoom?.members.length || 1}</span>
          </div>

          {/* Member avatars in stage */}
          {currentRoom?.members.map((member) => (
            <div
              key={member.userId}
              title={`${member.displayName} ${member.isHost ? '(Создатель)' : ''}`}
              className="relative shrink-0 group"
            >
              <div
                style={{ borderColor: member.isSpeaking ? '#00f0ff' : 'rgba(255,255,255,0.15)' }}
                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-110 ${
                  member.isSpeaking ? 'ring-2 ring-cyan-400 shadow-md shadow-cyan-400/50 scale-105' : ''
                }`}
              >
                <img src={member.avatar} alt={member.displayName} className="w-full h-full object-cover" />
              </div>
              {member.isHost && (
                <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-amber-400 text-slate-950">
                  <Crown className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mic toggle */}
        <button
          onClick={toggleMic}
          id="chat-toggle-mic-btn"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            currentMember?.isMuted
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          {currentMember?.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 animate-pulse" />}
        </button>
      </div>

      {/* 2. CHAT MESSAGES STREAM */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
            <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-cyan-400" />
            <p className="text-xs">Начните общение в чате комнаты!</p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            if (msg.isSystem) {
              return (
                <div key={msg.id} className="flex items-center justify-center my-1.5">
                  <span className="px-3 py-1 rounded-full glass-pill text-[11px] text-cyan-300/80 border border-cyan-500/20 text-center font-medium">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isMine = currentUser && msg.userId === currentUser.id;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-2.5 items-start ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  style={{ borderColor: msg.avatarColor || '#00f0ff' }}
                  className="w-7 h-7 rounded-full overflow-hidden border shrink-0 mt-0.5 shadow-sm"
                >
                  <img src={msg.avatar} alt={msg.displayName} className="w-full h-full object-cover" />
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-0.5 px-1">
                    <span className="text-[11px] font-bold text-slate-300">{msg.displayName}</span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-sm ${
                      isMine
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none'
                        : 'glass-panel text-slate-100 rounded-tl-none border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. FLOATING REACTIONS QUICK BAR */}
      <div className="px-3 py-1.5 border-t border-white/5 bg-slate-900/40 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 shrink-0 font-unbounded">
          Реакции:
        </span>
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => sendReaction(emoji)}
            className="p-1.5 text-base hover:scale-130 active:scale-95 transition-transform shrink-0"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* 4. CHAT INPUT */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-900/80 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            id="chat-message-input"
            placeholder="Написать сообщение в комнату..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <button
          type="submit"
          id="chat-send-btn"
          disabled={!text.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-md shadow-cyan-500/25 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
};
