import React, { useRef, useState, useEffect } from 'react';
import { Music2, Maximize2, Minimize2 } from 'lucide-react';
import { songs } from './data/songs';
import { PlayerState } from './types';
import { PlaylistItem } from './components/PlaylistItem';
import { PlayerControls } from './components/PlayerControls';

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    volume: 0.7,
    currentSongIndex: 0,
    shuffle: false,
    repeat: 'none',
    isFullscreen: false,
    isMuted: false,
    playbackRate: 1
  });

  const currentSong = songs[playerState.currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume;
      audioRef.current.playbackRate = playerState.playbackRate;
      audioRef.current.muted = playerState.isMuted;
    }
  }, [playerState.volume, playerState.playbackRate, playerState.isMuted]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, playerState.volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, playerState.volume - 0.1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerState]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (playerState.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
      }));
    }
  };

  const handleSongEnd = () => {
    if (playerState.repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (playerState.repeat === 'all' || playerState.shuffle) {
      handleNext();
    } else if (playerState.currentSongIndex < songs.length - 1) {
      handleNext();
    } else {
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    }
  };

  const getNextSongIndex = () => {
    if (playerState.shuffle) {
      const availableIndices = songs.map((_, i) => i).filter(i => i !== playerState.currentSongIndex);
      return availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }
    return (playerState.currentSongIndex + 1) % songs.length;
  };

  const handlePrevious = () => {
    const newIndex = (playerState.currentSongIndex - 1 + songs.length) % songs.length;
    setPlayerState(prev => ({ ...prev, currentSongIndex: newIndex, currentTime: 0 }));
  };

  const handleNext = () => {
    const newIndex = getNextSongIndex();
    setPlayerState(prev => ({ ...prev, currentSongIndex: newIndex, currentTime: 0 }));
  };

  const handleVolumeChange = (newVolume: number) => {
    setPlayerState(prev => ({ ...prev, volume: newVolume }));
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setPlayerState(prev => ({ ...prev, currentTime: value }));
    }
  };

  const toggleFullscreen = () => {
    setPlayerState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const toggleMute = () => {
    setPlayerState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlayerState(prev => ({ ...prev, playbackRate: rate }));
  };

  const toggleShuffle = () => {
    setPlayerState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const toggleRepeat = () => {
    const modes: PlayerState['repeat'][] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(playerState.repeat);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setPlayerState(prev => ({ ...prev, repeat: nextMode }));
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 transition-all ${
      playerState.isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''
    }`}>
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
        playerState.isFullscreen ? 'w-full h-full max-w-none' : 'w-full max-w-md'
      }`}>
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Music2 size={24} />
              <h1 className="text-xl font-semibold">Web Music Player</h1>
            </div>
            <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              {playerState.isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        {/* Current Song Info */}
        <div className={`p-6 ${playerState.isFullscreen ? 'flex-grow' : ''}`}>
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            className={`mx-auto rounded-lg shadow-md object-cover ${
              playerState.isFullscreen ? 'w-96 h-96' : 'w-48 h-48'
            }`}
          />
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold text-gray-800">{currentSong.title}</h2>
            <p className="text-gray-500">{currentSong.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <PlayerControls
          isPlaying={playerState.isPlaying}
          onPlayPause={togglePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          volume={playerState.volume}
          onVolumeChange={handleVolumeChange}
          currentTime={playerState.currentTime}
          duration={audioRef.current?.duration || 0}
          onSeek={handleSeek}
          isMuted={playerState.isMuted}
          onToggleMute={toggleMute}
          playbackRate={playerState.playbackRate}
          onPlaybackRateChange={handlePlaybackRateChange}
          shuffle={playerState.shuffle}
          onToggleShuffle={toggleShuffle}
          repeat={playerState.repeat}
          onToggleRepeat={toggleRepeat}
        />

        {/* Playlist */}
        <div className="border-t border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Playlist
            </h3>
          </div>
          <div className="px-4 pb-4 space-y-2">
            {songs.map((song, index) => (
              <PlaylistItem
                key={song.id}
                song={song}
                isActive={index === playerState.currentSongIndex}
                onSelect={() => {
                  setPlayerState(prev => ({
                    ...prev,
                    currentSongIndex: index,
                    currentTime: 0,
                    isPlaying: true
                  }));
                }}
              />
            ))}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSongEnd}
        />
      </div>
    </div>
  );
}

export default App;