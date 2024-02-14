'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the Domainvideos table
    await queryInterface.createTable('Domainvideos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      domainname: {
        type: Sequelize.STRING,
        allowNull: false
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

    // Add index to the referenced column
    await queryInterface.addIndex('Domains', ['domainname']);
    // Add foreign key constraint
    await queryInterface.addConstraint('Domainvideos', {
      fields: ['domainname'],
      type: 'foreign key',
      name: 'fk_domainvideos_domains',
      references: {
        table: 'Domains',
        field: 'domainname',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

  },

  async down(queryInterface, Sequelize) {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('Domainvideos', 'fk_domainvideos_domains');

    // Drop the Domainvideos table
    await queryInterface.dropTable('Domainvideos');
  }
};
