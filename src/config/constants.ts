
export const APP_CONFIG = {
  // Soundboard configuration
  SOUNDBOARD_CUBES_COUNT: 6,
  INITIAL_FILLED_CUBES: 4,
  
  // UI strings
  STRINGS: {
    APP_TITLE: '🔊 כת שונרונים',
    SOUNDBOARD_INSTRUCTIONS: 'לחץ על הקוביות לנגן צלילים או הוסף חדשים',
    BACK_TO_SOUNDBOARD: '← חזרה ללוח הצלילים',
    SOUND_LIBRARY_TITLE: 'ספריית צלילים',
    SEARCH_PLACEHOLDER: 'חיפוש צלילים...',
    ALL_CATEGORIES: 'הכל',
    NO_SOUNDS_FOUND: 'לא נמצאו צלילים התואמים לחיפוש',
    NO_EMPTY_CUBES: 'אין קוביות פנויות בלוח הצלילים',
    SHARE_BUTTON: 'שתף',
    SUPPORT_CREATOR: '❤️ תמכו ביוצר',
    SHARE_SOUND_TEXT: '🔊 תשמע את הצליל הזה: ',
    SHARE_APP_TEXT: '🔊 בואו תשמעו את לוח הצלילים הכי מגניב!',
    
    // Tab names
    TAB_LIBRARY: 'ספריית צלילים',
    TAB_SOUNDBOARD: 'לוח הצלילים',
    TAB_CREATOR: 'על היוצר'
  },
  
  // Default values
  DEFAULT_CUBE_COLOR: 'bg-red-300',
  DEFAULT_GLOBAL_VOLUME: 70,
  SOUNDS_DIRECTORY: 'sounds/',
  
  // Grid configuration
  GRID_CLASSES: {
    SOUNDBOARD: 'grid-cols-2 sm:grid-cols-3',
    LIBRARY: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  },
  
  // Local storage keys
  STORAGE_KEYS: {
    SOUNDBOARD: 'soundboard',
    INITIALIZED: 'soundboard_initialized',
    GLOBAL_VOLUME: 'globalVolume'
  }
};
