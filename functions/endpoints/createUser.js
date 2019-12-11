const { body, query } = require('express-validator');
const { createEndpoint } = require('./helpers');
const { User } = require('../models');

const validation = [
  query('userId').isString(),
  body('firstName').isString(),
  body('lastName').isString(),
  body('icon').isString(),
  body('sockIcon').isString()
];

async function createUser(req, res) {
  const { firstName, lastName, icon, sockIcon } = req.body;
  const { userId } = req.query;

  try {
    await User.create({
      firstName,
      lastName,
      icon,
      sockIcon
    }, userId);

    return res.sendStatus(201);
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.POST, createUser, { validation });
