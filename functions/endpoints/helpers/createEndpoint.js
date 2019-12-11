const express = require('express');
const bodyParser = require('body-parser');
const verifyFirebaseToken = require('./auth');
const validateRequest = require('./validateRequest');

function errorHandler(err, req, res, next) {
  if(err) {
    console.log(err);
    return res.status(500).send(err);
  }
  return next();
}

function createEndpoint (method, endpoint, {
  path = '/',
  validation,
  middlewares,
  auth = false
} = {}) {
  const app = express();
  app.use(bodyParser.json())
  if(auth) {
    app.use(verifyFirebaseToken)
  }
  if(validation) {
    app.use(validation);
    app.use(validateRequest);
  }
  if(middlewares) {
    app.use(middlewares);
  }
  app[method](path, async (req, res, next) => {
    try {
      return await endpoint(req, res);
    } catch (e) {
      return next(e);
    }
  });
  app.use(errorHandler);
  return app;
}

createEndpoint.method = {
  GET: 'get',
  PUT: 'put',
  POST: 'post',
  DELETE: 'delete'
};

module.exports = createEndpoint;
