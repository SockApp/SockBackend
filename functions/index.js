const functions = require('firebase-functions');
const createApp = require('./app');

exports.api = functions.https.onRequest(createApp());
