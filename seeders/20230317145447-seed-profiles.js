'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const profiles = require('../data/profiles.json');
    profiles.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    })
    await queryInterface.bulkInsert('Profiles', profiles);
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Profiles', null, {});
  }
};
