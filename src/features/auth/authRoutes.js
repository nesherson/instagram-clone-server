import express from 'express';

import { validate, isEmail, isEmailInUse } from '../../middleware/validation';

import authController from './authController';

const router = express.Router();

router.post('/signup', validate([isEmailInUse()]), authController.signup);
router.post('/login', validate([isEmail()]), authController.login);

export default router;
