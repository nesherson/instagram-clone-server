import express from 'express';

import auth from '../../middleware/auth';

import postController from './postController';

const router = express.Router();

router.post('/add-post', auth, postController.addPost);

export default router;
