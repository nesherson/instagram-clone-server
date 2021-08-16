import { validationResult } from 'express-validator';

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

export { validate };
