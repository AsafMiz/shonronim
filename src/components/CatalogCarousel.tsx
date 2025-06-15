import React, { useState, useEffect, useRef, useCallback } from 'react';
import catalogData from '../assets/catalog.json';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_title: string;
  link: string;
  isShown: boolean;
}

const AUTO_SCROLL_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50; // Minimum distance for swipe

const CatalogCarousel: React.FC = () => {
  const catalogItems: CatalogItem[] = catalogData.filter(item => item.isShown);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (catalogItems.length <= 1 || !isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % catalogItems.length);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [catalogItems.length, isAutoScrolling]);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % catalogItems.length);
    setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [catalogItems.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + catalogItems.length) % catalogItems.length);
    setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [catalogItems.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, []);

  // Touch event handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > SWIPE_THRESHOLD;
    const isRightSwipe = distance < -SWIPE_THRESHOLD;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, goToNext, goToPrevious]);

  const handleItemClick = useCallback((link: string) => {
    window.open(link, '_blank');
  }, []);

  if (!catalogItems || catalogItems.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 max-w-4xl mx-auto relative z-0">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 text-right">עוד רימטומים</h3>

      <div 
        ref={carouselRef}
        className="overflow-hidden relative w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation arrows - hidden on mobile, visible on desktop */}
        <button
          onClick={goToPrevious}
          className="hidden md:flex absolute left-2 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
          aria-label="Previous item"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-2 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
          aria-label="Next item"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex transition-transform duration-300 ease-out">
          {(() => {
            const currentItem = catalogItems[currentIndex];
            if (!currentItem) return null;
            
            return (
              <div className="w-full flex-shrink-0 px-1 md:px-2">
                <div
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative z-0"
                  onClick={() => handleItemClick(currentItem.link)}
                >
                  <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {/* Blurred Background */}
                    <img
                      src={currentItem.image_url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
                      aria-hidden="true"
                      loading="lazy"
                    />

                    {/* Foreground image */}
                    <div className="relative z-10 flex items-center justify-center w-full h-full bg-black/20">
                      <img
                        src={currentItem.image_url}
                        alt={currentItem.title}
                        className="max-w-full max-h-full object-contain relative z-10"
                        loading="lazy"
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
                  <div className="p-3 md:p-4 relative z-20">
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">{currentItem.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{currentItem.description}</p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(currentItem.link);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white relative z-20 text-sm"
                      size="sm"
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
            onClick={() => goToIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              currentIndex === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to item ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile swipe hint */}
      <div className="text-center text-xs text-gray-500 mt-2 md:hidden">
        החלק ימינה או שמאלה לגלילה
      </div>
    </div>
  );
};

export default CatalogCarousel;
