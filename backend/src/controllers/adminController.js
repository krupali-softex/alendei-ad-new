const { Op, literal } = require("sequelize");
const { sequelize } = require("../config/db");
const Workspace = require("../models/workspace");
const User = require("../models/user");
const WorkspaceMember = require("../models/workspaceMember");
const GlobalSettings = require('../models/globalSettings');


exports.getAllWorkspaces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const { rows: workspaces, count: total } = await Workspace.findAndCountAll({
      where: {
        name: { [Op.iLike]: `%${search}%` },
      },
      attributes: ["id", "name", "workspacePic", "yield"],
      order: [["createdAt", "DESC"]],
      offset,
      limit,
      distinct: true,
      include: [
        {
          model: WorkspaceMember,
          separate: true,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    const formattedWorkspaces = workspaces.map((ws) => {
      const ownerMember = ws.WorkspaceMembers?.find(
        (m) => m.roleName === "owner"
      );
      return {
        id: ws.id,
        name: ws.name,
        workspacePic: ws.workspacePic,
        yield: ws.yield,
        ownerName: ownerMember?.User?.username || null,
        totalMembers: ws.WorkspaceMembers?.length || 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Workspaces fetched successfully",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: formattedWorkspaces,
    });
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching workspaces",
    });
  }
};

exports.getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const members = await WorkspaceMember.findAll({
      where: { workspaceId },
      attributes: ["roleName", "joinedAt"],
      include: [
        {
          model: User,
          attributes: ["id", "username", "profilePic"],
        },
      ],
      order: [["joinedAt", "DESC"]],
    });

    if (!members.length) {
      return res.status(404).json({
        success: false,
        message: "No members found for this workspace",
      });
    }

    const formattedMembers = members.map((m) => ({
      id: m.User.id,
      name: m.User.username,
      profilePic: m.User.profilePic,
      role: m.roleName,
      joinedAt: m.joinedAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Workspace members fetched successfully",
      data: formattedMembers,
    });
  } catch (err) {
    console.error("Error fetching workspace members:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching workspace members",
    });
  }
};




exports.updateGlobalSettings = async (req, res) => {
  try {
    const { globalYield, globalMaxUsersPerWorkspace } = req.body;

    if (
      (globalYield !== undefined && globalYield < 0) ||
      (globalMaxUsersPerWorkspace !== undefined && globalMaxUsersPerWorkspace < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid values for global settings",
      });
    }

    let globalSettings = await GlobalSettings.findOne();

    if (!globalSettings) {
      // Create row if it doesn't exist
      globalSettings = await GlobalSettings.create({
        globalYield: globalYield ?? 0,
        maxUsersPerWorkspace: globalMaxUsersPerWorkspace ?? 10,
      });
    } else {
      // Update only the fields provided
      if (globalYield !== undefined) globalSettings.globalYield = globalYield;
      if (globalMaxUsersPerWorkspace !== undefined) globalSettings.maxUsersPerWorkspace = globalMaxUsersPerWorkspace;
      await globalSettings.save();
    }

    return res.status(200).json({
      success: true,
      message: "Global settings updated successfully",
      data: globalSettings,
    });
  } catch (err) {
    console.error("Error updating global settings:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating global settings",
    });
  }
};




exports.updateWorkspaceSettings = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { yield: newYield, maxUsersPerWorkspace: newMaxUsers } = req.body;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "workspaceId is required",
      });
    }

    if (
      (newYield !== undefined && newYield < 0) ||
      (newMaxUsers !== undefined && newMaxUsers < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid values for workspace settings",
      });
    }

    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (newYield !== undefined) workspace.yield = newYield;
    if (newMaxUsers !== undefined) workspace.maxUsersPerWorkspace = newMaxUsers;

    await workspace.save();

    return res.status(200).json({
      success: true,
      message: "Workspace settings updated successfully",
      data: {
        id: workspace.id,
        name: workspace.name,
        yieldPercentage: workspace.yield,
        maxUsersPerWorkspace: workspace.maxUsersPerWorkspace,
      },
    });
  } catch (err) {
    console.error("Error updating workspace settings:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating workspace settings",
    });
  }
};

exports.deleteWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  const t = await Workspace.sequelize.transaction();

  try {
    // 1) Lock the workspace row
    const workspace = await Workspace.findByPk(workspaceId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!workspace) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Workspace not found" });
    }

    // 2) Determine the creator (owner userId)
    const ownerUserId = workspace.createdBy;

    // 3) Count how many workspaces this user owns (must be > 1 to proceed)
    const ownedWorkspacesCount = await WorkspaceMember.count({
      where: { userId: ownerUserId, roleName: "owner" },
      transaction: t,
    });

    if (ownedWorkspacesCount <= 1) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot delete: this is the owner's last workspace.",
      });
    }

    const isOwnerHere = await WorkspaceMember.findOne({
      where: { userId: ownerUserId, workspaceId, roleName: "owner" },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    // 4) Delete members of this workspace
    await WorkspaceMember.destroy({
      where: { workspaceId },
      transaction: t,
    });

    // 5) Delete the workspace
    await Workspace.destroy({
      where: { id: workspaceId },
      transaction: t,
    });

    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Workspace deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error("Error deleting workspace:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error while deleting workspace",
      });
  }
};

/**
 * Superadmin can change user roles in a workspace
 * - Only 1 owner must always exist
 * - Admin <-> Member changes are allowed freely
 * - If promoting someone to owner, current owner is downgraded to admin
 */
exports.changeWorkspaceMemberRole = async (req, res) => {
  const { workspaceId, userId, newRole } = req.body;

  const t = await sequelize.transaction();

  try {
    // Validate workspace
    const workspace = await Workspace.findByPk(workspaceId, { transaction: t });
    if (!workspace) {
      await t.rollback();
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Validate target member
    const targetMember = await WorkspaceMember.findOne({
      where: { workspaceId, userId },
      transaction: t,
    });

    if (!targetMember) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Target member not found in this workspace" });
    }

    // Get current owner
    const currentOwner = await WorkspaceMember.findOne({
      where: { workspaceId, roleName: "owner" },
      transaction: t,
    });

    // Case 1: Promote someone to owner
    if (newRole === "owner") {
      if (currentOwner && currentOwner.userId !== userId) {
        // Downgrade current owner -> admin
        await currentOwner.update({ roleName: "admin" }, { transaction: t });
      }

      // Promote target user -> owner
      await targetMember.update({ roleName: "owner" }, { transaction: t });
    }
    // Case 2: Changing to admin/member (no restriction)
    else if (["admin", "member"].includes(newRole)) {
      // Prevent direct demotion of owner (must always exist)
      if (targetMember.roleName === "owner") {
        await t.rollback();
        return res.status(400).json({
          message:
            "Cannot directly demote the owner. Promote another user to owner first.",
        });
      }

      await targetMember.update({ roleName: newRole }, { transaction: t });
    }
    // Invalid role
    else {
      await t.rollback();
      return res.status(400).json({ message: "Invalid role provided" });
    }

    await t.commit();
    return res.status(200).json({ 
      sucess : true,
      message: "Role updated successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error changing role:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




exports.getSuperAdminSession = async (req, res) => {
  try {
    // Assuming you already attach superadmin details to `req.superAdmin` via JWT middleware
    if (!req.user.isSuperAdmin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no active session",
      });
    }

    // Return only name and email
    return res.status(200).json({
      success: true,
      data: {
        name: req.user.username,
        email: req.user.email,
      },
    });
  } catch (err) {
    console.error("Error fetching session:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching session",
    });
  }
};