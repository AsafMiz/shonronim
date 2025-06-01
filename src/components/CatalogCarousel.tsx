
import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import catalogData from '../assets/catalog.json';

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_title: string;
  link: string;
  isShown: boolean;
}

const CatalogCarousel: React.FC = () => {
  const catalogItems: CatalogItem[] = catalogData.filter(item => item.isShown);

  if (!catalogItems || catalogItems.length === 0) {
    return null;
  }

  const handleItemClick = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mx-4 sm:mx-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{APP_CONFIG.STRINGS.CATALOG_TITLE || 'המוצרים שלנו'}</h3>
      
      <Carousel
        opts={{
          align: "center",
          loop: true,
          direction: "rtl",
        }}
        className="w-full"
      >
        <CarouselContent className="gap-2 sm:gap-4">
          {catalogItems.map((item) => (
            <CarouselItem key={item.id} className="basis-4/5 sm:basis-1/2 lg:basis-1/3 min-w-0">
              <div 
                className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 h-full"
                onClick={() => handleItemClick(item.link)}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-center text-gray-600 p-4"><p class="text-sm">תמונת תצוגה מקדימה</p></div>';
                      }
                    }}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{item.description}</p>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item.link);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2"
                    size="sm"
                  >
                    {item.button_title}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Minimalistic design with dots only - dots are automatically shown by Embla Carousel */}
      </Carousel>
    </div>
  );
};

export default CatalogCarousel;
