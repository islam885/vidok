import { MediaItem } from '../types';

export interface SearchResultItem {
  id: string;
  title: string;
  author: string;
  type: 'youtube' | 'vk' | 'direct';
  url: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  category: string;
}

export const PRESET_CATALOG: SearchResultItem[] = [
  {
    id: 'yt-1',
    title: 'CYBERPUNK NEON GLOW — Synthwave & Chill Rave Session',
    author: 'Neon Pulse Radio',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=640&auto=format&fit=crop&q=80',
    duration: 3600,
    category: 'Rave & Synthwave',
  },
  {
    id: 'yt-2',
    title: 'Lofi Hip Hop Radio — Beats to Relax/Study to',
    author: 'Lofi Girl',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=640&auto=format&fit=crop&q=80',
    duration: 7200,
    category: 'Lofi & Chill',
  },
  {
    id: 'yt-3',
    title: 'Tomorrowland Mainstage Festival DJ Live Set (Ultra HD)',
    author: 'Festival Rave Live',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=640&auto=format&fit=crop&q=80',
    duration: 3740,
    category: 'EDM & Rave',
  },
  {
    id: 'yt-4',
    title: 'Cyber Rave 2077 Night Club Experience 4K HDR',
    author: 'Night City Vibes',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=640&auto=format&fit=crop&q=80',
    duration: 1800,
    category: 'Electronic',
  },
  {
    id: 'vk-1',
    title: 'VK Музыка — Топ Хит Пати & Клипы 2026',
    author: 'VK Клипы & Видео',
    type: 'vk',
    url: 'https://vk.com/video_ext.php?oid=-22822305&id=456241123&hd=2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=640&auto=format&fit=crop&q=80',
    duration: 1420,
    category: 'VK Видео',
  },
  {
    id: 'vk-2',
    title: 'VK Live Stream Fest — Ночной Драйв и Басы',
    author: 'VK Музыка Live',
    type: 'vk',
    url: 'https://vk.com/video_ext.php?oid=-101982925&id=456239120&hd=2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=640&auto=format&fit=crop&q=80',
    duration: 2150,
    category: 'VK Видео',
  },
  {
    id: 'direct-1',
    title: 'Tears of Steel — Sci-Fi Cyberpunk VFX Showcase (Direct Stream)',
    author: 'Blender Open Movie Project',
    type: 'direct',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=640&auto=format&fit=crop&q=80',
    duration: 734,
    category: 'Direct MP4 Stream',
  },
  {
    id: 'direct-2',
    title: 'Big Buck Bunny (Ultra Smooth 60fps MP4)',
    author: 'Blender Foundation',
    type: 'direct',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=640&auto=format&fit=crop&q=80',
    duration: 596,
    category: 'Direct MP4 Stream',
  },
];

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // Handle youtube.com/watch?v=...
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export function extractVkVideoEmbed(url: string): string | null {
  if (!url) return null;
  // Handle if already an embed url
  if (url.includes('video_ext.php')) {
    return url;
  }
  // Handle vk.com/video-123456_789012 or vkvideo.ru/video-123456_789012
  const reg = /(?:vk\.com|vkvideo\.ru)\/video(-?\d+)_(\d+)/;
  const match = url.match(reg);
  if (match) {
    const oid = match[1];
    const id = match[2];
    return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2&autoplay=1`;
  }
  return null;
}

export function detectMediaType(url: string): 'youtube' | 'vk' | 'direct' {
  if (url.includes('youtu.be') || url.includes('youtube.com')) {
    return 'youtube';
  }
  if (url.includes('vk.com') || url.includes('vkvideo.ru')) {
    return 'vk';
  }
  return 'direct';
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs > 0) {
    return `${hrs}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'RAVE-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
