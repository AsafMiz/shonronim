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
    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-right">עוד רינטומים</h3>

      <div className="overflow-hidden relative w-full">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)`, width: `${catalogItems.length * 100}%` }}
        >
          {catalogItems.map((item) => (
            <div
              key={item.id}
              className="w-full flex-shrink-0 px-2"
              style={{ width: `${100 / catalogItems.length}%` }}
            >
              <div
                className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleItemClick(item.link)}
              >
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {/* Blurred Background */}
                  <img
                    src={item.image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
                    aria-hidden="true"
                  />

                  {/* Foreground image */}
                  <div className="relative z-10 flex items-center justify-center w-full h-full bg-black/20">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain"
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
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item.link);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {item.button_title}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
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
