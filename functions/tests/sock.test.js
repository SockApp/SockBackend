const admin = require('firebase-admin');
const functions = require('firebase-functions');
const chai = require('chai');
const chaiHttp = require('chai-http');
const createApp = require('../app');

chai.use(chaiHttp);
const { assert, request } = chai;

describe('Sock', () => {
  const user1Id = 'user1Id';
  const user2Id = 'user2Id';
  let app;
  let doorId;
  let authUser;

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
    app = createApp({ auth: authStub });

    await db.collection('Users').doc(user1Id).set(user1);
    await db.collection('Users').doc(user2Id).set(user2);
  });

  after(async () => {
    await db.collection('Doors').doc(doorId).delete();
    await db.collection('Users').doc(user1Id).delete();
    await db.collection('Users').doc(user2Id).delete();
  });

  it('should create a door', () => {
    authUser = { uid: user1Id };

    return request(app)
      .post('/doors')
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
    authUser = { uid: user1Id };

    return request(app)
      .post(`/doors/${doorId}/users`)
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
    authUser = { uid: user2Id };

    return request(app)
      .post(`/doors/${doorId}/sock`)
      .then(async res => {
        assert.equal(res.status, 200);

        const door = await db.collection('Doors').doc(doorId).get();
        assert.equal(door.data().sockOwner, authUser.uid);
      });
  });

  it('should remove a sock from the door', () => {
    authUser = { uid: user2Id };
    return request(app)
      .delete(`/doors/${doorId}/sock`)
      .then(async res => {
        assert.equal(res.status, 200);
        const door = await db.collection('Doors').doc(doorId).get();
        assert.notProperty(door.data(), 'sockOwner');
      });
  });

  function authStub(req, res, next) {
    req.user = authUser;
    next();
  }
});

