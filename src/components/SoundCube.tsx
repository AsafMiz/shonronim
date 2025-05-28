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
}

const SoundCube: React.FC<SoundCubeProps> = ({ sound, onAddSound, onRemoveSound, index }) => {
  console.log('SoundCube rendered', { sound, index });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    console.log('handlePlay called', { sound });
    if (!sound) {
      console.log('No sound available');
      return;
    }

    try {
      if (audioRef.current) {
        console.log('Stopping previous audio');
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create audio element with proper path
      const audioPath = sound.filename.startsWith('/') ? sound.filename : `/${sound.filename}`;
      console.log('Creating audio with path:', audioPath);
      audioRef.current = new Audio(audioPath);
      
      setIsPlaying(true);
      
      audioRef.current.play()
        .then(() => {
          console.log('Audio started playing successfully');
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });

      audioRef.current.onended = () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
      };

      audioRef.current.onerror = (error) => {
        console.error('Audio error:', error);
        setIsPlaying(false);
      };

      // Demo: stop playing after 2 seconds
      setTimeout(() => {
        console.log('Stopping audio after 2 seconds (demo)');
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }, 2000);
    } catch (error) {
      console.error('Exception in handlePlay:', error);
      setIsPlaying(false);
    }
  };

  const handleShare = () => {
    console.log('handleShare called', { sound });
    if (!sound) {
      console.log('No sound to share');
      return;
    }
    
    try {
      const text = `🔊 תשמע את הצליל הזה: ${sound.title}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      console.log('Opening WhatsApp with URL:', url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Exception in handleShare:', error);
    }
  };

  const handleRemove = () => {
    console.log('handleRemove called');
    try {
      setShowConfirm(true);
    } catch (error) {
      console.error('Exception in handleRemove:', error);
    }
  };

  const confirmRemove = () => {
    console.log('confirmRemove called');
    try {
      onRemoveSound();
      setShowConfirm(false);
    } catch (error) {
      console.error('Exception in confirmRemove:', error);
    }
  };

  const handleAddSound = () => {
    console.log('handleAddSound called');
    try {
      onAddSound();
    } catch (error) {
      console.error('Exception in handleAddSound:', error);
    }
  };

  return (
    <div className="relative group">
      <div className={`
        relative w-full aspect-square rounded-xl overflow-hidden
        transition-all duration-300 transform hover:scale-105
        ${sound 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl' 
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

        {/* Action buttons overlay */}
        {sound && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
