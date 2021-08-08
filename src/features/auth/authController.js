import jwt from 'jsonwebtoken';
import argon from 'argon2';

import userDAL from '../user/userDAL';

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
      profileImg: 'http://localhost:5000/images/userDefault.png',
    };
    const user = await userDAL.create(values);

    const payload = { id: user.id };
    const EXPIRES_IN = '1h';
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });

    const response = {
      user: {
        id: user.id,
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

export { signup, login };
export default { signup, login };
