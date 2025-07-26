import express from 'express';
import { findUserByEmail } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Defines the new API route: GET /api/users/find/:email
router.get("/find/:email", protectRoute, findUserByEmail);

export default router;
