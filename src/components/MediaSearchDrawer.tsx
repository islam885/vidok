import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Youtube,
  Film,
  UploadCloud,
  Play,
  ListPlus,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Radio,
} from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import {
  PRESET_CATALOG,
  extractYouTubeId,
  extractVkVideoEmbed,
  detectMediaType,
  SearchResultItem,
  formatTime,
} from '../utils/mediaData';
import { MediaItem } from '../types';

interface MediaSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaSearchDrawer: React.FC<MediaSearchDrawerProps> = ({ isOpen, onClose }) => {
  const { changeMedia, addToQueue, addLocalMedia, currentRoom } = useRoom();

  const [activeTab, setActiveTab] = useState<'search' | 'local' | 'presets'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  
  // Preview item state for "проверять перед включением"
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filtered preset results
  const filteredPresets = PRESET_CATALOG.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle URL verification & preview
  const handleCheckUrl = () => {
    setFeedback(null);
    const url = inputUrl.trim();
    if (!url) return;

    const detectedType = detectMediaType(url);

    if (detectedType === 'youtube') {
      const ytId = extractYouTubeId(url);
      if (!ytId) {
        setFeedback('Не удалось распознать ID YouTube видео. Проверьте ссылку.');
        return;
      }
      setPreviewItem({
        id: 'yt_' + ytId,
        title: `YouTube Видео [${ytId}]`,
        type: 'youtube',
        url: `https://www.youtube.com/watch?v=${ytId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        duration: 300,
        author: 'YouTube',
        addedBy: 'me',
        addedByName: 'Я',
      });
    } else if (detectedType === 'vk') {
      const vkEmbed = extractVkVideoEmbed(url);
      setPreviewItem({
        id: 'vk_' + Date.now(),
        title: 'VK Видеозапись',
        type: 'vk',
        url: vkEmbed || url,
        thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=640&auto=format&fit=crop&q=80',
        duration: 240,
        author: 'VK Video',
        addedBy: 'me',
        addedByName: 'Я',
      });
    } else {
      // Direct stream or other
      setPreviewItem({
        id: 'direct_' + Date.now(),
        title: 'Прямой видеопоток (MP4 / WebM)',
        type: 'direct',
        url: url,
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=640&auto=format&fit=crop&q=80',
        duration: 600,
        author: 'Web Stream',
        addedBy: 'me',
        addedByName: 'Я',
      });
    }
  };

  const handleSelectPreset = (item: SearchResultItem) => {
    setPreviewItem({
      id: item.id,
      title: item.title,
      type: item.type,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      duration: item.duration,
      author: item.author,
      addedBy: 'me',
      addedByName: 'Я',
    });
  };

  const handlePlayNow = (item: MediaItem) => {
    changeMedia(item);
    onClose();
  };

  const handleAddToQueue = (item: MediaItem) => {
    addToQueue(item);
    setFeedback(`"${item.title.substring(0, 30)}..." добавлено в очередь!`);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Local file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const item = await addLocalMedia(file);
      onClose();
    } catch {
      setFeedback('Не удалось загрузить локальный файл');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#040812]/80 backdrop-blur-xl"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg h-full glass-panel border-l border-cyan-500/20 z-10 flex flex-col overflow-hidden shadow-2xl bg-[#080e1b]/95"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-pill text-cyan-400 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Медиатека & Поиск</span>
              </div>
              <h2 className="text-xl font-bold font-unbounded text-white">Выбор видео для комнаты</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b border-white/10 px-5 pt-3 gap-3 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('search')}
              className={`pb-3 text-xs font-bold font-unbounded border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Поиск & Ссылки</span>
            </button>

            <button
              onClick={() => setActiveTab('local')}
              className={`pb-3 text-xs font-bold font-unbounded border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'local'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Локальное видео</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`pb-3 text-xs font-bold font-unbounded border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-4 h-4 text-blue-400" />
              <span>VK & Rave Каталог</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </motion.div>
            )}

            {/* TAB 1: Search & URL insertion */}
            {activeTab === 'search' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Вставьте ссылку на видео (YouTube, VK видео или MP4 поток)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      id="media-url-input"
                      placeholder="https://www.youtube.com/watch?v=... или https://vk.com/video..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      type="button"
                      id="check-url-btn"
                      onClick={handleCheckUrl}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-unbounded shrink-0 cursor-pointer shadow-md shadow-cyan-500/25"
                    >
                      Проверить
                    </button>
                  </div>
                </div>

                {/* Live Preview Box */}
                {previewItem && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl glass-card p-4 border border-cyan-500/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        Предпросмотр перед запуском
                      </span>
                      <span className="text-xs text-slate-400">{formatTime(previewItem.duration || 0)}</span>
                    </div>

                    {/* Preview video container */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3 border border-white/10">
                      {previewItem.type === 'youtube' ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(previewItem.url)}?autoplay=0`}
                          title="Preview"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : previewItem.type === 'vk' ? (
                        <iframe
                          src={extractVkVideoEmbed(previewItem.url) || previewItem.url}
                          title="VK Preview"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video src={previewItem.url} controls className="w-full h-full object-contain" />
                      )}
                    </div>

                    <h4 className="font-semibold text-sm text-white mb-3 line-clamp-1">{previewItem.title}</h4>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayNow(previewItem)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-unbounded font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Включить в комнате</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToQueue(previewItem)}
                        className="px-4 py-2.5 rounded-xl glass-pill text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>В очередь</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Search in Catalog */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Или найдите в каталоге Rave:
                  </label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Поиск по жанру, автору или названию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredPresets.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl glass-card hover:border-cyan-500/40 transition-colors cursor-pointer group"
                        onClick={() => handleSelectPreset(item)}
                      >
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-16 h-12 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold text-white truncate group-hover:text-cyan-300">
                            {item.title}
                          </h5>
                          <p className="text-[11px] text-slate-400">{item.author}</p>
                          <span className="text-[10px] text-cyan-400 font-medium">{item.category}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayNow({
                              id: item.id,
                              title: item.title,
                              type: item.type,
                              url: item.url,
                              thumbnailUrl: item.thumbnailUrl,
                              duration: item.duration,
                              author: item.author,
                              addedBy: 'me',
                              addedByName: 'Я',
                            });
                          }}
                          className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Local Video Upload */}
            {activeTab === 'local' && (
              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-dashed border-cyan-500/30 p-8 text-center bg-slate-950/40 hover:border-cyan-400/60 transition-colors">
                  <div className="w-16 h-16 rounded-2xl glass-panel mx-auto flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/20">
                    <FileVideo className="w-8 h-8" />
                  </div>
                  <h3 className="font-unbounded font-bold text-sm text-white mb-1">
                    Выберите файл с устройства
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                    Поддерживаются MP4, WebM, MKV, MP3 на iPhone, Android и ПК. Видео будет проигрываться напрямую в плеере.
                  </p>

                  <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-unbounded font-bold text-xs shadow-lg shadow-cyan-500/25 cursor-pointer transition-transform active:scale-95">
                    <UploadCloud className="w-4 h-4" />
                    <span>Выбрать видеофайл</span>
                    <input
                      type="file"
                      accept="video/*,audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-4 rounded-xl glass-card text-xs text-slate-400 space-y-2 border border-white/5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Как это работает:</span>
                  </div>
                  <p>
                    Файл считывается локально в высоком качестве (1080p / 4K) через защищенный Blob URL.
                    Синхронизация паузы, перемотки и звука транслируется всем участникам комнаты в реальном времени.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: VK & Curated Presets */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-semibold mb-2">
                  Подборка контента для совместных рейв-сессий:
                </div>
                {PRESET_CATALOG.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl glass-card flex items-center justify-between gap-3 border border-white/10 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-16 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-cyan-400 font-semibold">{item.category}</span>
                          <span className="text-[10px] text-slate-500">•</span>
                          <span className="text-[10px] text-slate-400">{formatTime(item.duration)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleSelectPreset(item)}
                        className="px-2.5 py-1.5 rounded-lg glass-pill text-slate-300 hover:text-white text-xs"
                      >
                        Тест
                      </button>
                      <button
                        onClick={() =>
                          handlePlayNow({
                            id: item.id,
                            title: item.title,
                            type: item.type,
                            url: item.url,
                            thumbnailUrl: item.thumbnailUrl,
                            duration: item.duration,
                            author: item.author,
                            addedBy: 'me',
                            addedByName: 'Я',
                          })
                        }
                        className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
