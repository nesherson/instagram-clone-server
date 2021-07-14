import express from 'express';

import auth from '../../middleware/auth';

import postController from './postController';

const router = express.Router();

router.post('/add-post', auth, postController.addPost);
router.get('/posts', auth, postController.getPosts);
router.post('/:id/add-comment', auth, postController.addComment);
router.post('/:id/like', auth, postController.likePost);
router.get('/comments', auth, postController.getComments);

export default router;
