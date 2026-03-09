import { Router } from 'express';
import { jijiController } from '../controllers/index.js';
import { askJijiValidationRules, validate } from '../middleware/index.js';

const router = Router();

/**
 * @route   POST /api/ask-jiji
 * @desc    Ask Jiji a question and get learning resources
 * @access  Public
 */
router.post(
  '/ask-jiji',
  askJijiValidationRules,
  validate,
  jijiController.askJiji
);

/**
 * @route   GET /api/resources
 * @desc    Get all resources with optional filtering
 * @access  Public
 */
router.get('/resources', jijiController.getResources);

/**
 * @route   GET /api/resources/:id
 * @desc    Get a single resource by ID
 * @access  Public
 */
router.get('/resources/:id', jijiController.getResourceById);

/**
 * @route   GET /api/queries/popular
 * @desc    Get popular queries
 * @access  Public
 */
router.get('/queries/popular', jijiController.getPopularQueries);

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', jijiController.healthCheck);

export default router;
