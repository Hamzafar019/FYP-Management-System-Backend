'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Meetings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dateTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      student1: {
        type: Sequelize.ENUM('present', 'absent'),
        allowNull: true
      },
      student2: {
        type: Sequelize.ENUM('present', 'absent'),
        allowNull: true
      },
      student3: {
        type: Sequelize.ENUM('present', 'absent'),
        allowNull: true
      },
      done: {
        type: Sequelize.ENUM('yes', 'no', 'missed'),
        allowNull: false,
        defaultValue: 'no'
      },
      meetingMinutes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable('Meetings');
  }
};
