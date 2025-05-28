
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Soundboard from '../components/Soundboard';
import SoundLibrary from '../components/SoundLibrary';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Sound {
  id: string;
  title: string;
  filename: string;
  tags: string[];
  hidden_tags: string[];
  category: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('soundboard');
  const [soundboardSounds, setSoundboardSounds] = useLocalStorage<(Sound | null)[]>('soundboard', new Array(8).fill(null));

  const handleAddToSoundboard = (sound: Sound): boolean => {
    const emptyIndex = soundboardSounds.findIndex(s => s === null);
    if (emptyIndex !== -1) {
      const newSounds = [...soundboardSounds];
      newSounds[emptyIndex] = sound;
      setSoundboardSounds(newSounds);
      return true;
    }
    return false;
  };

  const handleSupportCreator = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              🔊 לוח הצלילים
            </h1>
            
            <Button 
              onClick={handleSupportCreator}
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium"
            >
              ❤️ תמכו ביוצר
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white shadow-sm border-b">
            <TabsList className="h-12 w-full bg-transparent p-0">
              <TabsTrigger 
                value="soundboard" 
                className="flex-1 h-full rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 font-medium"
              >
                לוח הצלילים
              </TabsTrigger>
              <TabsTrigger 
                value="library" 
                className="flex-1 h-full rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 font-medium"
              >
                ספריית צלילים
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="soundboard" className="mt-0">
            <Soundboard />
          </TabsContent>

          <TabsContent value="library" className="mt-0">
            <SoundLibrary onAddToSoundboard={handleAddToSoundboard} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
