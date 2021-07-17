import jwt from 'jsonwebtoken';
import argon from 'argon2';

import userDAL from '../user/userDAL';
import postDAL from '../post/postDAL';
import commentDAL from '../comment/commentDAL';

const { JWT_SECRET } = process.env;

async function signup(req, res) {
  try {
    const { email, fullname, username, password } = req.body;

    const users = await userDAL.findAll({ where: { email: email } });

    if (Array.isArray(users) && users.length) {
      res.status(400).send({ msg: 'Email already exists' });
    }

    const hash = await argon.hash(password);

    const values = {
      email: email,
      fullname: fullname,
      username: username,
      password: hash,
      profileImg: '',
    };
    const user = await userDAL.create(values);

    const payload = { id: user.id };
    const EXPIRES_IN = '1h';
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });

    const response = {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
      },
      token,
    };

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const users = await userDAL.findAll({ where: { email: email } });

    if (!Array.isArray(users) || !users.length) {
      res.status(400).send({ msg: 'User not found' });
    }

    const user = users[0];

    const userVerified = await argon.verify(user.password, password)

    if (userVerified) {
      const payload = { id: user.id };
      const EXPIRES_IN = '1h';
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });

      const response = {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          username: user.username,
        },
        token,
      };

      res.status(200).send(response);
    } else {
      res.status(400).send({ msg: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
}

async function user(req, res) {
  const users = await userDAL.findAll({
    where: { id: req.userData.id },
    attributes: { exclude: ['password'] },
  });

  const user = users[0];

  const posts = await postDAL.findAll({ where: { userId: user.id } });

  const comments = await commentDAL.findAll();


  const updatedPosts = posts.map((post) => {
    const postComments = comments.filter((comment) => comment.postId === post.id);
    return {
      id: post.id,
      imageUrl: post.imageUrl,
      caption: post.caption,
      likes: post.likes,
      createdAt: post.createdAt,
      userId: post.userId,
      comments: postComments
    };
  });


  const response = {
    user: {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      username: user.username,
      profileImg: user.profileImg,
      posts: updatedPosts,
    },
  };

  res.send(response);
}

export { signup, login, user };
export default { signup, login, user };
