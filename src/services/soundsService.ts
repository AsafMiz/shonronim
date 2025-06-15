interface Sound {
  title: string;
  filename: string;
  tags: string[];
  hidden_tags: string[];
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  isShown: boolean;
}

// List of all category directories
const CATEGORY_DIRECTORIES = [
  'brano',
  'peres', 
  'berko',
  'jamil',
  'dorit',
  'shon',
  'sheftel',
  'gamliel',
  'netali',
  'otot',
  'jerry'
];

/**
 * Dynamically loads all sounds from individual JSON files in each category directory
 */
export const loadAllSounds = async (): Promise<Sound[]> => {
  const allSounds: Sound[] = [];
  
  try {
    // Load sounds from each category directory
    for (const category of CATEGORY_DIRECTORIES) {
      try {
        const response = await fetch(`/sounds/${category}/sounds.json`);
        if (response.ok) {
          const categorySounds: Sound[] = await response.json();
          allSounds.push(...categorySounds);
        } else {
          console.warn(`Failed to load sounds for category: ${category}`);
        }
      } catch (error) {
        console.error(`Error loading sounds for category ${category}:`, error);
      }
    }
    
    return allSounds;
  } catch (error) {
    console.error('Error loading sounds:', error);
    return [];
  }
};

/**
 * Loads sounds for a specific category
 */
export const loadSoundsForCategory = async (category: string): Promise<Sound[]> => {
  try {
    const response = await fetch(`/sounds/${category}/sounds.json`);
    if (response.ok) {
      return await response.json();
    } else {
      console.warn(`Failed to load sounds for category: ${category}`);
      return [];
    }
  } catch (error) {
    console.error(`Error loading sounds for category ${category}:`, error);
    return [];
  }
};

/**
 * Gets all available categories
 */
export const getAvailableCategories = (): string[] => {
  return CATEGORY_DIRECTORIES;
}; 