'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Перейменування поля confirm_token -> confirmation_code
    await queryInterface.renameColumn('users', 'confirm_token', 'confirmation_code');

    // Перейменування поля confirm_token_type -> confirmation_code_type
    await queryInterface.renameColumn('users', 'confirm_token_type', 'confirmation_code_type');

    // Перейменування поля confirm_token_expires -> confirmation_code_expires
    await queryInterface.renameColumn('users', 'confirm_token_expires', 'confirmation_code_expires');
  },

  async down(queryInterface, Sequelize) {
    // Повернення назв полів назад
    await queryInterface.renameColumn('users', 'confirmation_code', 'confirm_token');
    await queryInterface.renameColumn('users', 'confirmation_code_type', 'confirm_token_type');
    await queryInterface.renameColumn('users', 'confirmation_code_expires', 'confirm_token_expires');
  },
};
