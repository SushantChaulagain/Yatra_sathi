export interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  experience: string;
  completedTreks: number;
  bio: string;
  interests: string[];
  nextTrek: string;
  availability: string;
  languages: string[];
  userId: string;
  rating?: number;
  avatar?: string;
  createdAt: string;
}

const PROFILES_KEY = 'trekker_profiles';

export const profileStorage = {
  // Get all profiles
  getAllProfiles(): UserProfile[] {
    try {
      const profiles = localStorage.getItem(PROFILES_KEY);
      return profiles ? JSON.parse(profiles) : [];
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  },

  // Get current user's profile
  getCurrentUserProfile(userId: string): UserProfile | null {
    const profiles = this.getAllProfiles();
    return profiles.find(profile => profile.userId === userId) || null;
  },

  // Save or update a profile
  saveProfile(profile: UserProfile): void {
    try {
      const profiles = this.getAllProfiles();
      const existingIndex = profiles.findIndex(p => p.userId === profile.userId);
      
      const profileWithDefaults = {
        ...profile,
        id: profile.id || this.generateId(),
        rating: profile.rating || this.calculateInitialRating(profile),
        avatar: profile.avatar || this.generateAvatar(),
        createdAt: profile.createdAt || new Date().toISOString()
      };

      if (existingIndex >= 0) {
        // Update existing profile
        profiles[existingIndex] = { ...profiles[existingIndex], ...profileWithDefaults };
      } else {
        // Add new profile
        profiles.push(profileWithDefaults);
      }

      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving profile:', error);
      throw new Error('Failed to save profile');
    }
  },

  // Delete a profile
  deleteProfile(userId: string): void {
    try {
      const profiles = this.getAllProfiles();
      const filteredProfiles = profiles.filter(profile => profile.userId !== userId);
      localStorage.setItem(PROFILES_KEY, JSON.stringify(filteredProfiles));
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete profile');
    }
  },

  // Get other users' profiles (excluding current user)
  getOtherProfiles(currentUserId: string): UserProfile[] {
    const allProfiles = this.getAllProfiles();
    return allProfiles.filter(profile => profile.userId !== currentUserId);
  },

  // Helper function to generate unique ID
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Calculate initial rating based on experience
  calculateInitialRating(profile: UserProfile): number {
    let rating = 4.0; // Base rating
    
    // Adjust based on experience
    if (profile.experience === 'Advanced') rating += 0.5;
    if (profile.experience === 'Beginner') rating += 0.3;
    
    // Adjust based on completed treks
    if (profile.completedTreks > 20) rating += 0.3;
    else if (profile.completedTreks > 10) rating += 0.2;
    else if (profile.completedTreks > 5) rating += 0.1;
    
    // Add some randomness to make it realistic
    rating += (Math.random() - 0.5) * 0.4;
    
    return Math.min(5.0, Math.max(3.5, Math.round(rating * 10) / 10));
  },

  // Generate a random avatar placeholder
  generateAvatar(): string {
    const avatars = [
      'photo-1494790108755-2616b612b786',
      'photo-1507003211169-0a1dd7228f2d',
      'photo-1438761681033-6461ffad8d80',
      'photo-1472099645785-5658abf4ff4e',
      'photo-1489424731084-a5d8b219a5bb',
      'photo-1500648767791-00dcc994a43e',
      'photo-1615729947596-a598e5de0ab3',
      'photo-1426604966848-d7adac402bff'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  },

  // Check if user has a profile
  hasProfile(userId: string): boolean {
    return this.getCurrentUserProfile(userId) !== null;
  },

  // Get profiles with search and filter
  searchProfiles(currentUserId: string, searchTerm: string = '', filters: any = {}): UserProfile[] {
    let profiles = this.getOtherProfiles(currentUserId);

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      profiles = profiles.filter(profile =>
        profile.name.toLowerCase().includes(term) ||
        profile.location.toLowerCase().includes(term) ||
        profile.nextTrek.toLowerCase().includes(term) ||
        profile.interests.some(interest => interest.toLowerCase().includes(term))
      );
    }

    // Experience filter
    if (filters.experience && filters.experience !== 'all') {
      profiles = profiles.filter(profile => 
        profile.experience.toLowerCase() === filters.experience
      );
    }

    // Location filter
    if (filters.location && filters.location !== 'all') {
      profiles = profiles.filter(profile => 
        profile.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Age filter
    if (filters.ageGroup && filters.ageGroup !== 'all') {
      profiles = profiles.filter(profile => {
        if (filters.ageGroup === '20s') return profile.age >= 20 && profile.age < 30;
        if (filters.ageGroup === '30s') return profile.age >= 30 && profile.age < 40;
        if (filters.ageGroup === '40s') return profile.age >= 40;
        return true;
      });
    }

    return profiles;
  },

  // Initialize with some sample data for demonstration
  initializeSampleData(): void {
    const existing = this.getAllProfiles();
    if (existing.length === 0) {
      const sampleProfiles: UserProfile[] = [
        {
          id: 'sample1',
          userId: 'sample-user-1',
          name: 'Demo User',
          age: 28,
          location: 'Pokhara',
          experience: 'Intermediate',
          completedTreks: 8,
          bio: 'Demo profile for testing the compatibility algorithm.',
          interests: ['Photography', 'Annapurna Circuit', 'Cultural Exploration'],
          nextTrek: 'Everest Base Camp',
          availability: 'April 2024',
          languages: ['English', 'Nepali'],
          rating: 4.6,
          avatar: 'photo-1494790108755-2616b612b786',
          createdAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem(PROFILES_KEY, JSON.stringify(sampleProfiles));
    }
  }
}; 