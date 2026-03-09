import supabase from '../config/supabase.js';

/**
 * Profile Service - Handles user profile operations
 */
class ProfileService {
  /**
   * Get profile by ID
   * @param {string} id - Profile UUID
   * @returns {Promise<Object|null>} Profile object or null
   */
  async getProfileById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Get profile by ID error:', error);
      throw new Error('Failed to fetch profile');
    }

    return data;
  }

  /**
   * Create a new profile
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} Created profile
   */
  async createProfile(profileData) {
    const { id, email, name, preferences = {} } = profileData;

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id,
        email,
        name,
        preferences,
      })
      .select()
      .single();

    if (error) {
      console.error('Create profile error:', error);
      throw new Error('Failed to create profile');
    }

    return data;
  }

  /**
   * Update profile
   * @param {string} id - Profile UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile');
    }

    return data;
  }

  /**
   * Update user preferences
   * @param {string} id - Profile UUID
   * @param {Object} preferences - New preferences
   * @returns {Promise<Object>} Updated profile
   */
  async updatePreferences(id, preferences) {
    const profile = await this.getProfileById(id);
    
    if (!profile) {
      throw new Error('Profile not found');
    }

    const mergedPreferences = {
      ...profile.preferences,
      ...preferences,
    };

    return this.updateProfile(id, { preferences: mergedPreferences });
  }

  /**
   * Get all profiles (admin use)
   * @param {number} limit - Number of profiles to fetch
   * @returns {Promise<Array>} Array of profiles
   */
  async getAllProfiles(limit = 50) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get all profiles error:', error);
      throw new Error('Failed to fetch profiles');
    }

    return data || [];
  }
}

export default new ProfileService();
