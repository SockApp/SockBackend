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

  before(async () => {
    myFunctions = require('../index');

    await db.collection('Users').doc(user1Id).set({
      firstName: 'Test',
      lastName: 'User1',
      phoneNumber: '2149733164'
    });

    await db.collection('Users').doc(user2Id).set({
      firstName: 'Test',
      lastName: 'User2',
      phoneNumber: '1111111111'
    });
  });

  after(async () => {
    await db.collection('Doors').doc(doorId).delete();
    await db.collection('DoorUsers').where('doorId', '==', doorId).get()
      .then((querySnapshot) => {
        // Once we get the results, begin a batch
        const batch = db.batch();

        querySnapshot.forEach(doc =>  {
          // For each doc, add a delete operation to the batch
          batch.delete(doc.ref);
        });

        // Commit the batch
        return batch.commit();
      });
  });

  it('should create a door', () => {
    const data = {
      name: 'New Room',
      location: {
        latitude: 12,
        longitude: 12
      }
    };

    return request(myFunctions.door)
      .post('/')
      .send(data)
      .query({
        userId: user1Id
      })
      .then(async (res) => {
        assert.equal(res.status, 201);
        assert.property(res.body, 'doorId');
        doorId = res.body.doorId;
        const doc = await db.collection('Doors').doc(doorId).get();
        assert.deepEqual(doc.data(), Object.assign({ owner: user1Id }, data));

        const snapshot = await db.collection('DoorUsers')
          .where('doorId', '==', doorId)
          .get();
        assert.equal(snapshot.docs.length, 1);
        assert.deepEqual(snapshot.docs[0].data(), {
          doorId,
          userId: user1Id
        });
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
        assert.equal(res.status, 201);
        const snapshot = await db.collection('DoorUsers')
          .where('doorId', '==', doorId)
          .where('userId', '==', user2Id)
          .get();
        assert.equal(snapshot.docs.length, 1);
        assert.deepEqual(snapshot.docs[0].data(), {
          doorId,
          userId: user2Id
        });
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

