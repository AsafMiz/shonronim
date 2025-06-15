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
 * Dynamically loads all categories from individual category.json files
 */
export const loadAllCategories = async (): Promise<Category[]> => {
  const allCategories: Category[] = [];
  
  try {
    // Load category from each directory
    for (const categoryDir of CATEGORY_DIRECTORIES) {
      try {
        const response = await fetch(`/sounds/${categoryDir}/category.json`);
        if (response.ok) {
          const category: Category = await response.json();
          if (category.isShown) {
            allCategories.push(category);
          }
        } else {
          console.warn(`Failed to load category: ${categoryDir}`);
        }
      } catch (error) {
        console.error(`Error loading category ${categoryDir}:`, error);
      }
    }
    
    return allCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
};

/**
 * Loads a specific category by directory name
 */
export const loadCategory = async (categoryDir: string): Promise<Category | null> => {
  try {
    const response = await fetch(`/sounds/${categoryDir}/category.json`);
    if (response.ok) {
      return await response.json();
    } else {
      console.warn(`Failed to load category: ${categoryDir}`);
      return null;
    }
  } catch (error) {
    console.error(`Error loading category ${categoryDir}:`, error);
    return null;
  }
};

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