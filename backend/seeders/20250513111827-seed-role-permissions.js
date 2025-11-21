'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    console.log('Seeding role_permissions...');
    await queryInterface.bulkInsert('role_permissions', [
      // Owner
      { id: uuidv4(), roleName: 'owner', permissionKey: 'create_workspace', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'owner', permissionKey: 'add_admin', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'owner', permissionKey: 'add_member', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'owner', permissionKey: 'delete_admin', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'owner', permissionKey: 'delete_member', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'owner', permissionKey: 'manage_projects', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'owner', permissionKey: 'view_dashboard', createdAt: now, updatedAt: now },

      // Admin
      { id: uuidv4(), roleName: 'admin', permissionKey: 'add_member', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'admin', permissionKey: 'delete_member', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'admin', permissionKey: 'manage_projects', createdAt: now, updatedAt: now },
      { id: uuidv4(), roleName: 'admin', permissionKey: 'view_dashboard', createdAt: now, updatedAt: now },

      // Member
      { id: uuidv4(), roleName: 'member', permissionKey: 'view_dashboard', createdAt: now, updatedAt: now }
    ]);
   console.log('Role permissions seeded successfully.'); 
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
    
  }
  
};
