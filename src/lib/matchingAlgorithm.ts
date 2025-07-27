import { UserProfile } from './profileStorage';

// Extended interface for user preferences
export interface UserPreferences {
  preferredAgeRange: { min: number; max: number };
  preferredExperienceLevels: string[];
  preferredLocations: string[];
  dealBreakerInterests: string[]; // Interests they absolutely want
  avoidInterests: string[]; // Interests they want to avoid
  languageImportance: 'low' | 'medium' | 'high';
  experienceImportance: 'low' | 'medium' | 'high';
  locationImportance: 'low' | 'medium' | 'high';
  groupSizePreference: 'solo' | 'small' | 'any';
  budgetRange: 'budget' | 'moderate' | 'luxury' | 'any';
}

// Match result interface
export interface MatchResult {
  profile: UserProfile;
  compatibilityScore: number;
  breakdown: {
    interestScore: number;
    experienceScore: number;
    locationScore: number;
    availabilityScore: number;
    languageScore: number;
    ageScore: number;
  };
  reasoning: string[];
  matchType: 'perfect' | 'great' | 'good' | 'possible';
}

// Weights for different factors (can be customized per user)
export interface MatchingWeights {
  interests: number;
  experience: number;
  location: number;
  availability: number;
  languages: number;
  age: number;
}

export class SophisticatedMatchingAlgorithm {
  private defaultWeights: MatchingWeights = {
    interests: 0.30,    // 30% - Most important for trekking compatibility
    experience: 0.25,   // 25% - Safety and pace compatibility
    location: 0.15,     // 15% - Convenience factor
    availability: 0.15, // 15% - Timing alignment
    languages: 0.10,    // 10% - Communication
    age: 0.05          // 5% - Least important, but can matter for energy levels
  };

  /**
   * Main matching function - finds compatible partners with scores
   */
  findMatches(
    currentUser: UserProfile,
    allUsers: UserProfile[],
    userPreferences?: UserPreferences,
    customWeights?: Partial<MatchingWeights>
  ): MatchResult[] {
    const weights = { ...this.defaultWeights, ...customWeights };
    const preferences = userPreferences || this.generateDefaultPreferences(currentUser);
    
    const matches = allUsers
      .filter(user => user.userId !== currentUser.userId)
      .map(user => this.calculateCompatibility(currentUser, user, preferences, weights))
      .filter(match => match.compatibilityScore >= 0.3) // Minimum 30% compatibility
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return matches;
  }

  /**
   * Calculate compatibility between two users
   */
  private calculateCompatibility(
    user1: UserProfile,
    user2: UserProfile,
    preferences: UserPreferences,
    weights: MatchingWeights
  ): MatchResult {
    const breakdown = {
      interestScore: this.calculateInterestCompatibility(user1, user2),
      experienceScore: this.calculateExperienceCompatibility(user1, user2, preferences),
      locationScore: this.calculateLocationCompatibility(user1, user2, preferences),
      availabilityScore: this.calculateAvailabilityCompatibility(user1, user2),
      languageScore: this.calculateLanguageCompatibility(user1, user2),
      ageScore: this.calculateAgeCompatibility(user1, user2, preferences)
    };

    // Normalize weights to ensure they sum to 1
    const totalWeight = weights.interests + weights.experience + weights.location + 
                       weights.availability + weights.languages + weights.age;
    const normalizedWeights = {
      interests: weights.interests / totalWeight,
      experience: weights.experience / totalWeight,
      location: weights.location / totalWeight,
      availability: weights.availability / totalWeight,
      languages: weights.languages / totalWeight,
      age: weights.age / totalWeight
    };

    // Calculate weighted total score
    const compatibilityScore = 
      breakdown.interestScore * normalizedWeights.interests +
      breakdown.experienceScore * normalizedWeights.experience +
      breakdown.locationScore * normalizedWeights.location +
      breakdown.availabilityScore * normalizedWeights.availability +
      breakdown.languageScore * normalizedWeights.languages +
      breakdown.ageScore * normalizedWeights.age;

    const reasoning = this.generateReasoning(breakdown, user2);
    const matchType = this.determineMatchType(compatibilityScore);

    return {
      profile: user2,
      compatibilityScore: Math.min(1.0, Math.max(0.0, Math.round(compatibilityScore * 100) / 100)),
      breakdown,
      reasoning,
      matchType
    };
  }

  /**
   * Interest compatibility using Jaccard similarity coefficient
   */
  private calculateInterestCompatibility(user1: UserProfile, user2: UserProfile): number {
    const interests1 = new Set(user1.interests.map(i => i.toLowerCase()));
    const interests2 = new Set(user2.interests.map(i => i.toLowerCase()));
    
    const intersection = new Set([...interests1].filter(i => interests2.has(i)));
    const union = new Set([...interests1, ...interests2]);
    
    // Jaccard similarity: |intersection| / |union|
    const jaccardSimilarity = intersection.size / union.size;
    
    // Bonus for having many shared interests
    const sharedCount = intersection.size;
    const bonus = sharedCount >= 3 ? 0.1 : sharedCount >= 2 ? 0.05 : 0;
    
    return Math.min(1.0, jaccardSimilarity + bonus);
  }

  /**
   * Experience compatibility - considers both level and trek count
   */
  private calculateExperienceCompatibility(
    user1: UserProfile, 
    user2: UserProfile,
    preferences: UserPreferences
  ): number {
    const experienceLevels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    const level1 = experienceLevels[user1.experience as keyof typeof experienceLevels] || 2;
    const level2 = experienceLevels[user2.experience as keyof typeof experienceLevels] || 2;
    
    // Experience level compatibility (prefer similar or complementary levels)
    const levelDiff = Math.abs(level1 - level2);
    const levelScore = levelDiff === 0 ? 1.0 : 
                      levelDiff === 1 ? 0.8 : 0.4; // Allow 1 level difference
    
    // Trek count compatibility
    const trekRatio = Math.min(user1.completedTreks, user2.completedTreks) / 
                     Math.max(user1.completedTreks, user2.completedTreks, 1);
    const trekScore = trekRatio * 0.7 + 0.3; // Normalize between 0.3 and 1.0
    
    return (levelScore * 0.7 + trekScore * 0.3);
  }

  /**
   * Location compatibility - same city = perfect, same region = good
   */
  private calculateLocationCompatibility(
    user1: UserProfile,
    user2: UserProfile,
    preferences: UserPreferences
  ): number {
    if (user1.location.toLowerCase() === user2.location.toLowerCase()) {
      return 1.0; // Same city
    }
    
    // Define regional groups
    const regions = {
      central: ['kathmandu', 'lalitpur', 'bhaktapur'],
      western: ['pokhara', 'butwal'],
      eastern: ['biratnagar', 'dharan', 'itahari'],
      southern: ['birgunj', 'janakpur', 'hetauda']
    };
    
    const getUserRegion = (location: string) => {
      const loc = location.toLowerCase();
      for (const [region, cities] of Object.entries(regions)) {
        if (cities.includes(loc)) return region;
      }
      return 'other';
    };
    
    const region1 = getUserRegion(user1.location);
    const region2 = getUserRegion(user2.location);
    
    return region1 === region2 ? 0.7 : 0.3; // Same region = 0.7, different = 0.3
  }

  /**
   * Availability compatibility - checks if trek timings align
   */
  private calculateAvailabilityCompatibility(user1: UserProfile, user2: UserProfile): number {
    if (!user1.availability || !user2.availability) return 0.5;
    
    // Extract months from availability strings
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    const getMonth = (availability: string) => {
      const month = availability.toLowerCase().split(' ')[0];
      return months.indexOf(month);
    };
    
    const month1 = getMonth(user1.availability);
    const month2 = getMonth(user2.availability);
    
    if (month1 === month2) return 1.0; // Same month
    
    // Adjacent months get good score
    const monthDiff = Math.abs(month1 - month2);
    const circularDiff = Math.min(monthDiff, 12 - monthDiff);
    
    if (circularDiff === 1) return 0.8; // Adjacent months
    if (circularDiff === 2) return 0.6; // 2 months apart
    if (circularDiff <= 3) return 0.4; // Same season
    
    return 0.2; // Different seasons
  }

  /**
   * Language compatibility - shared languages for communication
   */
  private calculateLanguageCompatibility(user1: UserProfile, user2: UserProfile): number {
    const languages1 = new Set(user1.languages.map(l => l.toLowerCase()));
    const languages2 = new Set(user2.languages.map(l => l.toLowerCase()));
    
    const sharedLanguages = new Set([...languages1].filter(l => languages2.has(l)));
    
    if (sharedLanguages.size === 0) return 0.0;
    if (sharedLanguages.size === 1) return 0.7;
    if (sharedLanguages.size >= 2) return 1.0;
    
    return 0.5;
  }

  /**
   * Age compatibility - similar ages tend to have similar pace/interests
   */
  private calculateAgeCompatibility(
    user1: UserProfile,
    user2: UserProfile,
    preferences: UserPreferences
  ): number {
    const ageDiff = Math.abs(user1.age - user2.age);
    
    // Check if within preferred range
    if (user2.age >= preferences.preferredAgeRange.min && 
        user2.age <= preferences.preferredAgeRange.max) {
      if (ageDiff <= 3) return 1.0;
      if (ageDiff <= 7) return 0.8;
      if (ageDiff <= 12) return 0.6;
      return 0.4;
    }
    
    // Outside preferred range
    return Math.max(0.1, 1.0 - (ageDiff / 50));
  }

  /**
   * Generate reasoning for the match
   */
  private generateReasoning(breakdown: any, user2: UserProfile): string[] {
    const reasoning: string[] = [];
    
    if (breakdown.interestScore >= 0.7) {
      reasoning.push(`Strong shared interests in ${user2.interests.slice(0, 2).join(' and ')}`);
    }
    
    if (breakdown.experienceScore >= 0.8) {
      reasoning.push(`Compatible experience levels for safe trekking`);
    }
    
    if (breakdown.locationScore >= 0.7) {
      reasoning.push(`Convenient location for meetups and planning`);
    }
    
    if (breakdown.availabilityScore >= 0.8) {
      reasoning.push(`Perfect timing alignment for trek dates`);
    }
    
    if (breakdown.languageScore >= 0.7) {
      reasoning.push(`Good communication through shared languages`);
    }
    
    if (reasoning.length === 0) {
      reasoning.push(`Potential compatibility worth exploring`);
    }
    
    return reasoning;
  }

  /**
   * Determine match type based on score
   */
  private determineMatchType(score: number): 'perfect' | 'great' | 'good' | 'possible' {
    if (score >= 0.85) return 'perfect';
    if (score >= 0.70) return 'great';
    if (score >= 0.55) return 'good';
    return 'possible';
  }

  /**
   * Generate default preferences based on user profile
   */
  private generateDefaultPreferences(user: UserProfile): UserPreferences {
    return {
      preferredAgeRange: { 
        min: Math.max(18, user.age - 10), 
        max: Math.min(70, user.age + 10) 
      },
      preferredExperienceLevels: [user.experience],
      preferredLocations: [user.location],
      dealBreakerInterests: [],
      avoidInterests: [],
      languageImportance: 'medium',
      experienceImportance: 'high',
      locationImportance: 'medium',
      groupSizePreference: 'any',
      budgetRange: 'any'
    };
  }

  /**
   * Advanced: Collaborative Filtering approach
   * This learns from user interactions and preferences over time
   */
  collaborativeFiltering(
    currentUser: UserProfile,
    allUsers: UserProfile[],
    userInteractions: Map<string, string[]> // userId -> [likedUserIds]
  ): MatchResult[] {
    // Find users with similar preferences (who liked similar people)
    const currentUserLikes = userInteractions.get(currentUser.userId) || [];
    const similarUsers = new Map<string, number>();
    
    // Calculate user similarity based on who they both liked
    for (const [userId, likedUsers] of userInteractions.entries()) {
      if (userId === currentUser.userId) continue;
      
      const commonLikes = currentUserLikes.filter(id => likedUsers.includes(id));
      const similarity = commonLikes.length / Math.max(currentUserLikes.length, likedUsers.length, 1);
      
      if (similarity > 0) {
        similarUsers.set(userId, similarity);
      }
    }
    
    // Recommend users that similar users liked but current user hasn't seen
    const recommendations = new Map<string, number>();
    
    for (const [similarUserId, similarity] of similarUsers.entries()) {
      const theirLikes = userInteractions.get(similarUserId) || [];
      
      for (const likedUserId of theirLikes) {
        if (!currentUserLikes.includes(likedUserId) && likedUserId !== currentUser.userId) {
          const currentScore = recommendations.get(likedUserId) || 0;
          recommendations.set(likedUserId, currentScore + similarity);
        }
      }
    }
    
    // Convert to MatchResult format
    return Array.from(recommendations.entries())
      .map(([userId, score]) => {
        const user = allUsers.find(u => u.userId === userId);
        if (!user) return null;
        
        return {
          profile: user,
          compatibilityScore: Math.min(1.0, score),
          breakdown: {
            interestScore: score,
            experienceScore: 0.5,
            locationScore: 0.5,
            availabilityScore: 0.5,
            languageScore: 0.5,
            ageScore: 0.5
          },
          reasoning: [`Recommended based on similar users' preferences`],
          matchType: 'possible' as 'perfect' | 'great' | 'good' | 'possible'
        };
      })
      .filter((match): match is MatchResult => match !== null)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}

// Export a singleton instance
export const matchingAlgorithm = new SophisticatedMatchingAlgorithm(); 