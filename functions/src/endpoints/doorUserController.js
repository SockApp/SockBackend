const express = require('express');
const { body } = require('express-validator');
const { Door, User } = require('../models/index');
const { validateRequest } = require('./middlewares');

const router = express.Router();

router.post('/', [
  body('phoneNumber').isString(),
  validateRequest
], async (req, res) => {
  const { phoneNumber } = req.body;
  const { door } = res.locals;

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
});

module.exports = router;
