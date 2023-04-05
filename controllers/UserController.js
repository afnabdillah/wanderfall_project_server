const { checkPassword } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
const { sendMailWithNodeMailer } = require('../helpers/nodemailer');
const { Users, Profile } = require('../models');

class UserController {

  static async signup(req, res, next) {
    try {
      const newUser = await Users.create(req.body);
      await Profile.create({
        UserId : newUser.id,
        userPhoto : 'https://randomuser.me/api/portraits/lego/2.jpg'
      });
      sendMailWithNodeMailer(newUser.email);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        throw { name: 'InvalidUser' };
      }
      const isValid = checkPassword(password, user.password);
      if (!isValid) {
        throw { name: 'InvalidUser' };
      }
      const access_token = createToken({ id: user.id, email: user.email, username: user.username });
      res.status(200).json({ access_token, username: user.username });
    } catch (err) {
      next(err);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const user = req.user;
      const profile = await Profile.findOne({
        where : {UserId : user.id}
      })
      res.status(200).json(profile);
    } catch(err) {
      next(err);
    }
  }

  static async updateUserProfile(req, res, next) {
    try {
      const user = req.user;
      await Profile.update({...req.body}, {
        where : {
          UserId : user.id
        }
      })
      res.status(200).json({message : 'Your Profile Has Been Updated!'})
    } catch(err) {
      next(err);
    }
  }
}
module.exports = UserController;