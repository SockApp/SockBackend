const functions = require('firebase-functions');
const createDoor = require('./endpoints/createDoor');
const addDoorUser = require('./endpoints/addDoorUser');
const sockDoor = require('./endpoints/sockDoor');
const removeSock = require('./endpoints/removeSock');

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.door = functions.https.onRequest(createDoor);
exports.doorUser = functions.https.onRequest(addDoorUser);
exports.sockDoor = functions.https.onRequest(sockDoor);
exports.removeSock = functions.https.onRequest(removeSock);
