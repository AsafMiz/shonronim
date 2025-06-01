
import React, { useState, useEffect } from 'react';
import SoundCube from './SoundCube';
import SoundLibrary from './SoundLibrary';
import { useLocalStorage } from '../hooks/useLocalStorage';
import soundsData from '../assets/sounds.json';
import categoriesData from '../assets/categories.json';

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

const Soundboard: React.FC = () => {
  console.log('Soundboard rendered');
  
  const [soundboardSounds, setSoundboardSounds] = useLocalStorage<(Sound | null)[]>('soundboard', new Array(6).fill(null));
  const [showLibrary, setShowLibrary] = useState(false);
  const [targetCubeIndex, setTargetCubeIndex] = useState<number | null>(null);

  const sounds: Sound[] = soundsData;
  const categories: Category[] = categoriesData;
  console.log('Soundboard sounds loaded:', sounds);

  // Default color for empty cubes
  const defaultCubeColor = 'bg-gray-300';

  // Function to get category color by category ID
  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : defaultCubeColor;
  };

  // Initialize with random sounds on first visit - but allow all empty cubes
  useEffect(() => {
    console.log('Soundboard: useEffect: checking first visit');
    const hasBeenInitialized = localStorage.getItem('soundboard_initialized');
    console.log('Soundboard: Has been initialized:', hasBeenInitialized);
    
    if (!hasBeenInitialized) {
      try {
        const shuffledSounds = [...sounds].sort(() => Math.random() - 0.5);
        const initialSounds = new Array(6).fill(null);
        
        // Fill first 4 positions with random sounds
        for (let i = 0; i < 4 && i < shuffledSounds.length; i++) {
          initialSounds[i] = shuffledSounds[i];
        }
        
        console.log('Soundboard: Setting initial sounds:', initialSounds);
        setSoundboardSounds(initialSounds);
        localStorage.setItem('soundboard_initialized', 'true');
      } catch (error) {
        console.error('Soundboard: Exception in useEffect initialization:', error);
      }
    }
  }, [sounds, setSoundboardSounds]);

  const handleAddSound = (cubeIndex: number) => {
    console.log('Soundboard handleAddSound called', { cubeIndex });
    try {
      setTargetCubeIndex(cubeIndex);
      setShowLibrary(true);
    } catch (error) {
      console.error('Soundboard: Exception in handleAddSound:', error);
    }
  };

  const handleRemoveSound = (cubeIndex: number) => {
    console.log('Soundboard handleRemoveSound called', { cubeIndex });
    try {
      const newSounds = [...soundboardSounds];
      newSounds[cubeIndex] = null;
      setSoundboardSounds(newSounds);
    } catch (error) {
      console.error('Soundboard: Exception in handleRemoveSound:', error);
    }
  };

  const handleAddToSoundboard = (sound: Sound): boolean => {
    console.log('Soundboard handleAddToSoundboard called', { sound, targetCubeIndex });
    
    try {
      if (targetCubeIndex !== null) {
        const newSounds = [...soundboardSounds];
        newSounds[targetCubeIndex] = sound;
        setSoundboardSounds(newSounds);
        setShowLibrary(false);
        setTargetCubeIndex(null);
        console.log('Soundboard: Added sound to specific cube:', targetCubeIndex);
        return true;
      }

      // Find first empty cube
      const emptyIndex = soundboardSounds.findIndex(s => s === null);
      if (emptyIndex !== -1) {
        const newSounds = [...soundboardSounds];
        newSounds[emptyIndex] = sound;
        setSoundboardSounds(newSounds);
        console.log('Soundboard: Added sound to first empty cube:', emptyIndex);
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
            ← חזרה ללוח הצלילים
          </button>
        </div>
        <SoundLibrary onAddToSoundboard={handleAddToSoundboard} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col" dir="rtl">
      <div className="p-2 sm:p-4 text-center">
        <p className="text-sm text-gray-600">לחץ על הקוביות לנגן צלילים או הוסף חדשים</p>
      </div>

      <div className="flex-1 px-2 sm:px-4 pb-2 sm:pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 h-full max-w-4xl mx-auto">
          {soundboardSounds.map((sound, index) => (
            <SoundCube
              key={index}
              sound={sound}
              onAddSound={() => handleAddSound(index)}
              onRemoveSound={() => handleRemoveSound(index)}
              index={index}
              cubeColor={sound ? getCategoryColor(sound.category) : defaultCubeColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Soundboard;
