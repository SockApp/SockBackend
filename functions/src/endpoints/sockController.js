const express = require('express');
const { Door } = require('../models/index');

const router = express.Router();

router.post('/', async (req, res) => {
  const { door } = res.locals;
  const userId = req.user.uid;

  if(!door.users[userId]) {
    return res.status(403).send('User is not part of room');
  }

  try {
    await Door.sockDoor(door, userId);
    return res.sendStatus(200);
  } catch (e) {
    throw e;
  }
});

router.delete('/', async (req, res) => {
  const { door } = res.locals;
  const userId = req.user.uid;

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
});

module.exports = router;

