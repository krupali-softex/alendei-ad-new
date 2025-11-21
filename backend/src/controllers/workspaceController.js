const { User, WorkspaceMember, Workspace, WorkspaceSetting,sequelize } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../utils/mailer");
const { hasPermission } = require("../utils/permissions");
const { generateToken } = require("../utils/jwt");
const { Op } = require("sequelize");


const allowedRoles = ["admin", "owner", "member"];

const normalizeName = (name) =>
  name.toLowerCase().replace(/[\s_-]/g, "").trim();



// Invite a Member to be a part of a Workspace.
exports.inviteMember = async (req, res) => {
 // console.log("Entered inviteMember");
  const email = req.body.email;//?.trim().toLowerCase();
  const roleName = req.body.roleName?.trim().toLowerCase();
  const userId = req.user.id;
  const workspaceId = req.user.currentWorkspaceId;
  console.log("Invite Member called with:", { email, roleName, userId, workspaceId });
  if (!email || !roleName) {
    return res.status(400).json({ message: "Email and role are required." });
  }                     

   if (roleName === "owner") {
    return res.status(400).json({ message: "You cannot invite someone as owner." });
  }

   if (!allowedRoles.includes(roleName)) {
    return res.status(400).json({ message: "Invalid role provided." });
  }

  try {

    const inviterMember = await WorkspaceMember.findOne({
     where: { userId, workspaceId }
    });

     if (!inviterMember) {
     return res.status(403).json({
     message: "You are not a member of this workspace.",
    });
   }

    const targetUser = await User.findOne({ where: { email } });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const existing = await WorkspaceMember.findOne({
      where: { userId: targetUser.id, workspaceId },
    });
    if (existing) return res.status(400).json({ message: "Already a member" });

    //  Dynamic permission check based on target role
    const permissionKey = `add_${roleName}`;
    const canInvite = await hasPermission(userId, workspaceId, permissionKey);

    if (!canInvite) {
      return res.status(403).json({
        message: `You do not have permission to invite a user as ${roleName}.`,
      });
    }

    await WorkspaceMember.create({
      id: uuidv4(),
      userId: targetUser.id,
      workspaceId,
      roleName: roleName,
      invitedBy: userId,
      joinedAt: new Date(),
    });

    const workspace = await Workspace.findByPk(workspaceId);
    const inviter = await User.findByPk(userId);

    const member = await WorkspaceMember.findOne({
      where: { userId, workspaceId },
      include: { model: Workspace },
    });

    const members = await WorkspaceMember.findAll({
      where: { workspaceId },
      include: { model: User },
    });

  
       // console.log(" Member created, sending email now");
    try {
       await sendMail({
        to: email,
        subject: `You've been invited to join ${workspace.name}`,
        html: `
      <p>Hello,</p>
      <p><strong>${inviter.username}</strong> has invited you to join the workspace <strong>${workspace.name}</strong> as a <strong>${roleName}</strong>.</p>
      <p><a href="https://yourfrontend.com/login">Click here to login or create your account</a></p>
      <p>— The Team</p>
    `
      });
    } catch (emailErr) {
      console.log("Email sending failed, but invite succeeded:", emailErr);
    }
//console.log("Email function returned");
    return res.status(201).json({
      success: true,
      message: "User invited and email sent",
      defaultWorkspace: {
        id: member.workspaceId,
        name: member.Workspace.name,
        yourRole: member.roleName,
        members: members.map((m) => ({
          id: m.userId,
          name: m.User.username,
          email: m.User.email,
          role: m.roleName,
          imageUrl: m.User.profilePic || null,
        })),
      },
    });
  } catch (err) {
    console.error("Invite error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};





//To get all the workSpace
exports.getUserWorkspaces = async (req, res) => {
  const userId = req.user.id;

  try {
    const workspaces = await Workspace.findAll({
      include: [
        {
          model: WorkspaceMember,
          where: { userId },
          attributes: ["roleName"],
        },
      ],
      order: [["name", "ASC"]],
    });

    const result = workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      role: ws.WorkspaceMembers[0]?.roleName,
    }));

    return res.json({ success: true, workspaces: result });
  } catch (err) {
    console.error("Error fetching user workspaces:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};





//To create a new workspace
exports.createWorkspace = async (req, res) => {
  const userId = req.user.id;
  const { workspace_name } = req.body;

  // Basic validation
  if (!workspace_name || typeof workspace_name !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing 'workspace_name'.",
    });
  }

  

  const normalized = normalizeName(workspace_name);

  try {
    const existingWorkspaces = await Workspace.findAll({
      include: {
        model: WorkspaceMember,
        where: {
          userId,
          roleName: "owner",
        },
      },
    });

    const duplicate = existingWorkspaces.find(
      (ws) => normalizeName(ws.name) === normalized
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "You already have a workspace with a similar name.",
      });
    }

    const workspaceId = uuidv4();

    await Workspace.create({
      id: workspaceId,
      name: workspace_name,
      createdBy: userId,
    });

    await WorkspaceMember.create({
      id: uuidv4(),
      userId,
      workspaceId,
      roleName: "owner",
      invitedBy: userId,
      joinedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "workspace created successfully",
      workspaceId,
    });
  } catch (err) {
    console.error("Create Workspace error:", err);

    // Return appropriate error message
    return res.status(500).json({
      success: false,
      message: "Failed to create workspace. Please try again later.",
    });
  }
};





//Delete User from Workspace
exports.removeMember = async (req, res) => {
  const userId = req.user.id;
  const workspaceId = req.user.currentWorkspaceId;
  const { memberId } = req.params;

  try {
    //  Prevent user from deleting themselves
    if (userId === memberId) {
      return res.status(400).json({ message: "You cannot remove yourself." });
    }

    //  Find target member
    const targetMember = await WorkspaceMember.findOne({
      where: { userId: memberId, workspaceId },
    });

    if (!targetMember) {
      return res
        .status(404)
        .json({ message: "Member not found in this workspace." });
    }

    //  Prevent deleting workspace owner
    if (targetMember.roleName === "owner") {
      return res
        .status(403)
        .json({ message: "You cannot remove the workspace owner." });
    }

    //  Determine permission key based on target's role
    const requiredPermission = `delete_${targetMember.roleName}`; // e.g., "delete_member", "delete_admin"

    const allowed = await hasPermission(
      userId,
      workspaceId,
      requiredPermission
    );

    if (!allowed) {
      return res
        .status(403)
        .json({
          message: `You do not have permission to remove a ${targetMember.roleName}.`,
        });
    }
    //  Delete the member
    await WorkspaceMember.destroy({
      where: { userId: memberId, workspaceId },
    });

    //  Fetch updated workspace info

    const member = await WorkspaceMember.findOne({
      where: { userId, workspaceId },
      include: { model: Workspace },
    });

    const members = await WorkspaceMember.findAll({
      where: { workspaceId },
      include: { model: User },
    });

    return res.status(200).json({
      message: `${targetMember.roleName} removed successfully.`,
       success: true,
      defaultWorkspace: {
        id: member.workspaceId,
        name: member.Workspace.name,
        yourRole: member.roleName,
        members: members.map((m) => ({
          id: m.userId,
          name: m.User.username,
          email: m.User.email,
          role: m.roleName,
          imageUrl : m.User.profilePic

        })),
      },
    });
  } catch (err) {
    console.error("Remove member error:", err);
    return res
      .status(500)
      .json({ message: "Server error while removing member." });
  }
};





//Delete Workspace
exports.deleteWorkspace = async (req, res) => {
  const userId = req.user.id;
  const currentWorkspaceId = req.user.currentWorkspaceId;
  const { workspaceId } = req.params;

  try {
    const membership = await WorkspaceMember.findOne({
      where: { userId, workspaceId }
    });

    if (!membership) {
      return res.status(403).json({ message: "You're not a member of this workspace." });
    }

    if (membership.roleName !== "owner") {
      return res.status(403).json({ message: "Only the owner can delete the workspace." });
    }

    const allWorkspacesBefore = await WorkspaceMember.findAll({
      where: { userId },
      include: { model: Workspace }
    });

    const ownerWorkspaces = allWorkspacesBefore.filter(w => w.roleName === 'owner');
    if (ownerWorkspaces.length <= 1 ){//&& workspaceId === currentWorkspaceId) {
      return res.status(400).json({ message: "You cannot delete your only workspace." });
    }

    // Delete workspace and all members
    await WorkspaceMember.destroy({ where: { workspaceId } });
    await Workspace.destroy({ where: { id: workspaceId } });

    let token = null;
    let defaultWorkspace = null;

    // If deleted workspace is current, switch to another
    if (workspaceId === currentWorkspaceId) {
      const remaining = allWorkspacesBefore.filter(w => w.workspaceId !== workspaceId);
      const switchTo = remaining[0];

      if (!switchTo) {
        return res.status(500).json({ message: "No remaining workspace to switch to." });
      }

      token = generateToken({
        id: userId,
        email: req.user.email,
        currentWorkspaceId: switchTo.workspaceId
      });

      const members = await WorkspaceMember.findAll({
        where: { workspaceId: switchTo.workspaceId },
        include: { model: User }
      });

      defaultWorkspace = {
        id: switchTo.workspaceId,
        name: switchTo.Workspace.name,
        yourRole: switchTo.roleName,
        members: members.map(m => ({
          id: m.userId,
          name: m.User.username,
          email: m.User.email,
          role: m.roleName
        }))
      };
    }

    // Fetch updated list of workspaces
    const updatedWorkspaces = await WorkspaceMember.findAll({
      where: { userId },
      include: { model: Workspace }
    });

    const workspaces = updatedWorkspaces.map(m => ({
      id: m.workspaceId,
      name: m.Workspace.name,
      yourRole: m.roleName
    }));

    return res.json({
      success:true,
      message: "Workspace deleted successfully.",
      ...(token && { token }),
      ...(defaultWorkspace && { defaultWorkspace }),
      workspaces
    });

  } catch (err) {
    console.error("Delete workspace error:", err);
    return res.status(500).json({ message: "Server error while deleting workspace." });
  }
};





// Leave workspace willfully....
exports.leaveWorkspace = async (req, res) => {
  const userId = req.user.id;
  const { workspaceId } = req.body;

  if (!workspaceId) {
    return res.status(400).json({ message: "Workspace ID is required." });
  }

  try {
    // Find the member record
    const member = await WorkspaceMember.findOne({
      where: { userId, workspaceId },
    });

    if (!member) {
      return res
        .status(404)
        .json({ message: "You are not part of this workspace." });
    }

    // Don't allow owner to leave
    if (member.roleName === "owner") {
      return res
        .status(403)
        .json({ message: "Workspace owner cannot leave the workspace." });
    }

    // Delete the membership record
    await WorkspaceMember.destroy({
      where: { userId, workspaceId },
    });

    // Optionally: Fetch user's remaining workspaces
    const remainingWorkspaces = await WorkspaceMember.findAll({
      where: { userId },
      include: {
        model: Workspace,
        attributes: ["id", "name"],
      },
    });

    return res.status(200).json({
       success: true,
      message: "You have left the workspace successfully.",
      workspaces: remainingWorkspaces.map((wm) => ({
        id: wm.Workspace.id,
        name: wm.Workspace.name,
        role: wm.roleName,
      })),
    });
  } catch (err) {
    console.error("Leave workspace error:", err);
    return res
      .status(500)
      .json({ message: "Server error while leaving workspace." });
  }
};




exports.updateWorkspace = async (req, res) => {
  const userId = req.user.id;
  const workspaceId =  req.user.currentWorkspaceId;
  const { workspace_name } = req.body;

  try {
    //  Validate input
    if (!workspace_name || typeof workspace_name !== "string") {
      return res.status(400).json({ message: "Invalid workspace name" });
    }

    const normalizedNewName = normalizeName(workspace_name);

    //  Fetch workspace
    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    //  Check if user is the owner
    const owner = await WorkspaceMember.findOne({
      where: { userId, workspaceId, roleName: "owner" },
    });

    if (!owner) {
      return res.status(403).json({
        message: "Only the owner can update the workspace",
      });
    }

    //  Check for duplicate name (normalized) among other workspaces owned by user
    const otherWorkspaces = await Workspace.findAll({
      where: {
        createdBy: userId,
        id: { [Op.ne]: workspaceId },
      },
    });

    const isDuplicate = otherWorkspaces.some(
      (ws) => normalizeName(ws.name) === normalizedNewName
    );

    if (isDuplicate) {
      return res.status(409).json({
        message: "You already have a workspace with a similar name",
      });
    }

    //  Update and save the name
    workspace.name = workspace_name.trim();

    await workspace.save();

    return res.json({
      success: true,
      message: "Workspace name updated successfully",
      updatedName: workspace.name,
    });
  } catch (err) {
    console.error("Update workspace error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




exports.updateMemberRole = async (req, res) => {
  const actingUserId = req.user.id;
  const workspaceId = req.user.currentWorkspaceId;
  const targetUserId = req.params.targetUserId;
  const newRoleRaw = req.body.newRole;

  // Normalize the role input
  const newRole = newRoleRaw?.toString().trim().toLowerCase();

  const allowedRoles = ["admin", "member"];

  try {
    // Prevent self-role change
    if (parseInt(targetUserId) === actingUserId) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    // Validate role
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role. Only 'admin' or 'member' allowed." });
    }

    // Check if acting user is an owner
    const actingUserMembership = await WorkspaceMember.findOne({
      where: { userId: actingUserId, workspaceId },
    });

    if (!actingUserMembership || actingUserMembership.roleName !== "owner") {
      return res.status(403).json({ message: "Only owners can update member roles" });
    }

    // Fetch target user’s membership in this workspace
    const targetMembership = await WorkspaceMember.findOne({
      where: { userId: targetUserId, workspaceId },
    });

    if (!targetMembership) {
      return res.status(404).json({ message: "User not found in workspace" });
    }

    // Update role
    targetMembership.roleName = newRole;
    await targetMembership.save();

    return res.json({ success: true, message: `User role updated to '${newRole}'` });
  } catch (err) {
    console.error("Update role error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.saveWorkspaceSettings = async (req, res) => {
  const workspaceId = req.user.currentWorkspaceId;
  const updates = req.body;

  try {
    // Check if settings already exist for the workspace
    const existing = await WorkspaceSetting.findOne({ where: { workspaceId } });

    if (existing) {
      // Safely merge existing data with new updates
      const updatedData = {
        businessCategory: updates.business_category ?? existing.businessCategory,
        currency: updates.currency ?? existing.currency,
        timezone: updates.timezone ?? existing.timezone,
        financialYear: updates.financial_year ?? existing.financialYear,
        enableNotification: updates.enable_notification ?? existing.enableNotification,
      };

      await existing.update(updatedData);

      return res.status(200).json({
        success: true,
        message: "Workspace settings updated successfully.",
      });
    } else {
      // Create new settings entry
      await WorkspaceSetting.create({
        workspaceId,
        businessCategory: updates.business_category ?? null,
        currency: updates.currency ?? null,
        timezone: updates.timezone ?? null,
        financialYear: updates.financial_year ?? null,
        enableNotification: updates.enable_notification ?? null,

      });

      return res.status(201).json({
        success: true,
        message: "Workspace settings created successfully.",
      });
    }
  } catch (error) {
    console.error("Workspace setting error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while saving workspace settings.",
    });
  }
};
