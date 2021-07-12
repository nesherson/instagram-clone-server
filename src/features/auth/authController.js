import jwt from 'jsonwebtoken';
import userDAL from '../user/userDAL';

const { JWT_SECRET } = process.env;

async function signup(req, res) {
  try {
    const { email, fullname, username, password } = req.body;

    const users = await userDAL.findAll({ where: { email: email } });

    if (Array.isArray(users) && users.length) {
      res.status(400).send({ msg: 'Email already exists' });
    }

    const values = {
      email: email,
      fullname: fullname,
      username: username,
      password: password,
      profileImg: '',
    };
    //TODO: hashing password
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

    //basic password authentication
    if (password === user.password) {
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

  const response = {
    user: {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      username: user.username,
      profileImg: user.profileImg,
    },
  };

  res.send(response);
}

export { signup, login, user };
export default { signup, login, user };
