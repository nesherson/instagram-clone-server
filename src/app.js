import express from 'express';
import cors from 'cors';

import authRoutes from './features/auth/authRoutes';

import db from './db';
import User from './features/users/usersModel';

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/auth', authRoutes);

export default app;
