import { validationResult, body } from 'express-validator';

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
  return body('email').custom((email) => {
    const user = userDAL.findOne({ where: { email: email } });
    if (user) {
      return Promise.reject('Email already in use');
    }
  });
}

export { validate, isEmail, isEmailInUse };
