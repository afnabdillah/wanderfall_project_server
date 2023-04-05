const bcrypt = require('bcryptjs');

function hashPassword(password) {
  return bcrypt.hashSync(password);
}

function checkPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

module.exports = { hashPassword, checkPassword };