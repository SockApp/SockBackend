const { Door } = require('../models');

async function resolveDoor(req, res, next) {
  const { doorId } = req.query;

  try {
    res.locals.door = await Door.getById(doorId);
    return next();
  } catch (e) {
    throw e;
  }
}

module.exports = { resolveDoor };
