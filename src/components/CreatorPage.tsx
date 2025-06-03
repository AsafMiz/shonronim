
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram } from 'lucide-react';
import CatalogCarousel from './CatalogCarousel';

const CreatorPage: React.FC = () => {
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/taichovitz/?hl=he', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Instagram Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800"> האינסטגרם של שון ורון</h2>
              <p className="text-gray-600">@taichovitz</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            מחפשים את שאלת הסקר או את לחיצת היד הרשמית של הכת?
          </p>
          
          <Button 
            onClick={handleInstagramClick}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Instagram className="w-4 h-4 ml-2" />
            עברו לעמוד האינסטגרם
            <ExternalLink className="w-4 h-4 mr-2" />
          </Button>
        </div>

        {/* Catalog Carousel Section */}
        <CatalogCarousel />

        {/* About the Creator Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">רוצים עוד קטעים?</h3>
          
          <div className="space-y-4 text-gray-700">
            <p>
              ברוכים הבאים ללוח הצלילים של כת השונרונים! 🎵
            </p>
            <p>
              כל הצלילים נאספו בקפידה ועובדו במיוחד עבור החוויה הטובה ביותר שלכם.
            </p>
            <p>
              תהנו מהשימוש ואל תשכחו לשתף עם חברים! 😄
            </p>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                💡 רעיון לשיפור? הצעה לצליל חדש?
              </p>
              <p className="text-blue-700 mt-1">
                פנו אלי דרך הכפתור "תמכו ביוצר"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;
