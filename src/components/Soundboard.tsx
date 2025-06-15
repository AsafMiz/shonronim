import React, { useState, useEffect } from 'react';
import SoundCube from './SoundCube';
import SoundLibrary from './SoundLibrary';
import { useLocalStorage } from '../hooks/useLocalStorage';
import categoriesData from '../assets/categories.json';
import { APP_CONFIG } from '../config/constants';
import { loadAllSounds } from '../services/soundsService';

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

const Soundboard: React.FC = () => {
  
  const [soundboardSounds, setSoundboardSounds] = useLocalStorage<(Sound | null)[]>(
    APP_CONFIG.STORAGE_KEYS.SOUNDBOARD, 
    new Array(APP_CONFIG.SOUNDBOARD_CUBES_COUNT).fill(null)
  );
  const [showLibrary, setShowLibrary] = useState(false);
  const [targetCubeIndex, setTargetCubeIndex] = useState<number | null>(null);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, forceUpdate] = useState({});

  const categories: Category[] = categoriesData;

  // Load sounds on component mount
  useEffect(() => {
    const loadSounds = async () => {
      setIsLoading(true);
      try {
        const allSounds = await loadAllSounds();
        setSounds(allSounds);
      } catch (error) {
        console.error('Error loading sounds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSounds();
  }, []);

  // Function to get category color by category ID
  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    const color = category ? category.color : APP_CONFIG.DEFAULT_CUBE_COLOR 
    return color;
  };

  // Initialize with random sounds on first visit - but allow all empty cubes
  useEffect(() => {
    const hasBeenInitialized = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.INITIALIZED);
    
    if (!hasBeenInitialized && sounds.length > 0) {
      try {
        const shuffledSounds = [...sounds].sort(() => Math.random() - 0.5);
        const initialSounds = new Array(APP_CONFIG.SOUNDBOARD_CUBES_COUNT).fill(null);
        
        // Fill first positions with random sounds
        for (let i = 0; i < APP_CONFIG.INITIAL_FILLED_CUBES && i < shuffledSounds.length; i++) {
          initialSounds[i] = shuffledSounds[i];
        }
        
        setSoundboardSounds(initialSounds);
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.INITIALIZED, 'true');
      } catch (error) {
        console.error('Soundboard: Exception in useEffect initialization:', error);
      }
    }
  }, [sounds, setSoundboardSounds]);

  const handleAddSound = (cubeIndex: number) => {
    try {
      setTargetCubeIndex(cubeIndex);
      setShowLibrary(true);
    } catch (error) {
      console.error('Soundboard: Exception in handleAddSound:', error);
    }
  };

  const handleRemoveSound = (cubeIndex: number) => {
    try {
      const newSounds = [...soundboardSounds];
      newSounds[cubeIndex] = null;
      setSoundboardSounds(newSounds);
      // Force a re-render to update the cube immediately
      forceUpdate({});
    } catch (error) {
      console.error('Soundboard: Exception in handleRemoveSound:', error);
    }
  };

  const handleAddToSoundboard = (sound: Sound): boolean => {
    
    try {
      if (targetCubeIndex !== null) {
        const newSounds = [...soundboardSounds];
        newSounds[targetCubeIndex] = sound;
        setSoundboardSounds(newSounds);
        setShowLibrary(false);
        setTargetCubeIndex(null);
        // Force a re-render to update the cube color immediately
        forceUpdate({});
        // console.log('Soundboard: Added sound to specific cube:', targetCubeIndex);
        return true;
      }

      // Find first empty cube
      const emptyIndex = soundboardSounds.findIndex(s => s === null);
      if (emptyIndex !== -1) {
        const newSounds = [...soundboardSounds];
        newSounds[emptyIndex] = sound;
        setSoundboardSounds(newSounds);
        // Force a re-render to update the cube color immediately
        forceUpdate({});
        // console.log('Soundboard: Added sound to first empty cube:', emptyIndex);
        return true;
      }

      console.log('Soundboard: No empty cubes available');
      return false; // No empty cubes
    } catch (error) {
      console.error('Soundboard: Exception in handleAddToSoundboard:', error);
      return false;
    }
  };

  if (showLibrary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <button
            onClick={() => {
              setShowLibrary(false);
              setTargetCubeIndex(null);
            }}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            {APP_CONFIG.STRINGS.BACK_TO_SOUNDBOARD}
          </button>
        </div>
        <SoundLibrary 
          onAddToSoundboard={handleAddToSoundboard} 
          soundboardSounds={soundboardSounds}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-250px)] flex flex-col" dir="rtl">
      <div className="p-2 sm:p-4 text-center">
        <p className="text-sm text-gray-600">{APP_CONFIG.STRINGS.SOUNDBOARD_INSTRUCTIONS}</p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">טוען צלילים...</p>
          </div>
        </div>
      )}

      {/* Soundboard grid */}
      {!isLoading && (
        <div className="flex-1 px-2 sm:px-4 pb-2 sm:pb-4">
          <div className={`grid ${APP_CONFIG.GRID_CLASSES.SOUNDBOARD} gap-2 sm:gap-4 h-full max-w-4xl mx-auto`}>
            {soundboardSounds.map((sound, index) => (
              <SoundCube
                key={`${index}-${sound?.title || 'empty'}`}
                sound={sound}
                onAddSound={() => handleAddSound(index)}
                onRemoveSound={() => handleRemoveSound(index)}
                index={index}
                cubeColor={sound ? getCategoryColor(sound.category) : APP_CONFIG.DEFAULT_CUBE_COLOR}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Soundboard;
