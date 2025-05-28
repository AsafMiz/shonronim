
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (!sound) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create audio element for demo purposes (in real app, you'd load actual files)
    audioRef.current = new Audio();
    audioRef.current.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUc`;
    
    setIsPlaying(true);
    audioRef.current.play().catch(console.error);

    audioRef.current.onended = () => {
      setIsPlaying(false);
    };

    // Demo: stop playing after 2 seconds
    setTimeout(() => {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }, 2000);
  };

  const handleShare = () => {
    if (!sound) return;
    const text = `🔊 תשמע את הצליל הזה: ${sound.title}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleRemove = () => {
    setShowConfirm(true);
  };

  const confirmRemove = () => {
    onRemoveSound();
    setShowConfirm(false);
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
          onClick={sound ? handlePlay : onAddSound}
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
