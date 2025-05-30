
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram } from 'lucide-react';

const CreatorPage: React.FC = () => {
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/taichovitz/?hl=he', '_blank');
  };

  const handleLatestPostClick = () => {
    // This would ideally fetch the latest post, but for now we'll link to the profile
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
              <h2 className="text-xl font-bold text-gray-800">עמוד האינסטגרם</h2>
              <p className="text-gray-600">@taichovitz</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            עקבו אחרי היוצר באינסטגרם לעוד תוכן מצחיק ומעודכן!
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

        {/* Latest Post Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">הפוסט האחרון</h3>
          
          {/* Instagram Post Preview */}
          <div className="mb-4 border rounded-lg overflow-hidden bg-gray-50">
            <div className="p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-800">taichovitz</span>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <Instagram className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">תמונת התצוגה המקדימה של הפוסט</p>
              </div>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-700">
                צפו בתוכן החדש ביותר מהיוצר...
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleLatestPostClick}
            variant="outline"
            className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            <Instagram className="w-4 h-4 ml-2" />
            צפו בפוסט האחרון
            <ExternalLink className="w-4 h-4 mr-2" />
          </Button>
        </div>

        {/* About the Creator Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">אודות היוצר</h3>
          
          <div className="space-y-4 text-gray-700">
            <p>
              ברוכים הבאים ללוח הצלילים של שונרונים! 🎵
            </p>
            
            <p>
              האפליקציה הזו נוצרה כדי להביא לכם את הציטוטים והצלילים הכי מצחיקים 
              מהעולם הישראלי באופן נגיש ומהנה.
            </p>
            
            <p>
              כל הצלילים נאספו בקפידה ועובדו במיוחד עבור החוויה הטובה ביותר שלכם.
              תהנו מהשימוש ואל תשכחו לשתף עם חברים! 😄
            </p>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                💡 רעיון לשיפור? הצעה לצליל חדש?
              </p>
              <p className="text-blue-700 mt-1">
                פנו אלינו באינסטגרם ונשמח לשמוע מכם!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;
