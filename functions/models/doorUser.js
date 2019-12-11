const documentFactory = require('./document');

const schema = {
  type: 'object',
  properties: {
    doorId: { type: 'string' },
    userId: { type: 'string' }
  },
  required: ['doorId', 'userId']
};

const collectionName = 'DoorUsers';
const DoorUser = documentFactory(collectionName, schema);

module.exports = DoorUser;
