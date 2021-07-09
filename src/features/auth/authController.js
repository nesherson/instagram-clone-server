import jwt from 'jsonwebtoken';
import usersDAL from '../users/usersDAL';

const { JWT_SECRET } = process.env;

async function signup(req, res) {
  try {
    const { email, fullname, username, password } = req.body;

    const values = {
      email: email,
      fullname: fullname,
      username: username,
      password: password,
      profileImg: '',
    };

    const users = await usersDAL.findAll({ where: { email: email } });

    if (Array.isArray(users) && users.length) {
      res.status(400).send({ msg: 'Email already exists' });
    }

    const user = await usersDAL.create(values);

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 3600000 });

    const response = {
      user: {
        id: user.id,
        email: user.email,
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

    const users = await usersDAL.findAll({ where: { email: email } });

    if (!Array.isArray(users) || !users.length) {
      res.status(400).send({ msg: 'User not found' });
    }

    const user = users[0];

    if (password === user.password) {
      const payload = { id: user.id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 3600000 });

      const response = {
        user: {
          id: user.id,
          email: user.email,
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
  const users = await usersDAL.findAll({
    where: { id: req.user.id },
    attributes: { exclude: ['password'] },
  });

  const user = users[0];

  res.send(user);
}

export { signup, login, user };
export default { signup, login, user };
