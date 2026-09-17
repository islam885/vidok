export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  avatarColor: string;
  bio?: string;
  createdAt: number;
}

export type MediaType = 'youtube' | 'vk' | 'local' | 'direct';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  author?: string;
  addedBy: string;
  addedByName: string;
  blobUrl?: string;
  localFileName?: string;
  localFileSize?: string;
}

export interface RoomMember {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  avatarColor: string;
  isHost: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  joinedAt: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  updatedAt: number;
  speed: number;
  lastUpdatedBy?: string;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  description: string;
  hostId: string;
  hostName: string;
  isPrivate: boolean;
  createdAt: number;
  currentMedia: MediaItem | null;
  playbackState: PlaybackState;
  queue: MediaItem[];
  members: RoomMember[];
  tags: string[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  avatarColor: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
  senderName: string;
  timestamp: number;
}

export type ActiveTab = 'home' | 'rooms' | 'room' | 'search' | 'profile';
