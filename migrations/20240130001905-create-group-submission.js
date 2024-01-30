'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Groupsubmissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      submissionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Submissions',
          key: 'id'
      }
    },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'FYP_registrations',
          key: 'id'
        }
      },
      supervisorMarks: {
        allowNull: true, // Change to false if supervisor marks are always required
        type: Sequelize.INTEGER
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

    
    await queryInterface.addConstraint('Groupsubmissions', {
      fields: ['submissionId'],
      type: 'foreign key',
      name: 'groupsubmission_submission',
      references: {
        table: 'Submissions',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('Groupsubmissions', {
      fields: ['groupId'],
      type: 'foreign key',
      name: 'groupsubmission_groupregistration',
      references: {
        table: 'FYP_registrations',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('groupsubmission_submission', 'groupsubmission_groupregistration');
    await queryInterface.dropTable('Groupsubmissions');
  }
};
