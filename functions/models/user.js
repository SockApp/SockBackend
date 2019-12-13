const documentFactory = require('./document');

const schema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneNumber: { type: 'string' },
    icon: { type: 'string' },
    sockIcon: { type: 'string' },
  },
  required: ['phoneNumber']
};

const collectionName = 'Users';
const User = documentFactory(collectionName, schema);

module.exports = User;
