import express from 'express';

import auth from '../../middleware/auth';

import authController from './authController';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

export default router;
