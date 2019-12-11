const admin = require('firebase-admin');
const { body, query } = require('express-validator');
const { createEndpoint } = require('./helpers');
const collectionNames = require('../collectionNames');

const validation = [
  body('phoneNumber').isString(),
  query('doorId').isString() // TODO: Validate Firebase id
];

async function addDoorUser(req, res) {
  const { doorId } = req.query;
  const { phoneNumber } = req.body;
  const db = admin.firestore();

  let door;
  try {
    door = await db.collection(collectionNames.Door).doc(doorId).get();
  } catch (e) {
    throw e;
  }
  if(!door.exists) {
    return res.status(401).send(`No door found with id ${doorId}`);
  }

  let user;
  try {
    const snapshot = await db.collection(collectionNames.User).where('phoneNumber', '==', phoneNumber).get();
    user = snapshot.empty ? null : snapshot.docs[0];
  } catch (e) {
    throw e;
  }
  if(!user) {
    return res.status(401).send(`No user found with number ${phoneNumber}`);
  }

  try {
    const doorUser = await db.collection(collectionNames.DoorUser).add({
      doorId,
      userId: user.id
    });

    return res.status(201).send({ doorUserId: doorUser.id });
  } catch (e) {
    throw e;
  }
}

module.exports = createEndpoint(createEndpoint.method.POST, addDoorUser, { validation });
