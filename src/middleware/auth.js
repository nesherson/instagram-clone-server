import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).send({ msg: 'Not authorized.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ msg: 'Token is not valid' });
  }
}

export default auth;
