const { body, query } = require('express-validator');
const { createEndpoint } = require('./helpers');
const { Door, User } = require('../models');

const validation = [
  body('phoneNumber').isString(),
  query('doorId').isString() // TODO: Validate Firebase id
];

async function addDoorUser(req, res) {
  const { doorId } = req.query;
  const { phoneNumber } = req.body;

  let door;
  try {
    door = await Door.getById(doorId);
  } catch (e) {
    throw e;
  }
  if(!door) {
    return res.status(401).send(`No door found with id ${doorId}`);
  }

  let user;
  try {
    [user] = await User.getByFields({ phoneNumber });
  } catch (e) {
    throw e;
  }
  if(!user) {
    return res.status(401).send(`No user found with number ${phoneNumber}`);
  }

  try {
    await Door.addUser(door, user);
    return res.sendStatus(200);
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.POST, addDoorUser, { validation });
