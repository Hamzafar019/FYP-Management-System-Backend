'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('Users', ['email'], {
      unique: true,
      name: 'unique_email_index', // You can customize the index name
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'unique_email_index');
  }
};
