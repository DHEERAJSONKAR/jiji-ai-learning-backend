import supabase from '../config/supabase.js';
import { extractKeywords } from '../utils/queryHelper.js';

/**
 * Resource Service - Handles all resource-related database operations
 */
class ResourceService {
  /**
   * Search resources based on query keywords
   * @param {string} query - User search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of matching resources
   */
  async searchResources(query, options = {}) {
    const { limit = 5, topic = null } = options;
    
    try {
      const keywords = extractKeywords(query);

      if (keywords.length === 0) {
        return this.getRecentResources(limit);
      }

      // Simple ILIKE search - more reliable
      return this.searchResourcesByKeywords(keywords, { limit, topic });
    } catch (err) {
      console.error('searchResources error:', err);
      return []; // Return empty array on any error
    }
  }

  /**
   * Search resources using ILIKE pattern matching
   * @param {string[]} keywords - Array of keywords
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of matching resources
   */
  async searchResourcesByKeywords(keywords, options = {}) {
    const { limit = 5, topic = null } = options;

    // Search in title and topic using OR conditions
    const searchConditions = keywords
      .map((kw) => `title.ilike.%${kw}%,topic.ilike.%${kw}%`)
      .join(',');

    let queryBuilder = supabase
      .from('resources')
      .select('*')
      .or(searchConditions)
      .limit(limit);

    if (topic) {
      queryBuilder = queryBuilder.eq('topic', topic);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Resource search error:', error);
      return []; // Return empty array on error
    }

    return data || [];
  }

  /**
   * Get recent resources
   * @param {number} limit - Number of resources to fetch
   * @returns {Promise<Array>} Array of recent resources
   */
  async getRecentResources(limit = 5) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .limit(limit);

    if (error) {
      console.error('Get recent resources error:', error);
      return []; // Return empty array instead of throwing
    }

    return data || [];
  }

  /**
   * Get resource by ID
   * @param {string} id - Resource UUID
   * @returns {Promise<Object|null>} Resource object or null
   */
  async getResourceById(id) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Get resource by ID error:', error);
      throw new Error('Failed to fetch resource');
    }

    return data;
  }

  /**
   * Get resources by type
   * @param {string} type - Resource type (ppt, video)
   * @param {number} limit - Number of resources to fetch
   * @returns {Promise<Array>} Array of resources
   */
  async getResourcesByType(type, limit = 10) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get resources by type error:', error);
      throw new Error('Failed to fetch resources by type');
    }

    return data || [];
  }

  /**
   * Get resources by topic
   * @param {string} topic - Topic name
   * @param {number} limit - Number of resources to fetch
   * @returns {Promise<Array>} Array of resources
   */
  async getResourcesByTopic(topic, limit = 10) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('topic', topic)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get resources by topic error:', error);
      throw new Error('Failed to fetch resources by topic');
    }

    return data || [];
  }
}

export default new ResourceService();
