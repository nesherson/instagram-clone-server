import { validationResult, body } from 'express-validator';
import argon from 'argon2';

import userDAL from '../features/user/userDAL';

function validate(validations) {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const error = errors.array()[0];

    res.status(400).send({ error: error });
  };
}

function isEmail() {
  return body('email').isEmail().withMessage('Invalid email');
}

function isEmailInUse() {
  return body('email').custom(async (value, { req }) => {
    const user = await userDAL.findOne({ where: { email: req.body.email } });
    if (user) {
      return Promise.reject('Email already in use');
    }
  });
}

function isPasswordShort() {
  return body('password')
    .isLength({ min: 6 })
    .withMessage('Password is too short');
}

function isPasswordValid() {
  return body('password').custom(async (value, { req }) => {
    const user = await userDAL.findOne({ where: { email: req.body.email } });

    const userVerified = await argon.verify(user.password, req.body.password);

    if (!userVerified) {
      return Promise.reject('Wrong password');
    }
  });
}

export { validate, isEmail, isEmailInUse, isPasswordShort, isPasswordValid };
