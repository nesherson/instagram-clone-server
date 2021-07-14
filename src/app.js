import express from 'express';
import cors from 'cors';

import authRoutes from './features/auth/authRoutes';
import postsRoutes from './features/post/postRoutes';

import Post from './features/post/postModel';
import User from './features/user/userModel';
import Comment from './features/comment/commentModel';

const app = express();

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
Post.hasMany(Comment);

app.use('/auth', authRoutes);
app.use('/post', postsRoutes);

export default app;
