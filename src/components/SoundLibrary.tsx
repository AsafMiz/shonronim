
import React, { useState } from 'react';
import { Play, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import soundsData from '../assets/sounds.json';
import categoriesData from '../assets/categories.json';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { APP_CONFIG } from '../config/constants';

interface Sound {
  id: string;
  title: string;
  filename: string;
  tags: string[];
  hidden_tags: string[];
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  isShown: boolean;
}

interface SoundLibraryProps {
  onAddToSoundboard: (sound: Sound) => boolean;
  soundboardSounds: (Sound | null)[];
}

const SoundLibrary: React.FC<SoundLibraryProps> = ({ onAddToSoundboard, soundboardSounds }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [globalVolume] = useLocalStorage<number>(
    APP_CONFIG.STORAGE_KEYS.GLOBAL_VOLUME, 
    APP_CONFIG.DEFAULT_GLOBAL_VOLUME
  );

  const sounds: Sound[] = soundsData;
  const categories: Category[] = categoriesData;

  // Function to get category by ID
  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find(cat => cat.id === categoryId);
  };

  // Function to get category color by category ID
  const getCategoryColor = (categoryId: string): string => {
    const category = getCategoryById(categoryId);
    return category ? category.color : APP_CONFIG.DEFAULT_CUBE_COLOR;
  };

  // Function to get category name by category ID
  const getCategoryName = (categoryId: string): string => {
    const category = getCategoryById(categoryId);
    return category ? category.name : 'לא ידוע';
  };

  const filteredSounds = sounds.filter(sound => {
    const matchesSearch = searchTerm === '' ||
      sound.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sound.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sound.hidden_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === '' || sound.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.title.localeCompare(b.title, 'he'));

  const isSoundOnSoundboard = (soundId: string): boolean => {
    console.log('SoundLibrary: isSoundOnSoundboard called', { soundId });
    const result = soundboardSounds.some(boardSound => boardSound?.id === soundId);
    console.log('SoundLibrary: isSoundOnSoundboard result:', result);
    return result;
  };

  const hasAvailableCubes = (): boolean => {
    return soundboardSounds.some(boardSound => boardSound === null);
  };

  const handlePlay = (soundId: string, filename: string) => {
    console.log('SoundLibrary handlePlay called', { soundId, filename, globalVolume });

    try {
      if (playingSound === soundId) {
        console.log('SoundLibrary: Stopping currently playing sound');
        setPlayingSound(null);
      } else {
        setPlayingSound(soundId);

        // Create and play audio with proper path and volume
        const soundsDirPath = "sounds/";
        const audioPath = soundsDirPath + filename;
        console.log('SoundLibrary: Creating audio with path:', audioPath);
        const audio = new Audio(audioPath);

        // Set volume based on global volume
        audio.volume = globalVolume / 100;

        audio.play()
          .then(() => {
            console.log('SoundLibrary: Audio started playing successfully');
          })
          .catch((error) => {
            console.error('SoundLibrary: Error playing audio:', error);
            setPlayingSound(null);
          });

        audio.onended = () => {
          console.log('SoundLibrary: Audio playback ended');
          setPlayingSound(null);
        };

        audio.onerror = (error) => {
          console.error('SoundLibrary: Audio error:', error);
          setPlayingSound(null);
        };
      }
    } catch (error) {
      console.error('SoundLibrary: Exception in handlePlay:', error);
      setPlayingSound(null);
    }
  };

  const handleShare = async (sound: Sound) => {
    console.log('SoundLibrary handleShare called', { sound });
    try {
      const soundUrl = `${window.location.origin}/sounds/${sound.filename}`;
      
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: sound.title,
          text: `🔊 תשמע את הצליל הזה: ${sound.title}`,
          url: soundUrl
        });
        console.log('SoundLibrary: Shared via native share API');
      } else {
        // Fallback to WhatsApp
        const text = `🔊 תשמע את הצליל הזה: ${sound.title} ${soundUrl}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        console.log('SoundLibrary: Opening WhatsApp with URL:', url);
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('SoundLibrary: Exception in handleShare:', error);
    }
  };

  const handleAddToSoundboard = (sound: Sound) => {
    console.log('SoundLibrary handleAddToSoundboard called', { sound });
    try {
      if (!hasAvailableCubes()) {
        console.log('SoundLibrary: No empty cubes available');
        alert(APP_CONFIG.STRINGS.NO_EMPTY_CUBES);
        return;
      }
      
      const success = onAddToSoundboard(sound);
      if (!success) {
        console.log('SoundLibrary: Failed to add sound to soundboard');
        alert(APP_CONFIG.STRINGS.NO_EMPTY_CUBES);
      } else {
        console.log('SoundLibrary: Successfully added sound to soundboard');
      }
    } catch (error) {
      console.error('SoundLibrary: Exception in handleAddToSoundboard:', error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-right">{APP_CONFIG.STRINGS.SOUND_LIBRARY_TITLE}</h2>

        {/* Search */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder={APP_CONFIG.STRINGS.SEARCH_PLACEHOLDER}
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
            className={`${selectedCategory === '' 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {APP_CONFIG.STRINGS.ALL_CATEGORIES}
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`text-white border-transparent hover:opacity-80 ${category.color} ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-lg' 
                  : 'hover:scale-105'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Sound grid */}
      <div className={`grid ${APP_CONFIG.GRID_CLASSES.LIBRARY} gap-4`}>
        {filteredSounds.map(sound => {
          const isOnSoundboard = isSoundOnSoundboard(sound.id);
          const availableCubes = hasAvailableCubes();
          const categoryColor = getCategoryColor(sound.category);

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
                    disabled={isOnSoundboard || !availableCubes}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-2">
                <span 
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${categoryColor}`}
                >
                  {getCategoryName(sound.category)}
                </span>
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
          {APP_CONFIG.STRINGS.NO_SOUNDS_FOUND}
        </div>
      )}
    </div>
  );
};

export default SoundLibrary;
