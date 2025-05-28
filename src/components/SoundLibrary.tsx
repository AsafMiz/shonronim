import React, { useState } from 'react';
import { Play, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import soundsData from '../assets/sounds.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Sound {
  id: string;
  title: string;
  filename: string;
  tags: string[];
  hidden_tags: string[];
  category: string;
}

interface SoundLibraryProps {
  onAddToSoundboard: (sound: Sound) => boolean;
}

const SoundLibrary: React.FC<SoundLibraryProps> = ({ onAddToSoundboard }) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [soundboardSounds] = useLocalStorage<(Sound | null)[]>('soundboard', new Array(8).fill(null));
  const [globalVolume] = useLocalStorage<number>('globalVolume', 70);

  const sounds: Sound[] = soundsData;
  const categories = [...new Set(sounds.map(sound => sound.category))];

  const filteredSounds = sounds.filter(sound => {
    const matchesSearch = searchTerm === '' || 
      sound.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sound.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sound.hidden_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || sound.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const isSoundOnSoundboard = (soundId: string): boolean => {
    const result = soundboardSounds.some(boardSound => boardSound?.id === soundId);
    return result;
  };

  const handlePlay = (soundId: string, filename: string) => {
    console.log('handlePlay called', { soundId, filename, globalVolume });
    
    try {
      if (playingSound === soundId) {
        console.log('Stopping currently playing sound');
        setPlayingSound(null);
      } else {
        setPlayingSound(soundId);
        
        // Create and play audio with proper path and volume
        const soundsDirPath = "src/assets/";
        const audioPath = soundsDirPath + filename;
        console.log('Creating audio with path:', audioPath);
        const audio = new Audio(audioPath);
        
        // Set volume based on global volume
        audio.volume = globalVolume / 100;
        
        audio.play()
          .then(() => {
            console.log('Audio started playing successfully');
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            setPlayingSound(null);
          });
        
        audio.onended = () => {
          console.log('Audio playback ended');
          setPlayingSound(null);
        };

        audio.onerror = (error) => {
          console.error('Audio error:', error);
          setPlayingSound(null);
        };
        
        // Demo: stop playing after 3 seconds
        setTimeout(() => {
          console.log('Stopping audio after 3 seconds (demo)');
          setPlayingSound(null);
          audio.pause();
        }, 3000);
      }
    } catch (error) {
      console.error('Exception in handlePlay:', error);
      setPlayingSound(null);
    }
  };

  const handleShare = (sound: Sound) => {
    console.log('handleShare called', { sound });
    try {
      const text = `🔊 תשמע את הצליל הזה: ${sound.title}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      console.log('Opening WhatsApp with URL:', url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Exception in handleShare:', error);
    }
  };

  const handleAddToSoundboard = (sound: Sound) => {
    console.log('handleAddToSoundboard called', { sound });
    try {
      const success = onAddToSoundboard(sound);
      if (!success) {
        console.log('No empty cubes available');
        alert('אין קוביות פנויות בלוח הצלילים');
      } else {
        console.log('Successfully added sound to soundboard');
      }
    } catch (error) {
      console.error('Exception in handleAddToSoundboard:', error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-right">ספריית צלילים</h2>
        
        {/* Search */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="חיפוש צלילים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
            dir="rtl"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('')}
          >
            הכל
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Sound grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSounds.map(sound => {
          const isOnSoundboard = isSoundOnSoundboard(sound.id);
          
          return (
            <div
              key={sound.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 truncate ml-2">
                  {sound.title}
                </h3>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0"
                    onClick={() => handlePlay(sound.id, sound.filename)}
                  >
                    <Play 
                      className={`w-4 h-4 ${playingSound === sound.id ? 'animate-pulse' : ''}`} 
                      fill={playingSound === sound.id ? 'currentColor' : 'none'}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0"
                    onClick={() => handleShare(sound)}
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className={`w-8 h-8 p-0 ${isOnSoundboard ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={() => handleAddToSoundboard(sound)}
                    disabled={isOnSoundboard}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {sound.category}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {sound.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSounds.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          לא נמצאו צלילים התואמים לחיפוש
        </div>
      )}
    </div>
  );
};

export default SoundLibrary;
