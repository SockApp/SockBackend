const admin = require('firebase-admin');
const { query } = require('express-validator');
const { createEndpoint } = require('./helpers');
const { doorUserExists, resolveDoor } = require('./middlewares');
const collectionNames = require('../collectionNames');

const validation = [
  query('doorId').isString(),
];

const middlewares = [
  doorUserExists,
  resolveDoor
];

async function sockDoor(req, res) {
  const { door } = res.locals;
  const { userId } = req.query;
  const db = admin.firestore();

  if(door.sockOwner !== userId) {
    return res.status(403).send('User does not currently have a sock on the door');
  }

  try {
    await db.collection(collectionNames.Door).doc(door.id)
      .update({ sockOwner: userId });
    return res.sendStatus(200);
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.POST, sockDoor, { validation, middlewares });
