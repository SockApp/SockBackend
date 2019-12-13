const { query } = require('express-validator');
const { createEndpoint } = require('./helpers');
const { resolveDoor } = require('./middlewares');
const { Door } = require('../models');

const validation = [
  query('doorId').isString(),
  query('userId').isString(),
];

const middlewares = [
  resolveDoor
];

async function removeSock(req, res) {
  const { door } = res.locals;
  const { userId } = req.query;

  if(door.sockOwner !== userId) {
    return res.status(403).send('User does not currently have a sock on the door');
  }

  try {
    await Door.update(door.id, {
      sockOwner: Door.ops.DELETE
    });
    return res.sendStatus(200);
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.DELETE, removeSock, { validation, middlewares });
