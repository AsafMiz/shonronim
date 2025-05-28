
import React, { useState, useEffect } from 'react';
import SoundCube from './SoundCube';
import SoundLibrary from './SoundLibrary';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
  const [soundboardSounds, setSoundboardSounds] = useLocalStorage<(Sound | null)[]>('soundboard', new Array(8).fill(null));
  const [showLibrary, setShowLibrary] = useState(false);
  const [targetCubeIndex, setTargetCubeIndex] = useState<number | null>(null);

  const sounds: Sound[] = soundsData;

  // Initialize with random sounds on first visit
  useEffect(() => {
    const isFirstVisit = soundboardSounds.every(sound => sound === null);
    if (isFirstVisit) {
      const shuffledSounds = [...sounds].sort(() => Math.random() - 0.5);
      const initialSounds = new Array(8).fill(null);
      
      // Fill first 4 positions with random sounds
      for (let i = 0; i < 4 && i < shuffledSounds.length; i++) {
        initialSounds[i] = shuffledSounds[i];
      }
      
      setSoundboardSounds(initialSounds);
    }
  }, [sounds, soundboardSounds, setSoundboardSounds]);

  const handleAddSound = (cubeIndex: number) => {
    setTargetCubeIndex(cubeIndex);
    setShowLibrary(true);
  };

  const handleRemoveSound = (cubeIndex: number) => {
    const newSounds = [...soundboardSounds];
    newSounds[cubeIndex] = null;
    setSoundboardSounds(newSounds);
  };

  const handleAddToSoundboard = (sound: Sound): boolean => {
    if (targetCubeIndex !== null) {
      const newSounds = [...soundboardSounds];
      newSounds[targetCubeIndex] = sound;
      setSoundboardSounds(newSounds);
      setShowLibrary(false);
      setTargetCubeIndex(null);
      return true;
    }

    // Find first empty cube
    const emptyIndex = soundboardSounds.findIndex(s => s === null);
    if (emptyIndex !== -1) {
      const newSounds = [...soundboardSounds];
      newSounds[emptyIndex] = sound;
      setSoundboardSounds(newSounds);
      return true;
    }

    return false; // No empty cubes
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">לוח הצלילים שלי</h2>
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
          />
        ))}
      </div>
    </div>
  );
};

export default Soundboard;
