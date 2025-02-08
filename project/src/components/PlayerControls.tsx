import React from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Repeat, Repeat1,
  Shuffle, FastForward
} from 'lucide-react';
import type { RepeatMode } from '../types';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  shuffle: boolean;
  onToggleShuffle: () => void;
  repeat: RepeatMode;
  onToggleRepeat: () => void;
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  volume,
  onVolumeChange,
  currentTime,
  duration,
  onSeek,
  isMuted,
  onToggleMute,
  playbackRate,
  onPlaybackRateChange,
  shuffle,
  onToggleShuffle,
  repeat,
  onToggleRepeat,
}: PlayerControlsProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full px-4 py-3">
      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleShuffle}
            className={`p-2 rounded-full transition-colors ${
              shuffle ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shuffle size={20} />
          </button>

          <button
            onClick={onPrevious}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipBack size={22} className="text-gray-700" />
          </button>
          
          <button
            onClick={onPlayPause}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipForward size={22} className="text-gray-700" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={`p-2 rounded-full transition-colors ${
              repeat !== 'none' ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMute}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX size={18} className="text-gray-600" />
            ) : (
              <Volume2 size={18} className="text-gray-600" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Playback Speed */}
      <div className="flex items-center justify-end space-x-2">
        <FastForward size={16} className="text-gray-500" />
        <select
          value={playbackRate}
          onChange={(e) => onPlaybackRateChange(Number(e.target.value))}
          className="text-sm text-gray-600 bg-gray-100 rounded-md px-2 py-1 outline-none"
        >
          <option value={0.5}>0.5x</option>
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  );
}