// In userController.js or workspaceController.js
const User = require("../models/user");
const Workspace = require("../models/workspace");
 
exports.uploadProfilePic = async (req, res) => {
  const userId = req.user?.id;
  if (!req.file) return res.status(400).json({ error: "Image is required." });
 
  const imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
 
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
 
    user.profilePic = imageUrl;
    await user.save();
 
    return res.json({ success : true, message: "Profile picture updated.", url: imageUrl });
  } catch (err) {
    console.error("Profile upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
 
exports.uploadWorkspacePic = async (req, res) => {
  const userId = req.user?.id;
  const workspaceId = req.user.currentWorkspaceId;
 
  if (!req.file) return res.status(400).json({ error: "Image is required." });
 
  const imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
 
  try {
    const workspace = await Workspace.findOne({
      where: { id: workspaceId, createdBy: userId },
    });
 
    if (!workspace) return res.status(404).json({ error: "Workspace not found or access denied" });
 
    workspace.workspacePic = imageUrl;
    await workspace.save();
 
    return res.json({ success : true , message: "Workspace picture updated.", url: imageUrl });
  } catch (err) {
    console.error("Workspace upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
 
 
