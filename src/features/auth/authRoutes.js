import express from 'express';

import {
  validate,
  isEmail,
  isEmailInUse,
  isPasswordShort,
  isPasswordValid,
} from '../../middleware/validation';

import authController from './authController';

const router = express.Router();

router.post(
  '/signup',
  validate([isEmailInUse(), isPasswordShort()]),
  authController.signup
);
router.post(
  '/login',
  validate([isEmail(), isPasswordValid()]),
  authController.login
);

export default router;
