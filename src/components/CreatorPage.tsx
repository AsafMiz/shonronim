import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram, Palette, Globe } from 'lucide-react';
import CatalogCarousel from './CatalogCarousel';

// Telegram SVG icon (since Lucide doesn't have one by default)
const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="#229ED9" />
    <path d="M17.924 7.618c.13-.53-.2-.77-.68-.6l-11.1 4.28c-.53.21-.52.5-.09.63l2.85.89 1.09 3.36c.14.39.26.54.53.54.27 0 .38-.13.52-.39l1.3-2.12 2.7 1.99c.5.28.86.13.99-.46l1.8-8.12zm-7.1 5.1l5.44-3.42c.26-.16.5-.07.3.1l-4.66 4.2-.18 2.02-.9-2.9z" fill="#fff" />
  </svg>
);

const CreatorPage: React.FC = () => {
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/taichovitz/?hl=he', '_blank');
  };
  const handleTelegramClick = () => {
    window.open('https://t.me/ShonRonBot', '_blank');
  };
  const handleSketchesClick = () => {
    window.open('https://shon-ron.lovable.app/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Catalog Carousel Section */}
        <CatalogCarousel />

        {/* Telegram Banner Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <TelegramIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">הבוט של שון ורון בטלגרם</h2>
            <p className="text-gray-600">ShonRonBot by NX1X@</p>
            <p className="text-gray-700 mt-2 text-sm">הצטרפו לבוט בטלגרם וקבלו גישה מהירה לדמויות, חידות, עדכונים, ועוד!</p>
            <Button 
              onClick={handleTelegramClick}
              className="w-full mt-3 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white"
            >
              <TelegramIcon className="w-4 h-4 ml-2" />
              עברו לבוט בטלגרם
              <ExternalLink className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>

        {/* Sketches Website Banner Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">מערכונים לפי דמויות</h2>
            <p className="text-gray-600">shon-ron.lovable.app</p>
            <p className="text-gray-700 mt-2 text-sm">מחפשים מערכון לפי דמויות של שון ורון?</p>
            <Button 
              onClick={handleSketchesClick}
              className="w-full mt-3 bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white"
            >
              <Globe className="w-4 h-4 ml-2" />
              עברו לאתר
              <ExternalLink className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>

        {/* About the Creator Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">קודם כל לבריאות!</h3>
          
          <div className="space-y-4 text-gray-700">
            <p>
             כל הקרדיט והתודה האמיתית היא לצוות התוכנית <b>טייכר וזרחוביץ׳</b>!
            </p>
            <p>
              האפליקציה נוצרה ע״י חברי כת השונרונים במטרה לאפשר לקהילה להטריל בכל זמן ובכל מקום.
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

        {/* Credits Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center" >תודה מיוחדת לביילנדוס</h3>
          
          <div className="space-y-3 text-center">
            <p className="text-gray-700 font-medium" dir="ltr">Guy מיץ קוברות M</p>
            <p className="text-gray-700 font-medium" dir="ltr">iftachl הבנדיט מאירליש</p>
            <p className="text-gray-700 font-medium" dir="ltr">Arik חלב אריות Levy</p>
            <p className="text-gray-700 font-medium" dir="ltr">Eden השומפלבי הטוב Portnoy</p>
            <p className="text-gray-700 font-medium" dir="ltr">Lior ההוא מהחבובות Shinekop</p>
          </div>
        </div>

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
            מחפשים את שאלת הסקר? רוצים לשלוח עסקים לפליקס?
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
      </div>
    </div>
  );
};

export default CreatorPage;
