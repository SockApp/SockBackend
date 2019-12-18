const express = require('express');
const { body } = require('express-validator');
const { User } = require('../models/index');
const { validateRequest } = require('./middlewares');

const router = express.Router();

router.post('/',[
  body('firstName').isString(),
  body('lastName').isString(),
  body('icon').isString(),
  body('sockIcon').isString(),
  validateRequest
], async (req, res) => {
  const { firstName, lastName, icon, sockIcon } = req.body;
  const userId = req.user.uid;

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
});

module.exports = router;
