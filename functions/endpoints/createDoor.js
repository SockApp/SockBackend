const { body, query } = require('express-validator');
const { createEndpoint } = require('./helpers');
const { Door } = require('../models');

const validation = [
  query('userId').isString(),
  body('name').isString(),
  body('location.latitude').isNumeric(),
  body('location.longitude').isNumeric()
];

async function createDoor(req, res) {
  const { name, location } = req.body;
  const { userId } = req.query;

  try {
    const door = await Door.create({
      name,
      location,
      owner: userId,
      users: {
        [userId]: true
      }
    });

    return res.status(201).send({ doorId: door.id });
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.POST, createDoor, { validation });
