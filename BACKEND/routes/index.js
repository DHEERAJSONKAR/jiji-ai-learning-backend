import { Router } from 'express';
import jijiRoutes from './jijiRoutes.js';

const router = Router();

// Mount Jiji routes
router.use('/', jijiRoutes);

export default router;
