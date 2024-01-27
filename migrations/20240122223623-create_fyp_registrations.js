'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('FYP_registrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      student1: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      student2: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      student3: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      supervisor: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      accepted: {
        type: Sequelize.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'no',
      },
      viewed: {
        type: Sequelize.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'no',
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('FYP_registrations', {
      fields: ['student1'],
      type: 'foreign key',
      name: 'fk_student1_user',
      references: {
        table: 'Users',
        field: 'email',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('FYP_registrations', {
      fields: ['student2'],
      type: 'foreign key',
      name: 'fk_student2_user',
      references: {
        table: 'Users',
        field: 'email',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('FYP_registrations', {
      fields: ['student3'],
      type: 'foreign key',
      name: 'fk_student3_user',
      references: {
        table: 'Users',
        field: 'email',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('FYP_registrations', {
      fields: ['supervisor'],
      type: 'foreign key',
      name: 'fk_supervisor_user',
      references: {
        table: 'Users',
        field: 'email',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

  },

  async down (queryInterface, Sequelize) {
    // Remove foreign key constraints
    await queryInterface.removeConstraint('FYP_registrations', 'fk_student1_user');
    await queryInterface.removeConstraint('FYP_registrations', 'fk_student2_user');
    await queryInterface.removeConstraint('FYP_registrations', 'fk_student3_user');
    await queryInterface.removeConstraint('FYP_registrations', 'fk_supervisor_user');

    // Drop the FYP_registrations table
    await queryInterface.dropTable('FYP_registrations');

  }
};
