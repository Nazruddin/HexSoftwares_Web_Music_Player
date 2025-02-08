import React from 'react';
import { Play } from 'lucide-react';
import { Song } from '../types';

interface PlaylistItemProps {
  song: Song;
  isActive: boolean;
  onSelect: () => void;
}

export function PlaylistItem({ song, isActive, onSelect }: PlaylistItemProps) {
  return (
    <div 
      className={`flex items-center p-3 space-x-4 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
        isActive ? 'bg-gray-100' : ''
      }`}
      onClick={onSelect}
    >
      <div className="relative group w-12 h-12 flex-shrink-0">
        <img
          src={song.coverArt}
          alt={song.title}
          className="w-full h-full rounded-md object-cover"
        />
        {!isActive && (
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:flex items-center justify-center hidden rounded-md">
            <Play size={20} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h3 className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>
          {song.title}
        </h3>
        <p className="text-sm text-gray-500">{song.artist}</p>
      </div>
      <span className="text-sm text-gray-400">{song.duration}</span>
    </div>
  );
}