import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share } from 'lucide-react';
import Soundboard from '../components/Soundboard';
import SoundLibrary from '../components/SoundLibrary';
import CreatorPage from '../components/CreatorPage';
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

const Index = () => {
  const [activeTab, setActiveTab] = useState('soundboard');
  const [soundboardSounds, setSoundboardSounds] = useLocalStorage<(Sound | null)[]>(
    APP_CONFIG.STORAGE_KEYS.SOUNDBOARD, 
    new Array(APP_CONFIG.SOUNDBOARD_CUBES_COUNT).fill(null)
  );

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

  const handleShareApp = async () => {
    const shareData = {
      title: APP_CONFIG.STRINGS.APP_TITLE,
      text: APP_CONFIG.STRINGS.SHARE_APP_TEXT,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to WhatsApp
        const text = `${shareData.text} ${shareData.url}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {APP_CONFIG.STRINGS.APP_TITLE}
            </h1>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleShareApp}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 font-medium"
              >
                <Share className="w-4 h-4 ml-1" />
                {APP_CONFIG.STRINGS.SHARE_BUTTON}
              </Button>
              <Button 
                onClick={handleSupportCreator}
                className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium"
              >
                {APP_CONFIG.STRINGS.SUPPORT_CREATOR}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white shadow-sm border-b">
            <TabsList className="h-12 w-full bg-transparent p-0">
              <TabsTrigger 
                value="library" 
                className="flex-1 h-full rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 font-medium text-sm"
              >
                {APP_CONFIG.STRINGS.TAB_LIBRARY}
              </TabsTrigger>
              <TabsTrigger 
                value="soundboard" 
                className="flex-1 h-full rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 font-medium text-sm"
              >
                {APP_CONFIG.STRINGS.TAB_SOUNDBOARD}
              </TabsTrigger>
              <TabsTrigger 
                value="creator" 
                className="flex-1 h-full rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 font-medium text-sm"
              >
                {APP_CONFIG.STRINGS.TAB_CREATOR}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="soundboard" className="mt-0">
            <Soundboard />
          </TabsContent>

          <TabsContent value="library" className="mt-0">
            <SoundLibrary 
              onAddToSoundboard={handleAddToSoundboard} 
              soundboardSounds={soundboardSounds}
            />
          </TabsContent>

          <TabsContent value="creator" className="mt-0">
            <CreatorPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
