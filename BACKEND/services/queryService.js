import supabase from '../config/supabase.js';

/**
 * Query Service - Handles logging and retrieval of user queries
 */
class QueryService {
  /**
   * Log a user query to the database
   * @param {Object} queryData - Query data
   * @returns {Promise<Object>} Created query record
   */
  async logQuery(queryData) {
    const { query, topic = null, resourcesFound = 0 } = queryData;

    try {
      const { data, error } = await supabase
        .from('queries')
        .insert({
          query_text: query,
          topic,
          resources_found: resourcesFound,
        })
        .select()
        .single();

      if (error) {
        // Silently fail - logging should not block main response
        return null;
      }

      return data;
    } catch (err) {
      // Catch any errors silently
      return null;
    }
  }

  /**
   * Get queries by user ID
   * @param {string} userId - User UUID
   * @param {number} limit - Number of queries to fetch
   * @returns {Promise<Array>} Array of query records
   */
  async getQueriesByUser(userId, limit = 20) {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get queries by user error:', error);
      throw new Error('Failed to fetch user queries');
    }

    return data || [];
  }

  /**
   * Get popular queries (most frequently asked)
   * @param {number} limit - Number of queries to fetch
   * @returns {Promise<Array>} Array of popular query patterns
   */
  async getPopularQueries(limit = 10) {
    const { data, error } = await supabase
      .from('queries')
      .select('query_text, topic')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Get popular queries error:', error);
      throw new Error('Failed to fetch popular queries');
    }

    // Group and count queries
    const queryCount = {};
    (data || []).forEach((q) => {
      const key = q.query_text.toLowerCase().trim();
      queryCount[key] = (queryCount[key] || 0) + 1;
    });

    // Sort by count and return top queries
    return Object.entries(queryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  /**
   * Get recent queries
   * @param {number} limit - Number of queries to fetch
   * @returns {Promise<Array>} Array of recent queries
   */
  async getRecentQueries(limit = 10) {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get recent queries error:', error);
      throw new Error('Failed to fetch recent queries');
    }

    return data || [];
  }
}

export default new QueryService();
