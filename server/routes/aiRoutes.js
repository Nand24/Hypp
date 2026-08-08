import express from 'express';
import { getAIValuation, generateAIDescription } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const aiRouter = express.Router();

aiRouter.post('/valuation', protect, getAIValuation);
aiRouter.post('/generate-description', protect, generateAIDescription);

export default aiRouter;
