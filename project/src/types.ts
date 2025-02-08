export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  url: string;
  coverArt: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  currentSongIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  isFullscreen: boolean;
  isMuted: boolean;
  playbackRate: number;
}

export type RepeatMode = 'none' | 'one' | 'all';