import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './features/auth/authRoutes';
import postRoutes from './features/post/postRoutes';
import userRoutes from './features/user/userRoutes';

import Post from './features/post/postModel';
import User from './features/user/userModel';
import Comment from './features/comment/commentModel';

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
Comment.belongsTo(User, { constraints: true });
Post.hasMany(Comment);
User.hasMany(Comment);

app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/user', userRoutes);

export default app;
