const { validationResult } = require('express-validator');

function resolveDocument(paramId, localId, Model) {
  return async (req, res, next) => {
    try {
      res.locals[localId] = await Model.getById(req.params[paramId]);
      return next();
    } catch (e) {
      throw e;
    }
  }
}

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
}

module.exports = { resolveDocument, validateRequest };