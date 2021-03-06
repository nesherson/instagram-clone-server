import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './features/auth/authRoutes';
import postRoutes from './features/post/postRoutes';
import userRoutes from './features/user/userRoutes';

import Post from './features/post/postModel';
import User from './features/user/userModel';
import Comment from './features/comment/commentModel';
import SavedPost from './features/savedPost/savedPostModel';
import PostLike from './features/postLike/postLikeModel';

const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

Post.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Post);
Comment.belongsTo(Post, { constraints: true, onDelete: 'CASCADE' });
Comment.belongsTo(User, { constraints: true, onDelete: 'CASCADE'  });
Post.hasMany(Comment);
User.hasMany(Comment);
SavedPost.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
SavedPost.belongsTo(Post, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(SavedPost);
PostLike.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
PostLike.belongsTo(Post, {constraints: true, onDelete: 'CASCADE'});
Post.hasMany(PostLike);



app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/users', userRoutes);

export default app;
