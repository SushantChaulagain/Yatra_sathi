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
  avatar?: string;
  createdAt: string;
  lastActive?: string; // ISO timestamp of last activity
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
        avatar: profile.avatar || this.generateAvatar(),
        createdAt: profile.createdAt || new Date().toISOString(),
        lastActive: new Date().toISOString() // Always update last active time
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

  // Update user's last active timestamp
  updateLastActive(userId: string): void {
    try {
      const profiles = this.getAllProfiles();
      const existingIndex = profiles.findIndex(p => p.userId === userId);

      if (existingIndex >= 0) {
        profiles[existingIndex].lastActive = new Date().toISOString();
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      }
    } catch (error) {
      console.error('Error updating last active:', error);
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
          name: 'Maya Sherpa',
          age: 28,
          location: 'Pokhara',
          experience: 'Advanced',
          completedTreks: 15,
          bio: 'Passionate trekker and photography enthusiast. Love exploring hidden trails and capturing the beauty of the Himalayas.',
          interests: ['Photography', 'Annapurna Circuit', 'Cultural Exploration', 'High Altitude', 'Solo Travel'],
          nextTrek: 'Everest Base Camp',
          availability: 'April 2025',
          languages: ['English', 'Nepali', 'Hindi'],
          avatar: 'photo-1494790108755-2616b612b786',
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample2',
          userId: 'sample-user-2',
          name: 'Rajesh Tamang',
          age: 32,
          location: 'Kathmandu',
          experience: 'Intermediate',
          completedTreks: 7,
          bio: 'Weekend warrior who loves mountain adventures. Looking for partners who enjoy a good challenge and great conversations.',
          interests: ['Manaslu Circuit', 'Technical Climbing', 'Wildlife Watching', 'Digital Detox'],
          nextTrek: 'Langtang Valley',
          availability: 'March 2025',
          languages: ['English', 'Nepali'],
          avatar: 'photo-1507003211169-0a1dd7228f2d',
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample3',
          userId: 'sample-user-3',
          name: 'Sarah Mitchell',
          age: 26,
          location: 'Pokhara',
          experience: 'Beginner',
          completedTreks: 3,
          bio: 'Adventure seeker from abroad, new to Himalayan trekking. Excited to learn from experienced partners!',
          interests: ['Photography', 'Cultural Exploration', 'Short Treks', 'Local Culture'],
          nextTrek: 'Poon Hill',
          availability: 'April 2025',
          languages: ['English', 'Spanish'],
          avatar: 'photo-1438761681033-6461ffad8d80',
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample4',
          userId: 'sample-user-4',
          name: 'Karma Lama',
          age: 35,
          location: 'Kathmandu',
          experience: 'Advanced',
          completedTreks: 22,
          bio: 'Local guide and trek leader. Happy to share my knowledge and help newcomers discover the magic of our mountains.',
          interests: ['Group Leading', 'Cultural Exploration', 'High Altitude', 'Everest Base Camp', 'Upper Mustang'],
          nextTrek: 'Kanchenjunga',
          availability: 'May 2025',
          languages: ['English', 'Nepali', 'Tibetan'],
          avatar: 'photo-1472099645785-5658abf4ff4e',
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample5',
          userId: 'sample-user-5',
          name: 'Emma Johnson',
          age: 29,
          location: 'Pokhara',
          experience: 'Intermediate',
          completedTreks: 9,
          bio: 'Nature photographer and wellness enthusiast. Looking for mindful trekking experiences with like-minded people.',
          interests: ['Photography', 'Digital Detox', 'Wildlife Watching', 'Gokyo Lakes', 'Solo Travel'],
          nextTrek: 'Gokyo Lakes',
          availability: 'April 2025',
          languages: ['English', 'French'],
          avatar: 'photo-1489424731084-a5d8b219a5bb',
          createdAt: new Date().toISOString()
        },
        {
          id: 'sample6',
          userId: 'sample-user-6',
          name: 'Bikash Rai',
          age: 24,
          location: 'Chitwan',
          experience: 'Beginner',
          completedTreks: 2,
          bio: 'Engineering student with a passion for mountains. Looking to build experience with patient and encouraging partners.',
          interests: ['Annapurna Circuit', 'Photography', 'Cultural Exploration', 'Short Treks'],
          nextTrek: 'Annapurna Circuit',
          availability: 'March 2025',
          languages: ['English', 'Nepali', 'Hindi'],
          avatar: 'photo-1500648767791-00dcc994a43e',
          createdAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem(PROFILES_KEY, JSON.stringify(sampleProfiles));
    }
  }
}; 