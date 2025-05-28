
import React, { useState, useEffect } from 'react';
import SoundCube from './SoundCube';
import SoundLibrary from './SoundLibrary';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Slider } from '@/components/ui/slider';
import { Volume2 } from 'lucide-react';
import soundsData from '../data/sounds.json';

interface Sound {
  id: string;
  title: string;
  filename: string;
  tags: string[];
  hidden_tags: string[];
  category: string;
}

const Soundboard: React.FC = () => {
  console.log('Soundboard rendered');
  
  const [soundboardSounds, setSoundboardSounds] = useLocalStorage<(Sound | null)[]>('soundboard', new Array(8).fill(null));
  const [showLibrary, setShowLibrary] = useState(false);
  const [targetCubeIndex, setTargetCubeIndex] = useState<number | null>(null);
  const [globalVolume, setGlobalVolume] = useLocalStorage<number>('globalVolume', 70);

  const sounds: Sound[] = soundsData;
  console.log('Soundboard sounds loaded:', sounds);

  // Color palette for cubes - each cube gets a unique color when filled
  const cubeColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-yellow-500 to-orange-600',
    'from-purple-500 to-pink-600',
    'from-cyan-500 to-blue-600'
  ];

  // Initialize with random sounds on first visit - but allow all empty cubes
  useEffect(() => {
    console.log('useEffect: checking first visit');
    const hasBeenInitialized = localStorage.getItem('soundboard_initialized');
    console.log('Has been initialized:', hasBeenInitialized);
    
    if (!hasBeenInitialized) {
      try {
        const shuffledSounds = [...sounds].sort(() => Math.random() - 0.5);
        const initialSounds = new Array(8).fill(null);
        
        // Fill first 4 positions with random sounds
        for (let i = 0; i < 4 && i < shuffledSounds.length; i++) {
          initialSounds[i] = shuffledSounds[i];
        }
        
        console.log('Setting initial sounds:', initialSounds);
        setSoundboardSounds(initialSounds);
        localStorage.setItem('soundboard_initialized', 'true');
      } catch (error) {
        console.error('Exception in useEffect initialization:', error);
      }
    }
  }, [sounds, setSoundboardSounds]);

  const handleAddSound = (cubeIndex: number) => {
    console.log('handleAddSound called', { cubeIndex });
    try {
      setTargetCubeIndex(cubeIndex);
      setShowLibrary(true);
    } catch (error) {
      console.error('Exception in handleAddSound:', error);
    }
  };

  const handleRemoveSound = (cubeIndex: number) => {
    console.log('handleRemoveSound called', { cubeIndex });
    try {
      const newSounds = [...soundboardSounds];
      newSounds[cubeIndex] = null;
      setSoundboardSounds(newSounds);
    } catch (error) {
      console.error('Exception in handleRemoveSound:', error);
    }
  };

  const handleAddToSoundboard = (sound: Sound): boolean => {
    console.log('handleAddToSoundboard called', { sound, targetCubeIndex });
    
    try {
      if (targetCubeIndex !== null) {
        const newSounds = [...soundboardSounds];
        newSounds[targetCubeIndex] = sound;
        setSoundboardSounds(newSounds);
        setShowLibrary(false);
        setTargetCubeIndex(null);
        console.log('Added sound to specific cube:', targetCubeIndex);
        return true;
      }

      // Find first empty cube
      const emptyIndex = soundboardSounds.findIndex(s => s === null);
      if (emptyIndex !== -1) {
        const newSounds = [...soundboardSounds];
        newSounds[emptyIndex] = sound;
        setSoundboardSounds(newSounds);
        console.log('Added sound to first empty cube:', emptyIndex);
        return true;
      }

      console.log('No empty cubes available');
      return false; // No empty cubes
    } catch (error) {
      console.error('Exception in handleAddToSoundboard:', error);
      return false;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    console.log('handleVolumeChange called', { value });
    try {
      setGlobalVolume(value[0]);
    } catch (error) {
      console.error('Exception in handleVolumeChange:', error);
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
    <div className="p-4 max-w-4xl mx-auto" dir="rtl">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">לוח הצלילים שלי</h2>
          <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
            <Volume2 className="w-4 h-4 text-gray-600" />
            <div className="w-24">
              <Slider
                value={[globalVolume]}
                onValueChange={handleVolumeChange}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
            <span className="text-sm text-gray-600 min-w-8">{globalVolume}%</span>
          </div>
        </div>
        <p className="text-gray-600">לחץ על הקוביות לנגן צלילים או הוסף חדשים</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {soundboardSounds.map((sound, index) => (
          <SoundCube
            key={index}
            sound={sound}
            onAddSound={() => handleAddSound(index)}
            onRemoveSound={() => handleRemoveSound(index)}
            index={index}
            cubeColor={cubeColors[index]}
            globalVolume={globalVolume}
          />
        ))}
      </div>
    </div>
  );
};

export default Soundboard;
