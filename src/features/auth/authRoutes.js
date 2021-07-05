import express from 'express';

import authController from './authController';

const router = express.Router();

router.get('/signup', authController.signup);

export default router;
