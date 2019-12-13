const functions = require('firebase-functions');
const createDoor = require('./endpoints/createDoor');
const addDoorUser = require('./endpoints/addDoorUser');
const sockDoor = require('./endpoints/sockDoor');
const removeSock = require('./endpoints/removeSock');

exports.door = functions.https.onRequest(createDoor);
exports.doorUser = functions.https.onRequest(addDoorUser);
exports.sockDoor = functions.https.onRequest(sockDoor);
exports.removeSock = functions.https.onRequest(removeSock);
