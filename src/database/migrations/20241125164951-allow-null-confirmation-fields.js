'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'confirmation_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'confirmation_code_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'confirmation_code_expires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'confirmation_code', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'confirmation_code_type', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'confirmation_code_expires', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
