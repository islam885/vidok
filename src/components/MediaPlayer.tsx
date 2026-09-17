import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Sparkles,
  Tv,
  Film,
  FileVideo,
  Radio,
  Sliders,
} from 'lucide-react';
import { useRoom } from '../context/RoomContext';
import { extractYouTubeId, extractVkVideoEmbed, formatTime } from '../utils/mediaData';

export const MediaPlayer: React.FC = () => {
  const {
    currentRoom,
    playbackState,
    floatingReactions,
    togglePlay,
    seekTo,
    setSpeed,
    syncWithHost,
    isHost,
  } = useRoom();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const media = currentRoom?.currentMedia;
  const youtubeId = media?.type === 'youtube' ? extractYouTubeId(media.url) : null;
  const vkEmbedUrl = media?.type === 'vk' ? extractVkVideoEmbed(media.url) : null;

  // Sync HTML5 video element with playbackState
  useEffect(() => {
    if (!videoRef.current || (media?.type !== 'local' && media?.type !== 'direct')) return;

    const vid = videoRef.current;
    if (playbackState.isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }

    // If drift is greater than 1.5 seconds, seek
    if (Math.abs(vid.currentTime - playbackState.currentTime) > 1.5) {
      vid.currentTime = playbackState.currentTime;
    }

    vid.playbackRate = playbackState.speed;
  }, [playbackState.isPlaying, playbackState.speed, playbackState.currentTime, media?.type]);

  // Volume handler for HTML5 video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (playbackState.isPlaying) {
        setShowControls(false);
      }
    }, 3200);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    seekTo(target);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const duration = media?.duration || 3600;
  const progressPercent = Math.min(100, (playbackState.currentTime / duration) * 100);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video rounded-3xl overflow-hidden glass-card border border-cyan-500/20 bg-black shadow-2xl group select-none"
    >
      {/* 1. MEDIA CONTENT LAYER */}
      {media ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* YouTube Embed */}
          {media.type === 'youtube' && (
            <iframe
              key={youtubeId || media.url}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId || 'jfKfPfyJRdk'}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1`}
              title={media.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}

          {/* VK Video Embed */}
          {media.type === 'vk' && (
            <div className="w-full h-full relative">
              <iframe
                src={vkEmbedUrl || 'https://vk.com/video_ext.php?oid=-22822305&id=456241123&hd=2&autoplay=1'}
                title={media.title}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}

          {/* Local File or Direct MP4 Stream */}
          {(media.type === 'local' || media.type === 'direct') && (
            <video
              ref={videoRef}
              src={media.blobUrl || media.url}
              playsInline
              onClick={togglePlay}
              onEnded={() => seekTo(0)}
              className="w-full h-full object-contain cursor-pointer"
            />
          )}
        </div>
      ) : (
        /* Empty state placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 via-[#060a14] to-black">
          <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center text-cyan-400 mb-3 glow-cyan">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="font-unbounded font-bold text-lg text-white">В комнате пока ничего не играет</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-1">
            Выберите видео из YouTube, вставьте ссылку VK видео или откройте локальный файл с устройства
          </p>
        </div>
      )}

      {/* 2. FLOATING REACTIONS OVERLAY */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
        <AnimatePresence>
          {floatingReactions.map((react) => (
            <motion.div
              key={react.id}
              initial={{ opacity: 0, y: 300, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: -120,
                scale: [0.5, 1.3, 1.1, 1.4],
                x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.2, ease: 'easeOut' }}
              style={{ left: `${react.x}%` }}
              className="absolute bottom-8 flex flex-col items-center drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]"
            >
              <span className="text-4xl select-none">{react.emoji}</span>
              <span className="text-[10px] font-bold text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded-full mt-1 border border-cyan-500/30">
                {react.senderName}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. TOP INFO BAR OVERLAY */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-3 z-20 pointer-events-auto"
          >
            {/* Media details badge */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="px-2.5 py-1 rounded-xl glass-pill flex items-center gap-1.5 text-xs font-bold shrink-0 border border-white/10 text-cyan-300">
                {media?.type === 'youtube' && <Tv className="w-3.5 h-3.5 text-red-500" />}
                {media?.type === 'vk' && <Film className="w-3.5 h-3.5 text-blue-500" />}
                {media?.type === 'local' && <FileVideo className="w-3.5 h-3.5 text-emerald-400" />}
                {media?.type === 'direct' && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="uppercase tracking-wider text-[10px]">
                  {media?.type === 'youtube'
                    ? 'YouTube'
                    : media?.type === 'vk'
                    ? 'VK Видео'
                    : media?.type === 'local'
                    ? 'Локально'
                    : 'Stream'}
                </span>
              </div>

              <div className="truncate">
                <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {media?.title || 'Ожидание запуска'}
                </h4>
                {media?.addedByName && (
                  <p className="text-[10px] text-slate-400">
                    Добавил: <span className="text-cyan-300 font-medium">{media.addedByName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Sync button and Room Live badge */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={syncWithHost}
                title="Синхронизировать с хостом"
                id="player-sync-host-btn"
                className="px-2.5 py-1 rounded-xl glass-pill text-[11px] font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 flex items-center gap-1 border border-cyan-500/30 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Синхрон</span>
              </button>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
                <span>LIVE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. BOTTOM OVERLAY / CONTROLS (Always visible for Local & Direct streams, and hoverable for embeds) */}
      {(media?.type === 'local' || media?.type === 'direct') && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2 z-20 pointer-events-auto"
            >
              {/* Progress bar */}
              <div className="relative flex items-center group/scrub">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={1}
                  value={playbackState.currentTime}
                  onChange={handleSeek}
                  id="media-progress-slider"
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2.5 transition-all"
                />
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg pointer-events-none group-hover/scrub:h-2.5 transition-all"
                />
              </div>

              {/* Controls bar */}
              <div className="flex items-center justify-between gap-3 text-white">
                {/* Left: Play/Pause and Time */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    id="player-toggle-play-btn"
                    className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-transform active:scale-95 shadow-md shadow-cyan-500/30"
                  >
                    {playbackState.isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="text-xs font-mono text-slate-300">
                    <span className="text-white font-semibold">{formatTime(playbackState.currentTime)}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-slate-400">{formatTime(duration)}</span>
                  </div>

                  {/* Volume */}
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-16 h-1 bg-white/20 rounded appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Right: Speed, Theater, Fullscreen */}
                <div className="flex items-center gap-2">
                  {/* Speed selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="px-2 py-1 rounded-lg glass-pill text-xs font-mono text-slate-300 hover:text-white border border-white/10 flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{playbackState.speed}x</span>
                    </button>

                    {showSpeedMenu && (
                      <div className="absolute bottom-full right-0 mb-2 p-1.5 rounded-xl glass-panel border border-white/15 shadow-xl flex flex-col gap-1 min-w-[70px]">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setSpeed(s);
                              setShowSpeedMenu(false);
                            }}
                            className={`px-2 py-1 text-xs rounded-lg text-left transition-colors ${
                              playbackState.speed === s
                                ? 'bg-cyan-500 text-slate-950 font-bold'
                                : 'text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    id="player-fullscreen-btn"
                    className="p-1.5 rounded-lg glass-pill text-slate-300 hover:text-white transition-colors"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
