
import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import catalogData from '../assets/catalog.json';

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_title: string;
  link: string;
}

const CatalogCarousel: React.FC = () => {
  const catalogItems: CatalogItem[] = catalogData;

  if (!catalogItems || catalogItems.length === 0) {
    return null;
  }

  const handleItemClick = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">המוצרים שלנו</h3>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {catalogItems.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <div 
                className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
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
                        parent.innerHTML = '<div class="text-center text-gray-600"><p class="text-sm">תמונת תצוגה מקדימה</p></div>';
                      }
                    }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CatalogCarousel;
