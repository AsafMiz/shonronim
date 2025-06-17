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
  'jerry',
  'ilana',
  'razi',
  'kapitolnik',
  'uri_gavriel'
];

/**
 * Dynamically loads all categories from individual category.json files
 */
export const loadAllCategories = async (): Promise<Category[]> => {
  try {
    // Load all categories in parallel for better performance
    const categoryPromises = CATEGORY_DIRECTORIES.map(async (categoryDir) => {
      try {
        const response = await fetch(`/sounds/${categoryDir}/category.json`);
        if (response.ok) {
          const category: Category = await response.json();
          return category.isShown ? category : null;
        } else {
          console.warn(`Failed to load category: ${categoryDir}`);
          return null;
        }
      } catch (error) {
        console.error(`Error loading category ${categoryDir}:`, error);
        return null;
      }
    });

    const results = await Promise.all(categoryPromises);
    return results.filter((category): category is Category => category !== null);
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
  try {
    // Load all sounds in parallel for better performance
    const soundPromises = CATEGORY_DIRECTORIES.map(async (category) => {
      try {
        const response = await fetch(`/sounds/${category}/sounds.json`);
        if (response.ok) {
          const categorySounds: Sound[] = await response.json();
          return categorySounds;
        } else {
          console.warn(`Failed to load sounds for category: ${category}`);
          return [];
        }
      } catch (error) {
        console.error(`Error loading sounds for category ${category}:`, error);
        return [];
      }
    });

    const results = await Promise.all(soundPromises);
    return results.flat(); // Flatten all category sounds into a single array
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