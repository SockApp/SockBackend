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

async function removeSock(req, res) {
  const { door } = res.locals;
  const db = admin.firestore();

  try {
    await db.collection(collectionNames.Door).doc(door.id)
      .update({ sockOwner: admin.firestore.FieldValue.delete() });
    return res.sendStatus(200);
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.DELETE, removeSock, { validation, middlewares });
