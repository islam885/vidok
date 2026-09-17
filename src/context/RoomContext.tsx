import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Room, MediaItem, ChatMessage, FloatingReaction, RoomMember, PlaybackState } from '../types';
import { useAuth } from './AuthContext';
import { PRESET_CATALOG, generateRoomCode } from '../utils/mediaData';

interface RoomContextType {
  rooms: Room[];
  currentRoom: Room | null;
  playbackState: PlaybackState;
  chatMessages: ChatMessage[];
  floatingReactions: FloatingReaction[];
  isHost: boolean;
  joinRoomByCode: (code: string) => boolean;
  joinRoomById: (id: string) => void;
  leaveRoom: () => void;
  createRoom: (name: string, isPrivate: boolean, customCode?: string) => Room;
  changeMedia: (media: MediaItem) => void;
  addToQueue: (media: MediaItem) => void;
  removeFromQueue: (id: string) => void;
  playNextInQueue: () => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setSpeed: (speed: number) => void;
  sendMessage: (text: string) => void;
  sendReaction: (emoji: string) => void;
  toggleMic: () => void;
  addLocalMedia: (file: File) => Promise<MediaItem>;
  syncWithHost: () => void;
}

const STORAGE_KEY_ROOMS = 'rave_rooms_storage';

const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-rave-1',
    code: 'RAVE-CYBER',
    name: 'Cyberpunk & Synthwave Neon Lounge',
    description: 'Ночной чилл, неоновые биты и синхронный просмотр под неоновое свечение.',
    hostId: 'host_neon',
    hostName: 'NeonDrifter',
    isPrivate: false,
    createdAt: Date.now() - 3600000,
    currentMedia: {
      id: PRESET_CATALOG[0].id,
      title: PRESET_CATALOG[0].title,
      type: PRESET_CATALOG[0].type,
      url: PRESET_CATALOG[0].url,
      thumbnailUrl: PRESET_CATALOG[0].thumbnailUrl,
      duration: PRESET_CATALOG[0].duration,
      author: PRESET_CATALOG[0].author,
      addedBy: 'host_neon',
      addedByName: 'NeonDrifter',
    },
    playbackState: {
      isPlaying: true,
      currentTime: 142,
      updatedAt: Date.now(),
      speed: 1,
    },
    queue: [
      {
        id: PRESET_CATALOG[3].id,
        title: PRESET_CATALOG[3].title,
        type: PRESET_CATALOG[3].type,
        url: PRESET_CATALOG[3].url,
        thumbnailUrl: PRESET_CATALOG[3].thumbnailUrl,
        duration: PRESET_CATALOG[3].duration,
        author: PRESET_CATALOG[3].author,
        addedBy: 'host_neon',
        addedByName: 'NeonDrifter',
      },
    ],
    members: [
      {
        userId: 'host_neon',
        username: 'neondrifter',
        displayName: 'NeonDrifter',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        avatarColor: '#00f0ff',
        isHost: true,
        isSpeaking: false,
        isMuted: false,
        joinedAt: Date.now() - 3600000,
      },
      {
        userId: 'alex_99',
        username: 'alex_glow',
        displayName: 'Alex Glow',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        avatarColor: '#3b82f6',
        isHost: false,
        isSpeaking: true,
        isMuted: false,
        joinedAt: Date.now() - 1800000,
      },
      {
        userId: 'valeria_rave',
        username: 'valeria_r',
        displayName: 'Valeria R.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        avatarColor: '#ec4899',
        isHost: false,
        isSpeaking: false,
        isMuted: true,
        joinedAt: Date.now() - 900000,
      },
    ],
    tags: ['Synthwave', 'YouTube', '4K', 'Liquid Glass'],
  },
  {
    id: 'room-rave-2',
    code: 'RAVE-VK99',
    name: 'VK Видео & Клипы Пати',
    description: 'Смотрим клипы и концерты из VK Видео вместе с друзьями!',
    hostId: 'host_vk',
    hostName: 'VK DJ Alex',
    isPrivate: false,
    createdAt: Date.now() - 7200000,
    currentMedia: {
      id: PRESET_CATALOG[4].id,
      title: PRESET_CATALOG[4].title,
      type: PRESET_CATALOG[4].type,
      url: PRESET_CATALOG[4].url,
      thumbnailUrl: PRESET_CATALOG[4].thumbnailUrl,
      duration: PRESET_CATALOG[4].duration,
      author: PRESET_CATALOG[4].author,
      addedBy: 'host_vk',
      addedByName: 'VK DJ Alex',
    },
    playbackState: {
      isPlaying: true,
      currentTime: 65,
      updatedAt: Date.now(),
      speed: 1,
    },
    queue: [],
    members: [
      {
        userId: 'host_vk',
        username: 'vk_dj_alex',
        displayName: 'VK DJ Alex',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        avatarColor: '#0077ff',
        isHost: true,
        isSpeaking: false,
        isMuted: false,
        joinedAt: Date.now() - 7200000,
      },
    ],
    tags: ['VK Video', 'Clips', 'Hit 2026'],
  },
  {
    id: 'room-rave-3',
    code: 'RAVE-EDM',
    name: 'Tomorrowland & Ultra Rave Stage',
    description: 'Масштабный фестивальный стрим, глубокие басы и световое шоу.',
    hostId: 'host_festival',
    hostName: 'BeatMaster',
    isPrivate: false,
    createdAt: Date.now() - 10000000,
    currentMedia: {
      id: PRESET_CATALOG[2].id,
      title: PRESET_CATALOG[2].title,
      type: PRESET_CATALOG[2].type,
      url: PRESET_CATALOG[2].url,
      thumbnailUrl: PRESET_CATALOG[2].thumbnailUrl,
      duration: PRESET_CATALOG[2].duration,
      author: PRESET_CATALOG[2].author,
      addedBy: 'host_festival',
      addedByName: 'BeatMaster',
    },
    playbackState: {
      isPlaying: true,
      currentTime: 310,
      updatedAt: Date.now(),
      speed: 1,
    },
    queue: [],
    members: [
      {
        userId: 'host_festival',
        username: 'beatmaster',
        displayName: 'BeatMaster',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        avatarColor: '#10b981',
        isHost: true,
        isSpeaking: false,
        isMuted: false,
        joinedAt: Date.now() - 10000000,
      },
    ],
    tags: ['EDM', 'Tomorrowland', 'Festival'],
  },
];

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROOMS);
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Current active room
  const currentRoom = rooms.find((r) => r.id === currentRoomId) || null;

  // Local copy of playback state for smooth ticking
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    updatedAt: Date.now(),
    speed: 1,
  });

  const isHost = currentRoom && currentUser ? currentRoom.hostId === currentUser.id : false;

  // Save rooms to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    } catch (e) {
      console.warn('Failed to save rooms', e);
    }
  }, [rooms]);

  // Sync playback state when current room changes
  useEffect(() => {
    if (currentRoom) {
      setPlaybackState(currentRoom.playbackState);
    }
  }, [currentRoomId]);

  // Setup BroadcastChannel for multi-tab sync
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('rave_multi_sync_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'ROOM_PLAYBACK' && payload.roomId === currentRoomId) {
          setPlaybackState(payload.playbackState);
          setRooms((prev) =>
            prev.map((r) => (r.id === payload.roomId ? { ...r, playbackState: payload.playbackState } : r))
          );
        } else if (type === 'ROOM_MEDIA' && payload.roomId === currentRoomId) {
          setRooms((prev) =>
            prev.map((r) => (r.id === payload.roomId ? { ...r, currentMedia: payload.media, playbackState: payload.playbackState } : r))
          );
          setPlaybackState(payload.playbackState);
        } else if (type === 'CHAT_MSG' && payload.roomId === currentRoomId) {
          setChatMessages((prev) => [...prev, payload.message]);
        } else if (type === 'REACTION' && payload.roomId === currentRoomId) {
          setFloatingReactions((prev) => [...prev, payload.reaction]);
        } else if (type === 'ROOM_LIST_UPDATE') {
          setRooms(payload.rooms);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [currentRoomId]);

  // Timer for smooth video playback time increment
  useEffect(() => {
    if (!playbackState.isPlaying) return;

    const interval = setInterval(() => {
      setPlaybackState((prev) => {
        if (!prev.isPlaying) return prev;
        const maxDuration = currentRoom?.currentMedia?.duration || 3600;
        const nextTime = prev.currentTime + 1 * prev.speed;
        if (nextTime >= maxDuration) {
          return { ...prev, isPlaying: false, currentTime: maxDuration };
        }
        return { ...prev, currentTime: nextTime };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playbackState.isPlaying, playbackState.speed, currentRoom?.currentMedia?.duration]);

  // Broadcast helper
  const broadcast = useCallback((type: string, payload: any) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type, payload });
    }
  }, []);

  const joinRoomByCode = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    const found = rooms.find((r) => r.code.toUpperCase() === formatted);
    if (!found) return false;

    joinRoomById(found.id);
    return true;
  };

  const joinRoomById = (id: string) => {
    const targetRoom = rooms.find((r) => r.id === id);
    if (!targetRoom) return;

    setCurrentRoomId(id);
    setPlaybackState(targetRoom.playbackState);

    // Initial welcome chat message
    const welcomeMsg: ChatMessage = {
      id: 'sys_' + Date.now(),
      roomId: id,
      userId: 'system',
      username: 'System',
      displayName: 'Rave Bot',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      avatarColor: '#00f0ff',
      text: `Добро пожаловать в комнату "${targetRoom.name}"! Код комнаты: ${targetRoom.code}`,
      timestamp: Date.now(),
      isSystem: true,
    };
    setChatMessages([welcomeMsg]);

    // Add current user to room members if not already
    if (currentUser) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            const alreadyMember = r.members.some((m) => m.userId === currentUser.id);
            if (alreadyMember) return r;
            const newMember: RoomMember = {
              userId: currentUser.id,
              username: currentUser.username,
              displayName: currentUser.displayName,
              avatar: currentUser.avatar,
              avatarColor: currentUser.avatarColor,
              isHost: r.hostId === currentUser.id,
              isSpeaking: false,
              isMuted: false,
              joinedAt: Date.now(),
            };
            return { ...r, members: [...r.members, newMember] };
          }
          return r;
        })
      );
    }
  };

  const leaveRoom = () => {
    if (currentRoomId && currentUser) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === currentRoomId) {
            return {
              ...r,
              members: r.members.filter((m) => m.userId !== currentUser.id),
            };
          }
          return r;
        })
      );
    }
    setCurrentRoomId(null);
    setChatMessages([]);
  };

  const createRoom = (name: string, isPrivate: boolean, customCode?: string): Room => {
    const code = customCode && customCode.trim() ? customCode.trim().toUpperCase() : generateRoomCode();
    const newRoom: Room = {
      id: 'room_' + Math.random().toString(36).substring(2, 9),
      code,
      name: name.trim() || 'Rave Party Room',
      description: 'Новая комната для совместного просмотра видео',
      hostId: currentUser ? currentUser.id : 'guest_host',
      hostName: currentUser ? currentUser.displayName : 'Host',
      isPrivate,
      createdAt: Date.now(),
      currentMedia: {
        id: PRESET_CATALOG[0].id,
        title: PRESET_CATALOG[0].title,
        type: PRESET_CATALOG[0].type,
        url: PRESET_CATALOG[0].url,
        thumbnailUrl: PRESET_CATALOG[0].thumbnailUrl,
        duration: PRESET_CATALOG[0].duration,
        author: PRESET_CATALOG[0].author,
        addedBy: currentUser ? currentUser.id : 'host',
        addedByName: currentUser ? currentUser.displayName : 'Host',
      },
      playbackState: {
        isPlaying: true,
        currentTime: 0,
        updatedAt: Date.now(),
        speed: 1,
      },
      queue: [],
      members: currentUser
        ? [
            {
              userId: currentUser.id,
              username: currentUser.username,
              displayName: currentUser.displayName,
              avatar: currentUser.avatar,
              avatarColor: currentUser.avatarColor,
              isHost: true,
              isSpeaking: false,
              isMuted: false,
              joinedAt: Date.now(),
            },
          ]
        : [],
      tags: ['Live', 'Custom Room', code],
    };

    setRooms((prev) => [newRoom, ...prev]);
    broadcast('ROOM_LIST_UPDATE', { rooms: [newRoom, ...rooms] });
    joinRoomById(newRoom.id);
    return newRoom;
  };

  const changeMedia = (media: MediaItem) => {
    if (!currentRoom) return;

    const newPlayback: PlaybackState = {
      isPlaying: true,
      currentTime: 0,
      updatedAt: Date.now(),
      speed: 1,
      lastUpdatedBy: currentUser?.displayName,
    };

    setPlaybackState(newPlayback);

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === currentRoom.id) {
          return {
            ...r,
            currentMedia: media,
            playbackState: newPlayback,
          };
        }
        return r;
      })
    );

    // Announce in chat
    const announceMsg: ChatMessage = {
      id: 'ann_' + Date.now(),
      roomId: currentRoom.id,
      userId: 'system',
      username: 'System',
      displayName: 'Rave Bot',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      avatarColor: '#00f0ff',
      text: `🎵 ${currentUser?.displayName || 'Кто-то'} включил: ${media.title}`,
      timestamp: Date.now(),
      isSystem: true,
    };
    setChatMessages((prev) => [...prev, announceMsg]);

    broadcast('ROOM_MEDIA', {
      roomId: currentRoom.id,
      media,
      playbackState: newPlayback,
    });
    broadcast('CHAT_MSG', {
      roomId: currentRoom.id,
      message: announceMsg,
    });
  };

  const addToQueue = (media: MediaItem) => {
    if (!currentRoom) return;

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === currentRoom.id) {
          return {
            ...r,
            queue: [...r.queue, media],
          };
        }
        return r;
      })
    );

    const queueMsg: ChatMessage = {
      id: 'queue_' + Date.now(),
      roomId: currentRoom.id,
      userId: 'system',
      username: 'System',
      displayName: 'Rave Bot',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      avatarColor: '#00f0ff',
      text: `Добавлено в очередь: ${media.title}`,
      timestamp: Date.now(),
      isSystem: true,
    };
    setChatMessages((prev) => [...prev, queueMsg]);
  };

  const removeFromQueue = (id: string) => {
    if (!currentRoom) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === currentRoom.id) {
          return {
            ...r,
            queue: r.queue.filter((item) => item.id !== id),
          };
        }
        return r;
      })
    );
  };

  const playNextInQueue = () => {
    if (!currentRoom || currentRoom.queue.length === 0) return;
    const nextItem = currentRoom.queue[0];
    const restQueue = currentRoom.queue.slice(1);

    const newPlayback: PlaybackState = {
      isPlaying: true,
      currentTime: 0,
      updatedAt: Date.now(),
      speed: 1,
    };

    setPlaybackState(newPlayback);

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === currentRoom.id) {
          return {
            ...r,
            currentMedia: nextItem,
            queue: restQueue,
            playbackState: newPlayback,
          };
        }
        return r;
      })
    );
  };

  const togglePlay = () => {
    if (!currentRoom) return;
    const nextPlaying = !playbackState.isPlaying;
    const updated: PlaybackState = {
      ...playbackState,
      isPlaying: nextPlaying,
      updatedAt: Date.now(),
      lastUpdatedBy: currentUser?.displayName,
    };
    setPlaybackState(updated);

    setRooms((prev) =>
      prev.map((r) => (r.id === currentRoom.id ? { ...r, playbackState: updated } : r))
    );

    broadcast('ROOM_PLAYBACK', {
      roomId: currentRoom.id,
      playbackState: updated,
    });
  };

  const seekTo = (time: number) => {
    if (!currentRoom) return;
    const updated: PlaybackState = {
      ...playbackState,
      currentTime: Math.max(0, time),
      updatedAt: Date.now(),
      lastUpdatedBy: currentUser?.displayName,
    };
    setPlaybackState(updated);

    setRooms((prev) =>
      prev.map((r) => (r.id === currentRoom.id ? { ...r, playbackState: updated } : r))
    );

    broadcast('ROOM_PLAYBACK', {
      roomId: currentRoom.id,
      playbackState: updated,
    });
  };

  const setSpeed = (speed: number) => {
    if (!currentRoom) return;
    const updated: PlaybackState = {
      ...playbackState,
      speed,
      updatedAt: Date.now(),
    };
    setPlaybackState(updated);

    setRooms((prev) =>
      prev.map((r) => (r.id === currentRoom.id ? { ...r, playbackState: updated } : r))
    );

    broadcast('ROOM_PLAYBACK', {
      roomId: currentRoom.id,
      playbackState: updated,
    });
  };

  const sendMessage = (text: string) => {
    if (!currentRoom || !currentUser || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      roomId: currentRoom.id,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      avatarColor: currentUser.avatarColor,
      text: text.trim(),
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    broadcast('CHAT_MSG', {
      roomId: currentRoom.id,
      message: newMsg,
    });
  };

  const sendReaction = (emoji: string) => {
    if (!currentRoom) return;

    const reaction: FloatingReaction = {
      id: 'react_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      emoji,
      x: 20 + Math.random() * 60, // random percentage across screen
      senderName: currentUser?.displayName || 'Участник',
      timestamp: Date.now(),
    };

    setFloatingReactions((prev) => [...prev.slice(-15), reaction]);

    // Auto cleanup after 3.5s
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reaction.id));
    }, 3500);

    broadcast('REACTION', {
      roomId: currentRoom.id,
      reaction,
    });
  };

  const toggleMic = () => {
    if (!currentRoom || !currentUser) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === currentRoom.id) {
          return {
            ...r,
            members: r.members.map((m) =>
              m.userId === currentUser.id ? { ...m, isMuted: !m.isMuted } : m
            ),
          };
        }
        return r;
      })
    );
  };

  const addLocalMedia = async (file: File): Promise<MediaItem> => {
    const objectUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');

    const localItem: MediaItem = {
      id: 'local_' + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: 'local',
      url: objectUrl,
      blobUrl: objectUrl,
      localFileName: file.name,
      localFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} МБ`,
      thumbnailUrl: isVideo
        ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=640&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640&auto=format&fit=crop&q=80',
      duration: 300,
      author: 'Локальный файл',
      addedBy: currentUser?.id || 'guest',
      addedByName: currentUser?.displayName || 'Я',
    };

    changeMedia(localItem);
    return localItem;
  };

  const syncWithHost = () => {
    if (!currentRoom) return;
    setPlaybackState(currentRoom.playbackState);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        currentRoom,
        playbackState,
        chatMessages,
        floatingReactions,
        isHost,
        joinRoomByCode,
        joinRoomById,
        leaveRoom,
        createRoom,
        changeMedia,
        addToQueue,
        removeFromQueue,
        playNextInQueue,
        togglePlay,
        seekTo,
        setSpeed,
        sendMessage,
        sendReaction,
        toggleMic,
        addLocalMedia,
        syncWithHost,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) throw new Error('useRoom must be used within RoomProvider');
  return context;
};
