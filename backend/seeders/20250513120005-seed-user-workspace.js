'use strict';

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const passwordHash = await bcrypt.hash("test123", 10);

    // Step 1: Create user (without setting ID)
    await queryInterface.bulkInsert('users', [
      {
        email: 'owner@example.com',
        username: 'Test Owner',
        phone: '9876543210',
        password: passwordHash,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Step 2: Get user ID
    const [user] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'owner@example.com' LIMIT 1;`
    );
    const userId = user[0].id;

    // Step 3: Create workspace with UUID
    const workspaceId = uuidv4();

    await queryInterface.bulkInsert('workspaces', [
      {
        id: workspaceId,
        name: "Owner's Workspace",
        createdBy: userId,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Step 4: Add to workspace_members
    await queryInterface.bulkInsert('workspace_members', [
      {
        id: uuidv4(),
        userId: userId,
        workspaceId,
        roleName: 'owner',
        invitedBy: userId,
        joinedAt: now,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('workspace_members', { roleName: 'owner' });
    await queryInterface.bulkDelete('workspaces', { name: "Owner's Workspace" });
    await queryInterface.bulkDelete('users', { email: 'owner@example.com' });
  }
};
