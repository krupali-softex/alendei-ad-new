const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const {
  User,
  WorkspaceMember,
  Workspace,
  RolePermission,
  WorkspaceSetting,
  CampaignSetting,
  LinkedAccount,
  sequelize,
} = require("../models");
const userSessions = require("../utils/userSessionStore");
const { generateToken } = require("../utils/jwt");
//const { permission } = require("process");

// SIGNUP
exports.signup = async (req, res) => {
  let { email, username, password, phone, workspace_name } = req.body;

  email = email?.trim().toLowerCase();
  password = password?.trim();
  phone = phone?.trim();
  workspace_name = workspace_name?.trim();
  username = username?.trim();

  const t = await sequelize.transaction();

  if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ error: "Invalid or missing email." });
  }

  if (!username || username.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters." });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });
  }

  //if (!phone || !/^\d{10}$/.test(phone)) {
  // return res.status(400).json({ error: "Phone must be a valid 10-digit number." });
  //}

  if (!workspace_name || workspace_name.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Workspace name must be at least 2 characters." });
  }
  try {
    // 1. Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already in use" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user (within transaction)
    const newUser = await User.create(
      {
        email,
        phone,
        username,
        password: hashedPassword,
      },
      { transaction: t }
    );

    // 4. Create workspace (within transaction)
    const workspaceId = uuidv4();

    const newWorkspace = await Workspace.create(
      {
        id: workspaceId,
        name: workspace_name,
        createdBy: newUser.id,
      },
      { transaction: t }
    );

    // 5. Add user as owner (within transaction)
    await WorkspaceMember.create(
      {
        id: uuidv4(),
        userId: newUser.id,
        workspaceId,
        roleName: "owner",
        invitedBy: newUser.id,
        joinedAt: new Date(),
      },
      { transaction: t }
    );

    // 6. All good → commit
    await t.commit();

    return res.status(201).json({
      success: true,
      message: "User and workspace created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
      workspace: {
        id: workspaceId,
        name: workspace_name,
        role: "owner",
      },
    });
  } catch (err) {
    // Rollback everything on error
    await t.rollback();
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Signup failed" });
  }
};

//  LOGIN
exports.login = async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim(); //.toLowerCase();
  password = password?.trim();

  try {
    // Step 1: Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (user.isSuperAdmin) {
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        isSuperAdmin: true,
      });

      return res.status(200).json({
        success: true,
        message: "Super Admin logged in successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isSuperAdmin: true,
        },
      });
    }

    // Step 2: Find all workspaces the user is part of
    const memberships = await WorkspaceMember.findAll({
      where: { userId: user.id },
      include: { model: Workspace },
      order: [["joinedAt", "ASC"]],
    });

    if (!memberships.length) {
      return res
        .status(403)
        .json({ message: "User is not part of any workspace" });
    }

    // Step 3: Use first workspace as default
    const defaultMember = memberships[0];
    const workspaceId = defaultMember.workspaceId;
    const roleName = defaultMember.roleName;

    //get the all the permission according to role
    const permission = await RolePermission.findAll({
      attributes: ["permissionKey"],
      where: { roleName },
    });

    const flatPermissions = permission.map((p) => p.permissionKey);

    // Step 4: Get all members in the default workspace
    const allMembers = await WorkspaceMember.findAll({
      where: { workspaceId },
      include: {
        model: User,
        attributes: ["id", "username", "email"],
      },
    });

    const members = allMembers.map((m) => ({
      id: m.User.id,
      name: m.User.username,
      email: m.User.email,
      role: m.roleName,
    }));

    // Step 5: Build workspace summary
    const defaultWorkspace = {
      id: workspaceId,
      name: defaultMember.Workspace?.name,
      yourRole: defaultMember.roleName,
      members,
    };

    // Step 6: Build token
    const token = generateToken({
      id: user.id,
      email: user.email,
      currentWorkspaceId: workspaceId,
      isSuperAdmin: user.isSuperAdmin

    });

    // Step 7: Build workspace list
    const workspaces = memberships.map((m) => ({
      id: m.workspaceId,
      name: m.Workspace?.name,
      role: m.roleName,
    }));

    // Final response
    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      token,
      flatPermissions,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      defaultWorkspace,
      workspaces,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//  SWITCH WORKSPACE
exports.switchWorkspace = async (req, res) => {
  const userId = req.user.id;
  const email = req.user.email;
  const prevWorkspaceId = req.user?.currentWorkspaceId;
  const { workspaceId } = req.body;

  if (userId && prevWorkspaceId) {
    const sessionKey = `${userId}-${prevWorkspaceId}`;
    delete userSessions[sessionKey];
  }

  try {
    // 1. Verify user is a member of that workspace
    const selectedMember = await WorkspaceMember.findOne({
      where: { userId, workspaceId },
      include: { model: Workspace },
    });

    if (!selectedMember) {
      return res.status(403).json({
        success: false,
        message: "You are not part of the selected workspace",
      });
    }
    const roleName = selectedMember.roleName;

    //get the all the permission according to role
    const permission = await RolePermission.findAll({
      attributes: ["permissionKey"],
      where: { roleName },
    });

    const flatPermissions = permission.map((p) => p.permissionKey);

    // 2. Fetch all members in the selected workspace
    const allMembers = await WorkspaceMember.findAll({
      where: { workspaceId },
      include: {
        model: User,
        attributes: ["id", "username", "email"],
      },
    });

    const members = allMembers.map((m) => ({
      id: m.User.id,
      name: m.User.username,
      email: m.User.email,
      role: m.roleName,
    }));

    const defaultWorkspace = {
      id: workspaceId,
      name: selectedMember.Workspace?.name,
      yourRole: selectedMember.roleName,
      members,
    };

    // 3. Create new token with updated workspaceId
    const token = generateToken({
      id: userId,
      email: email,
      currentWorkspaceId: workspaceId,
    });

    // 4. Get all workspaces the user is part of
    const memberships = await WorkspaceMember.findAll({
      where: { userId },
      include: { model: Workspace },
      order: [["joinedAt", "ASC"]],
    });

    const workspaces = memberships.map((m) => ({
      id: m.workspaceId,
      name: m.Workspace?.name,
      role: m.roleName,
    }));

    return res.json({
      success: true,
      message: "workspace switeched successfully",
      token,
      flatPermissions,
      defaultWorkspace,
      workspaces,
    });
  } catch (err) {
    console.error("Switch workspace error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// to restore data on hard refresh
exports.getSession = async (req, res) => {
  const userId = req.user.id;
  const workspaceId = req.user.currentWorkspaceId;

  try {
    const user = await User.findByPk(userId);

    const member = await WorkspaceMember.findOne({
      where: { userId, workspaceId },
      include: { model: Workspace, include: [WorkspaceSetting] },
    });

    if (!member) {
      return res.status(403).json({ message: "Not part of this workspace" });
    }

    const campaign_setting = await CampaignSetting.findOne({
      where: { workspaceId },
    });
    const defaultSetting = {
      gender: "All",
      targetAreas: [],
    };

    const members = await WorkspaceMember.findAll({
      where: { workspaceId },
      include: { model: User },
    });

    const allWorkspaces = await WorkspaceMember.findAll({
      where: { userId },
      include: { model: Workspace },
    });

    const linkedPages = await LinkedAccount.findAll({
      where: { workspaceId },
      attributes: ["pageId", "name", "pageStatus", "pageProfilepic"],
    });

    const pages = linkedPages.map((p) => ({
      pageId: p.pageId,
      name: p.name,
      pageStatus: p.pageStatus,
      pageProfilepic : p.pageProfilepic
    }));

    return res.json({
      success: true,
      message: "data fetched successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        imageUrl: user.profilePic,
      },
      defaultWorkspace: {
        id: member.workspaceId,
        name: member.Workspace.name,
        yourRole: member.roleName,
        imageUrl: member.Workspace.workspacePic,

        settings:
          {
            business_category:
              member.Workspace?.WorkspaceSetting?.businessCategory || "General",
            currency: member.Workspace?.WorkspaceSetting?.currency || "INR",
            timezone:
              member.Workspace?.WorkspaceSetting?.timezone || "Asia/Kolkata",
            financial_year:
              member.Workspace?.WorkspaceSetting?.financialYear || "2025/26",
            enable_notification:
              member.Workspace?.WorkspaceSetting?.enableNotification == false
                ? false
                : true,
          } || {},

        members: members.map((m) => ({
          id: m.userId,
          name: m.User.username,
          email: m.User.email,
          role: m.roleName,
          imageUrl: m.User.profilePic,
        })),
        linkedPages: pages,

        campaignSetting: campaign_setting
          ? {
              gender: campaign_setting.gender,
              targetAreas: campaign_setting.targetAreas,
            }
          : defaultSetting,
      },
      workspaces: allWorkspaces.map((m) => ({
        id: m.Workspace.id,
        name: m.Workspace.name,
        role: m.roleName,
        imageUrl: m.Workspace.workspacePic,
      })),
    });
  } catch (err) {
    console.error("Session restore error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.user?.id;
  const { newUsername } = req.body;

  if (!newUsername || typeof newUsername !== "string") {
    return res.status(400).json({ message: "Invalid or missing username." });
  }

  const trimmedName = newUsername.trim();

  if (trimmedName.length < 3 || trimmedName.length > 30) {
    return res
      .status(400)
      .json({ message: "Username must be 3-30 characters long." });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.username = trimmedName;
    await user.save();

    return res.json({
      success: true,
      message: "Username updated successfully.",
      username: trimmedName,
    });
  } catch (err) {
    console.error("Update username error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//Logout Controller && Clear Session Data
exports.logout = (req, res) => {
  const userId = req.user?.id;
  const workspaceId = req.user?.currentWorkspaceId;

  if (userId && workspaceId) {
    const sessionKey = `${userId}-${workspaceId}`;
    delete userSessions[sessionKey];
    return res.json({ message: "Session cleared successfully." });
  }

  return res.status(400).json({ message: "User or workspace not found." });
};
