//Validation results handler
//validationResult is a function provided by express-validator to collect all errors from validation middleware

const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) //if there are errors
    return res.status(400).json({ errors: errors.array() });

  next();
};

module.exports = {validate};

