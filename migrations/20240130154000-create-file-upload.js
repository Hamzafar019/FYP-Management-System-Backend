'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('FileUploads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupsubmissionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Groupsubmissions',
          key: 'id'
        }
      },
      fileData: {
        allowNull: false,
        type: Sequelize.BLOB('long')
      },
      fileExtension: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.addConstraint('FileUploads', {
      fields: ['groupsubmissionId'],
      type: 'foreign key',
      name: 'fileUpload_groupsubmission',
      references: {
        table: 'Groupsubmissions',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('fileUpload_groupsubmission');
    await queryInterface.dropTable('FileUploads');
  }
};
