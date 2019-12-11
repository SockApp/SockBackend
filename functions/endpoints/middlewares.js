const admin = require('firebase-admin');
const collectionNames = require('../collectionNames');

async function doorUserExists(req, res, next) {
  const { doorId, userId } = req.query;
  const db = admin.firestore();

  let doorUser;
  try {
    const snapshot = await db.collection(collectionNames.DoorUser)
      .where('userId', '==', userId)
      .where('doorId', '==', doorId)
      .get();
    doorUser = snapshot.empty ? null : snapshot.docs[0];
  } catch (e) {
    throw e;
  }
  if(!doorUser) {
    return res.status(403).send(`User ${userId} is not part of room ${doorId}`)
  }
  res.locals.doorUser = doorUser;
  return next();
}

async function resolveDoor(req, res, next) {
  const { doorId } = req.query;
  const db = admin.firestore();

  try {
    res.locals.door = await db.collection(collectionNames.Door).doc(doorId).get();
    return next();
  } catch (e) {
    throw e;
  }
}

module.exports = { doorUserExists, resolveDoor };
