const { DoorUser, Door } = require('../models');

async function doorUserExists(req, res, next) {
  const { doorId, userId } = req.query;

  let doorUser;
  try {
    [doorUser] = await DoorUser.getByFields({ userId, doorId });
  } catch (e) {
    throw e;
  }
  if(!doorUser) {
    return res.status(403).send(`User ${userId} is not part of room ${doorId}`)
  }
  res.locals.doorUser = doorUser;
  return next();
}

async function resolveDoor(req, res, next) {
  const { doorId } = req.query;

  try {
    res.locals.door = await Door.getById(doorId);
    return next();
  } catch (e) {
    throw e;
  }
}

module.exports = { doorUserExists, resolveDoor };
