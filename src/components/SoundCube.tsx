
import React, { useState, useRef } from 'react';
import { Plus, Play, Trash, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SoundWaveAnimation from './SoundWaveAnimation';
import ConfirmDialog from './ConfirmDialog';

interface Sound {
  id: string;
  title: string;
  filename: string;
  tags: string[];
  hidden_tags: string[];
  category: string;
}

interface SoundCubeProps {
  sound?: Sound;
  onAddSound: () => void;
  onRemoveSound: () => void;
  index: number;
  cubeColor: string;
  globalVolume: number;
}

const SoundCube: React.FC<SoundCubeProps> = ({ 
  sound, 
  onAddSound, 
  onRemoveSound, 
  index, 
  cubeColor, 
  globalVolume 
}) => {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    console.log('SoundCube handlePlay called', { sound, globalVolume });
    if (!sound) {
      console.log('SoundCube: No sound available');
      return;
    }

    try {
      // If currently playing, restart the sound
      if (audioRef.current) {
        console.log('SoundCube: Stopping and restarting audio');
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
        setIsPlaying(false);
      }

      // Create new audio element
      const soundsDirPath = "sounds/";
      const audioPath = soundsDirPath + sound.filename;
      console.log('SoundCube: Creating audio with path::', audioPath);
      const audio = new Audio(audioPath);
      audioRef.current = audio;
      
      // Set volume based on global volume
      audio.volume = globalVolume / 100;
      console.log('SoundCube: Setting audio volume to:', audio.volume);
      
      setIsPlaying(true);
      
      audio.play()
        .then(() => {
          console.log('SoundCube: Audio started playing successfully');
        })
        .catch((error) => {
          console.error('SoundCube: Error playing audio:', error);
          setIsPlaying(false);
          audioRef.current = null;
        });

      audio.onended = () => {
        console.log('SoundCube: Audio playback ended');
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = (error) => {
        console.error('SoundCube: Audio error:', error);
        setIsPlaying(false);
        audioRef.current = null;
      };
    } catch (error) {
      console.error('SoundCube: Exception in handlePlay:', error);
      setIsPlaying(false);
      audioRef.current = null;
    }
  };

  const handleShare = async () => {
    console.log('SoundCube handleShare called', { sound });
    if (!sound) {
      console.log('SoundCube: No sound to share');
      return;
    }
    
    try {
      const soundUrl = `${window.location.origin}/sounds/${sound.filename}`;
      
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: sound.title,
          text: `🔊 תשמע את הצליל הזה: ${sound.title}`,
          url: soundUrl
        });
        console.log('SoundCube: Shared via native share API');
      } else {
        // Fallback to WhatsApp
        const text = `🔊 תשמע את הצליל הזה: ${sound.title} ${soundUrl}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        console.log('SoundCube: Opening WhatsApp with URL:', url);
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('SoundCube: Exception in handleShare:', error);
    }
  };

  const handleRemove = () => {
    console.log('SoundCube handleRemove called');
    try {
      setShowConfirm(true);
    } catch (error) {
      console.error('SoundCube: Exception in handleRemove:', error);
    }
  };

  const confirmRemove = () => {
    console.log('SoundCube confirmRemove called');
    try {
      // Stop audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlaying(false);
      }
      onRemoveSound();
      setShowConfirm(false);
    } catch (error) {
      console.error('SoundCube: Exception in confirmRemove:', error);
    }
  };

  const handleAddSound = () => {
    console.log('SoundCube handleAddSound called');
    try {
      onAddSound();
    } catch (error) {
      console.error('SoundCube: Exception in handleAddSound:', error);
    }
  };

  return (
    <div className="relative group">
      <div className={`
        relative w-full aspect-square rounded-xl overflow-hidden
        transition-all duration-300 transform hover:scale-105
        ${sound 
          ? `bg-gradient-to-br ${cubeColor} shadow-lg hover:shadow-xl` 
          : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 border-2 border-dashed border-gray-400'
        }
      `}>
        {/* Main content area */}
        <div 
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={sound ? handlePlay : handleAddSound}
        >
          {sound ? (
            <div className="text-center text-white">
              {isPlaying ? (
                <SoundWaveAnimation isPlaying={isPlaying} />
              ) : (
                <Play className="w-8 h-8 mx-auto" fill="white" />
              )}
            </div>
          ) : (
            <Plus className="w-8 h-8 text-gray-600" />
          )}
        </div>

        {/* Action buttons overlay - always visible on mobile, hover on desktop */}
        {sound && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30 border-none"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              <Share className="w-4 h-4 text-white" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="w-8 h-8 p-0 bg-red-500/80 hover:bg-red-600/80"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Sound title */}
      {sound && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-800 truncate">
            {sound.title}
          </p>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="הסרת צליל"
        description={`האם אתה בטוח שברצונך להסיר את הצליל "${sound?.title}" מהקוביה?`}
        onConfirm={confirmRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default SoundCube;
