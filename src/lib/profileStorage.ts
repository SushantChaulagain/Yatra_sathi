import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

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
  lastActive?: string;
}

type DbProfile = Database['public']['Tables']['profiles']['Row'];
type DbProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type DbProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Helper functions to convert between DB format and app format
function dbToUserProfile(dbProfile: DbProfile): UserProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.full_name || 'Unknown',
    age: dbProfile.age || 0,
    location: dbProfile.location || '',
    experience: dbProfile.experience || 'Beginner',
    completedTreks: dbProfile.completed_treks || 0,
    bio: dbProfile.bio || '',
    interests: dbProfile.interests || [],
    nextTrek: dbProfile.next_trek || '',
    availability: dbProfile.availability || '',
    languages: dbProfile.languages || [],
    userId: dbProfile.user_id,
    avatar: dbProfile.avatar_url || undefined,
    createdAt: dbProfile.created_at,
    lastActive: dbProfile.last_active || undefined,
  };
}

function userProfileToDb(profile: Partial<UserProfile>): Partial<DbProfileUpdate> {
  return {
    full_name: profile.name,
    age: profile.age,
    location: profile.location,
    experience: profile.experience,
    completed_treks: profile.completedTreks,
    bio: profile.bio,
    interests: profile.interests,
    next_trek: profile.nextTrek,
    availability: profile.availability,
    languages: profile.languages,
    avatar_url: profile.avatar,
    last_active: new Date().toISOString(),
  };
}

export const profileStorage = {
  // Get all profiles
  async getAllProfiles(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_active', { ascending: false });

      if (error) {
        console.error('Error loading profiles:', error);
        return [];
      }

      return (data || []).map(dbToUserProfile);
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  },

  // Get current user's profile
  async getCurrentUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null;
        }
        console.error('Error loading profile:', error);
        return null;
      }

      return data ? dbToUserProfile(data) : null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  },

  // Save or update a profile
  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      const dbProfile = userProfileToDb(profile);

      console.log('💾 Attempting to save profile:');
      console.log('   User ID:', profile.userId);
      console.log('   Profile data:', dbProfile);

      // First check if profile exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', profile.userId)
        .single();

      console.log('   Existing profile?', existing ? 'YES (will UPDATE)' : 'NO (will INSERT)');

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: profile.userId,
          ...dbProfile,
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error('❌ Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Failed to save profile: ${error.message}`);
      }

      console.log('✅ Profile saved successfully!');
      console.log('   Saved data:', data);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      throw error;
    }
  },

  // Update user's last active timestamp
  async updateLastActive(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ last_active: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating last active:', error);
      }
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  },

  // Delete a profile
  async deleteProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting profile:', error);
        throw new Error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete profile');
    }
  },

  // Get other users' profiles (excluding current user)
  async getOtherProfiles(currentUserId: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', currentUserId)
        .order('last_active', { ascending: false });

      if (error) {
        console.error('Error loading profiles:', error);
        return [];
      }

      return (data || []).map(dbToUserProfile);
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  },

  // Helper function to generate unique ID (keeping for compatibility)
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
  async hasProfile(userId: string): Promise<boolean> {
    const profile = await this.getCurrentUserProfile(userId);
    return profile !== null;
  },

  // Get profiles with search and filter
  async searchProfiles(currentUserId: string, searchTerm: string = '', filters: any = {}): Promise<UserProfile[]> {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('user_id', currentUserId);

      // Experience filter
      if (filters.experience && filters.experience !== 'all') {
        query = query.eq('experience', filters.experience);
      }

      // Location filter
      if (filters.location && filters.location !== 'all') {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Age filter
      if (filters.ageGroup && filters.ageGroup !== 'all') {
        if (filters.ageGroup === '20s') {
          query = query.gte('age', 20).lt('age', 30);
        } else if (filters.ageGroup === '30s') {
          query = query.gte('age', 30).lt('age', 40);
        } else if (filters.ageGroup === '40s') {
          query = query.gte('age', 40);
        }
      }

      const { data, error } = await query.order('last_active', { ascending: false });

      if (error) {
        console.error('Error searching profiles:', error);
        return [];
      }

      let profiles = (data || []).map(dbToUserProfile);

      // Client-side search filter (since Supabase array search is complex)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        profiles = profiles.filter(profile =>
          profile.name.toLowerCase().includes(term) ||
          profile.location.toLowerCase().includes(term) ||
          profile.nextTrek.toLowerCase().includes(term) ||
          profile.interests.some(interest => interest.toLowerCase().includes(term))
        );
      }

      return profiles;
    } catch (error) {
      console.error('Error searching profiles:', error);
      return [];
    }
  },

  // NO MORE SAMPLE DATA - Real users only!
};
