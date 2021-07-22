import express from 'express';

import auth from '../../middleware/auth';

import userController from './userController';

const router = express.Router();

router.get('/user', auth, userController.getUser);
router.post('/user/:uid/save-post', auth, userController.savePost);
router.get('/user/:uid/saved-posts', auth, userController.getSavedPosts);



export default router;
