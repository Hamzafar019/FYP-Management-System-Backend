'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      route: {
        type: Sequelize.STRING,
        allowNull: false
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

    await queryInterface.sequelize.query(`
    CREATE EVENT IF NOT EXISTS delete_old_notifications
    ON SCHEDULE EVERY 2 MINUTE
    DO
      DELETE FROM Notifications WHERE createdAt < NOW() - INTERVAL 2 MINUTE;
  `);;
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP EVENT IF EXISTS delete_old_notifications;
  `);
    await queryInterface.dropTable('Notifications');
  }
};
