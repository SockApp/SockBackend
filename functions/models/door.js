const documentFactory = require('./document');

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    owner: { type: 'string' },
    sockOwner: { type: 'string' }
  },
  required: ['name', 'owner']
};

const collectionName = 'Doors';
const Door = documentFactory(collectionName, schema);

module.exports = Door;
