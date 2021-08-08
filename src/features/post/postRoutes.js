import express from 'express';

import auth from '../../middleware/auth';

import postController from './postController';

const router = express.Router();

router.post('/add-post', auth, postController.addPost);
router.get('/posts', auth, postController.getPosts);
router.get('/post/:id', auth, postController.getPost);
router.get('/user/:id', auth, postController.getUserPosts);
router.post('/user/:id/save-post', auth, postController.savePost);
router.get('/user/:id/saved-posts', auth, postController.getSavedPosts);
router.post('/:id/add-comment', auth, postController.addComment);
router.get('/comments', auth, postController.getComments);
router.get('/:id/comments', auth, postController.getPostComments);
router.post('/:id/like', auth, postController.likePost);
router.get('/likes', auth, postController.getLikes);
router.get('/:id/likes', auth, postController.getPostLikes);

export default router;
