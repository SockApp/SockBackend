const { User } = require('../models');

function createUserDoc(user) {
  return User.create({
    phoneNumber: user.phoneNumber
  }, user.uid);
}

module.exports = createUserDoc;
