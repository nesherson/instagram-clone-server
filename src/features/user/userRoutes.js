import express from 'express';

import auth from '../../middleware/auth';

import userController from './userController';

const router = express.Router();

router.get('/auth-user', auth, userController.getAuthUser);
router.get('/user/:id', auth, userController.getUserByUsername);




export default router;
