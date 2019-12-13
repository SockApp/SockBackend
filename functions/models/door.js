const documentFactory = require('./document');

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    owner: { type: 'string' },
    sockOwner: { type: 'string' },
    users: {
      type: 'object',
      patternProperties: {
        '^.*$': { type: 'boolean' }
      }
    }
  },
  required: ['name', 'owner']
};

const collectionName = 'Doors';
const Door = documentFactory(collectionName, schema);

Door.addUser = (door, user) => {
  const key = `users.${user.id}`;
  return Door.update(door.id, {
    [key]: true
  })
};

Door.sockDoor = (door, user) => {
  return Door.update(door.id, {
    sockOwner: user.id
  });
};

module.exports = Door;
