import express from 'express';

import auth from '../../middleware/auth';

import userController from './userController';

const router = express.Router();

router.get('/', auth, userController.getUser);
router.post('/user/:uid/save-post', auth, userController.savePost);


export default router;
