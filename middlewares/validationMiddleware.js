const { validationResult } = require("express-validator");

module.exports = {
  validateFields(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = errors.array().map((err) => err.msg);
      return res.status(400).json({ error: extractedErrors });
    }
    next();
  },
};
