const test = require('firebase-functions-test', {
  projectId: 'sock-91ac3',
}, '../sock-91ac3-6546e2b9e653.json');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { assert, request } = chai;

describe('Sock', () => {
  const user1Id = 'user1Id';
  const user2Id = 'user2Id';
  let myFunctions;
  let doorId;
  admin.initializeApp(functions.config().firebase);
  const db = admin.firestore();

  const user1 = {
    firstName: 'Test',
    lastName: 'User1',
    phoneNumber: '2149733164'
  };

  const user2 = {
    firstName: 'Test',
    lastName: 'User2',
    phoneNumber: '1111111111'
  };

  const door = {
    name: 'New Room',
    location: {
      latitude: 12,
      longitude: 12
    }
  };

  before(async () => {
    myFunctions = require('../index');

    await db.collection('Users').doc(user1Id).set(user1);
    await db.collection('Users').doc(user2Id).set(user2);
  });

  after(async () => {
    await db.collection('Doors').doc(doorId).delete();
    await db.collection('Users').doc(user1Id).delete();
    await db.collection('Users').doc(user2Id).delete();
  });

  it('should create a door', () => {
    return request(myFunctions.door)
      .post('/')
      .send(door)
      .query({
        userId: user1Id
      })
      .then(async (res) => {
        assert.equal(res.status, 201);
        assert.property(res.body, 'doorId');
        doorId = res.body.doorId;
        const doc = await db.collection('Doors').doc(doorId).get();

        const target = Object.assign(
          {
            owner: user1Id,
            users: {
              [user1Id]: true
            }
          },
          door
        );
        assert.deepEqual(doc.data(), target);
      });
  });

  it('should add a user to the door', () => {
    return request(myFunctions.doorUser)
      .post('/')
      .query({
        doorId
      })
      .send({
        phoneNumber: '1111111111',
      })
      .then(async (res) => {
        assert.equal(res.status, 200);
        const doc = await db.collection('Doors').doc(doorId).get();
        const target = Object.assign(
          {
            owner: user1Id,
            users: {
              [user1Id]: true,
              [user2Id]: true
            }
          },
          door,
        );
        assert.deepEqual(doc.data(), target);
      });
  });

  it('should put a sock on the door', () => {
    return request(myFunctions.sockDoor)
      .post('/')
      .query({
        doorId,
        userId: user1Id
      })
      .then(async res => {
        assert.equal(res.status, 200);

        const door = await db.collection('Doors').doc(doorId).get();
        assert.equal(door.data().sockOwner, user1Id);
      });
  });

  it('should remove a sock from the door', () => {
    return request(myFunctions.removeSock)
      .delete('/')
      .query({
        doorId,
        userId: user1Id
      })
      .then(async res => {
        assert.equal(res.status, 200);
        const door = await db.collection('Doors').doc(doorId).get();
        assert.notProperty(door.data(), 'sockOwner');
      });
  });
});

