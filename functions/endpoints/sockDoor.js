const { query } = require('express-validator');
const { createEndpoint } = require('./helpers');
const { resolveDoor } = require('./middlewares');
const { Door } = require('../models');

const validation = [
  query('doorId').isString(),
];

const middlewares = [
  resolveDoor
];

async function sockDoor(req, res) {
  const { door } = res.locals;
  const { userId } = req.query;
  const user = { id: userId }; // TODO: Authenticate

  if(!door.users[userId]) {
    return res.status(403).send('User is not part of room');
  }

  try {
    await Door.sockDoor(door, user);
    return res.sendStatus(200);
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.POST, sockDoor, { validation, middlewares });
