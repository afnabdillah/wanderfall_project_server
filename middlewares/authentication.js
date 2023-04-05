const { verifyToken } = require("../helpers/jwt");
const { Users } = require('../models');

async function authentication(req, res, next) {
  try {
    if (!req.headers.access_token) {
      throw { name: 'Unauthorized' }
    }
    const payload = verifyToken(req.headers.access_token);
    const user = await Users.findByPk(payload.id);
    if (!user) {
      throw { name: 'Unauthorized' }
    }
    req.user = { id: user.id, username: user.username, email: user.email, type: user.type };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;