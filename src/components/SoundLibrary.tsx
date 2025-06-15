import React, { useState, useEffect } from 'react';
import { Play, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { APP_CONFIG } from '../config/constants';
import { loadAllSounds, loadAllCategories } from '../services/soundsService';

interface Sound {
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
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalVolume] = useLocalStorage<number>(
    APP_CONFIG.STORAGE_KEYS.GLOBAL_VOLUME, 
    APP_CONFIG.DEFAULT_GLOBAL_VOLUME
  );

  // Load sounds and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [allSounds, allCategories] = await Promise.all([
          loadAllSounds(),
          loadAllCategories()
        ]);
        setSounds(allSounds);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
    return category ? category.name : 'אחר';
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
    const result = soundboardSounds.some(boardSound => boardSound?.title === soundId);
    return result;
  };

  const hasAvailableCubes = (): boolean => {
    return soundboardSounds.some(boardSound => boardSound === null);
  };

  const handlePlay = (soundId: string, filename: string) => {

    try {
      if (playingSound === soundId) {
        setPlayingSound(null);
      } else {
        setPlayingSound(soundId);

        // Create and play audio with proper path and volume
        const soundsDirPath = "sounds/";
        const audioPath = soundsDirPath + filename;
        const audio = new Audio(audioPath);

        // Set volume based on global volume
        audio.volume = globalVolume / 100;

        // Demo: stop playing after 60 seconds
        // setTimeout(() => {
        //   setPlayingSound(null);
        //   if (audio) {
        //     audio.pause();
        //   }
        // }, 60000);
        audio.play()
          .then(() => {
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
    try {
          const soundUrl = `${window.location.origin}/sounds/${sound.filename}`;
          
          // Fetch the sound file
          const response = await fetch(soundUrl);
          const blob = await response.blob();
          
          // Create a File object
          const file = new File([blob], sound.filename, { type: blob.type });
      
          // Check if sharing files is supported
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: sound.title,
              text: APP_CONFIG.STRINGS.SHARE_SOUND_TEXT + `${sound.title}`,
              files: [file]
            });
            console.log('SoundCube: Shared file via native share API');
          } else {
            // Fallback to WhatsApp share link
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(APP_CONFIG.STRINGS.SHARE_SOUND_TEXT + sound.title + ' ' + soundUrl)}`;
            window.open(whatsappUrl, '_blank');
          }
        } catch (error) {
          console.error('SoundCube: Exception in handleShare:', error);
        }
  };

  const handleAddToSoundboard = (sound: Sound) => {
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
            className={selectedCategory === '' ? '#fff text-white' : ''}
          >
            {APP_CONFIG.STRINGS.ALL_CATEGORIES}
          </Button>
          {categories
            .sort((a, b) => a.name.localeCompare(b.name, 'he'))
            .map(category => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`${category.color} text-white border-transparent hover:opacity-80 ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-blue-500 ring-offset-2 opacity-90' 
                  : ''
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">טוען צלילים...</p>
        </div>
      )}

      {/* Sound grid */}
      {!isLoading && (
        <div className={`grid ${APP_CONFIG.GRID_CLASSES.LIBRARY} gap-4`}>
          {filteredSounds.map(sound => {
            const isOnSoundboard = isSoundOnSoundboard(sound.title);
            const availableCubes = hasAvailableCubes();

            return (
              <div
                key={sound.title}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-right flex-1">{sound.title}</h3>
                  
                  <div className="flex gap-2 mr-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                      onClick={() => handlePlay(sound.title, sound.filename)}
                    >
                      <Play
                        className={`w-4 h-4 ${playingSound === sound.title ? 'animate-pulse' : ''}`}
                        fill={playingSound === sound.title ? 'currentColor' : 'none'}
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
                      variant="outline"
                      className="w-8 h-8 p-0"
                      onClick={() => handleAddToSoundboard(sound)}
                      disabled={isOnSoundboard || !availableCubes}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-2">
                  <span 
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${getCategoryColor(sound.category)}`}
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
      )}

      {!isLoading && filteredSounds.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {APP_CONFIG.STRINGS.NO_SOUNDS_FOUND}
        </div>
      )}
    </div>
  );
};

export default SoundLibrary;
