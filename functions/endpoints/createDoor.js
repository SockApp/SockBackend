const admin = require('firebase-admin');
const { body, query } = require('express-validator');
const { createEndpoint } = require('./helpers');
const collectionNames = require('../collectionNames');

const validation = [
  query('userId').isString(),
  body('name').isString(),
  body('location.latitude').isNumeric(),
  body('location.longitude').isNumeric()
];

async function createDoor(req, res) {
  const { name, location } = req.body;
  const { userId } = req.query;
  const db = admin.firestore();

  const doorRef = db.collection(collectionNames.Door).doc();

  try {
    await db.runTransaction(async t => {
      await t.set(doorRef, {
        name,
        location,
        owner: userId
      });
      await t.set(db.collection(collectionNames.DoorUser).doc(), {
        userId,
        doorId: doorRef.id
      })
    });

    return res.status(201).send({ doorId: doorRef.id });
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.POST, createDoor, { validation });
