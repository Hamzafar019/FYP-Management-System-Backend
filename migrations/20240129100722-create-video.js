'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      supervisorEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      videoPath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      videoLink: {
        type: Sequelize.STRING,
        allowNull: true,
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


    await queryInterface.addConstraint('Videos', {
      fields: ['supervisorEmail'],
      type: 'foreign key',
      name: 'fk_supervisor_groups',
      references: {
        table: 'FYP_registrations',
        field: 'supervisor',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Videos', {
      fields: ['groupId'],
      type: 'foreign key',
      name: 'fk_groupid_groups',
      references: {
        table: 'FYP_registrations',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });




  },
  async down(queryInterface, Sequelize) {
    
    await queryInterface.removeConstraint('Videos', 'fk_supervisor_groups');
    await queryInterface.removeConstraint('Videos', 'fk_groupid_groups');
    await queryInterface.dropTable('Videos');
  }
};