
import React from 'react';

interface SoundWaveAnimationProps {
  isPlaying: boolean;
}

const SoundWaveAnimation: React.FC<SoundWaveAnimationProps> = ({ isPlaying }) => {
  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-white rounded-full transition-all duration-300 ${
            isPlaying 
              ? 'animate-pulse h-6' 
              : 'h-2'
          }`}
          style={{
            animationDelay: isPlaying ? `${i * 0.1}s` : '0s',
            animationDuration: isPlaying ? '0.6s' : '0s'
          }}
        />
      ))}
    </div>
  );
};

export default SoundWaveAnimation;
