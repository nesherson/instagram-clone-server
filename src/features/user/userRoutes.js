import express from 'express';

import auth from '../../middleware/auth';

import userController from './userController';

const router = express.Router();

router.get('/', auth, userController.getUser);


export default router;
