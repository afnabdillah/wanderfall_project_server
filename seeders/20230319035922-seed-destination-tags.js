'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const destinationTags = require('../data/destinationTags.json');
    destinationTags.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    })
    await queryInterface.bulkInsert('DestinationTags', destinationTags);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DestinationTags', null, {});
  }
};
