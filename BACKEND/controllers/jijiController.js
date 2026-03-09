import { resourceService, queryService, aiService } from '../services/index.js';
import { formatJijiResponse } from '../utils/index.js';

/**
 * Jiji Controller - Handles AI learning companion endpoints
 */
class JijiController {
  /**
   * POST /api/ask-jiji
   * Main endpoint for asking Jiji questions and getting learning resources
   */
  async askJiji(req, res, next) {
    try {
      const { query, userId, topic } = req.body;

      // Search for relevant resources
      const resources = await resourceService.searchResources(query, {
        limit: 5,
        topic,
      });

      // Generate AI-powered answer
      const answer = await aiService.generateAnswer(query, resources);

      // Log the query (async, non-blocking)
      queryService.logQuery({
        userId,
        query,
        topic,
        resourcesFound: resources.length,
      }).catch((err) => console.error('Failed to log query:', err));

      // Format and send response
      const response = formatJijiResponse(answer, resources);
      
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/resources
   * Get all resources with optional filtering
   */
  async getResources(req, res, next) {
    try {
      const { type, topic, limit = 10 } = req.query;

      let resources;

      if (type) {
        resources = await resourceService.getResourcesByType(type, parseInt(limit, 10));
      } else if (topic) {
        resources = await resourceService.getResourcesByTopic(topic, parseInt(limit, 10));
      } else {
        resources = await resourceService.getRecentResources(parseInt(limit, 10));
      }

      return res.status(200).json({
        success: true,
        count: resources.length,
        data: resources,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/resources/:id
   * Get a single resource by ID
   */
  async getResourceById(req, res, next) {
    try {
      const { id } = req.params;

      const resource = await resourceService.getResourceById(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/queries/popular
   * Get popular queries
   */
  async getPopularQueries(req, res, next) {
    try {
      const { limit = 10 } = req.query;

      const queries = await queryService.getPopularQueries(parseInt(limit, 10));

      return res.status(200).json({
        success: true,
        count: queries.length,
        data: queries,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/health
   * Health check endpoint
   */
  async healthCheck(req, res) {
    return res.status(200).json({
      success: true,
      message: 'Jiji AI Learning Companion is running',
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance with bound methods
const jijiController = new JijiController();

export default {
  askJiji: jijiController.askJiji.bind(jijiController),
  getResources: jijiController.getResources.bind(jijiController),
  getResourceById: jijiController.getResourceById.bind(jijiController),
  getPopularQueries: jijiController.getPopularQueries.bind(jijiController),
  healthCheck: jijiController.healthCheck.bind(jijiController),
};
