const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('./middlewares');
const { Door } = require('../models/index');

const router = express.Router();

router.post('/', [
  body('name').isString(),
  body('location.latitude').isNumeric(),
  body('location.longitude').isNumeric(),
  validateRequest
], async (req, res) => {
  const { name, location } = req.body;
  const userId = req.user.uid;

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
});

module.exports = router;
