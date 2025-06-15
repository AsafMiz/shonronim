import React, { useState, useEffect } from 'react';
import catalogData from '../assets/catalog.json';
import { Button } from '@/components/ui/button';
import { log } from 'console';

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_title: string;
  link: string;
  isShown: boolean;
}

const AUTO_SCROLL_INTERVAL = 10000;

const CatalogCarousel: React.FC = () => {
  const catalogItems: CatalogItem[] = catalogData.filter(item => item.isShown);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (catalogItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % catalogItems.length);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [catalogItems.length]);

  const handleItemClick = (link: string) => {
    window.open(link, '_blank');
  };

  if (!catalogItems || catalogItems.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto relative z-0">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-right">עוד רימטומים</h3>

      <div className="overflow-hidden relative w-full">
        <div className="flex transition-transform duration-500 ease-in-out">
          {(() => {
            const currentItem = catalogItems[currentIndex];
            if (!currentItem) return null;
            
            return (
              <div className="w-full flex-shrink-0 px-2">
                <div
                  className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer relative z-0"
                  onClick={() => handleItemClick(currentItem.link)}
                >
                  <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {/* Blurred Background */}
                    <img
                      src={currentItem.image_url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
                      aria-hidden="true"
                    />

                    {/* Foreground image */}
                    <div className="relative z-10 flex items-center justify-center w-full h-full bg-black/20">
                      <img
                        src={currentItem.image_url}
                        alt={currentItem.title}
                        className="max-w-full max-h-full object-contain relative z-10"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="text-center text-gray-100"><p class="text-sm">כת השונרונים</p></div>';
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-4 relative z-20">
                    <h4 className="font-semibold text-gray-800 mb-1">{currentItem.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{currentItem.description}</p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(currentItem.link);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white relative z-20"
                    >
                      {currentItem.button_title}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4 relative z-10">
        {catalogItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogCarousel;
