const express = require('express');
const bodyParser = require('body-parser');
const firebaseAuth = require('./src/endpoints/helpers/auth');
const { resolveDocument } = require('./src/endpoints/middlewares');
const doorController = require('./src/endpoints/doorController');
const doorUserController = require('./src/endpoints/doorUserController');
const sockController = require('./src/endpoints/sockController');
const userController = require('./src/endpoints/userController');
const { Door } = require('./src/models');

function createApp({
  auth = firebaseAuth
 } = {}) {
  const app = express();
  app.use(bodyParser.json());

  if(auth) {
    app.use(auth);
  }

  app.use('/doors', doorController);
  app.use('/doors/:doorId', resolveDocument('doorId', 'door', Door));
  app.use('/doors/:doorId/users', doorUserController);
  app.use('/doors/:doorId/sock', sockController);
  app.use('/users', userController);

  app.use(errorHandler);

  return app;
}

function errorHandler(err, req, res, next) {
  if(err) {
    console.log(err);
    return res.status(500).send(err);
  }
  return next();
}

module.exports = createApp;

