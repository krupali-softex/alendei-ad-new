'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('permissions', [
      { key: 'create_workspace', description: 'Create new workspace', createdAt: now, updatedAt: now },
      { key: 'add_admin', description: 'Add new admin', createdAt: now, updatedAt: now },
      { key: 'add_member', description: 'Add member to workspace', createdAt: now, updatedAt: now },
      { key: 'delete_member', description: 'Remove a member', createdAt: now, updatedAt: now },
      { key: 'delete_admin', description: 'Remove an admin', createdAt: now, updatedAt: now },
      { key: 'manage_projects', description: 'Create/update/delete projects', createdAt: now, updatedAt: now },
      { key: 'view_dashboard', description: 'Access workspace dashboard', createdAt: now, updatedAt: now }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
