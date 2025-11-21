const { sequelize } = require("../config/db");

const User = require("./user");
//const Role = require("./role");
const AdDetail = require("./addetail");
const PaymentDetail = require("./paymentdetail");
const BillingDetail = require("./billingdetail");
const Profile = require("./profile");
const Workspace = require('./workspace');
const WorkspaceMember = require('./workspaceMember');
const Permission = require('./permission');
const RolePermission = require('./rolePermission');
const AdDraft = require('./addraft');
const WorkspaceSetting = require('./workspaceSetting');
const LinkedAccount = require('./linkedAccounts');
const CampaignSetting = require('./campaignSetting')
const State = require('./state');
const City = require('./city');




//  Role-user Relationship
// Role.hasMany(User, { foreignKey: "id_role" }); // A role can have multiple user
// User.belongsTo(Role, { foreignKey: "id_role" }); // A user belongs to one role

//  user-Ad Relationships
User.hasMany(AdDetail, { foreignKey: "id_users", onDelete: "CASCADE" });
AdDetail.belongsTo(User, { foreignKey: "id_users" });

//  user-Payment Relationships
User.hasMany(PaymentDetail, { foreignKey: "id_users", onDelete: "CASCADE" });
PaymentDetail.belongsTo(User, { foreignKey: "id_users" });

//  Associations for AdDraft
User.hasMany(AdDraft, { foreignKey: "id_users", onDelete: "CASCADE" });
AdDraft.belongsTo(User, { foreignKey: "id_users" });

//  User-Billing Relationships (Fixed to One-to-One)
User.hasOne(BillingDetail, { foreignKey: "id_users", onDelete: "CASCADE" }); // A user has one billing detail
BillingDetail.belongsTo(User, { foreignKey: "id_users" }); // A billing detail belongs to one user

//  One-to-One Relationships: user-Profile
User.hasOne(Profile, { foreignKey: "id_users", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "id_users" });

// workspace relationships
User.hasMany(Workspace, { foreignKey: 'createdBy' });
Workspace.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Workspace.hasMany(WorkspaceMember, { foreignKey: 'workspaceId' });
User.hasMany(WorkspaceMember, { foreignKey: 'userId' });

WorkspaceMember.belongsTo(User, { foreignKey: 'userId' });
WorkspaceMember.belongsTo(Workspace, { foreignKey: 'workspaceId' });

// permission relationships
Permission.hasMany(RolePermission, { foreignKey: 'permissionKey', sourceKey: 'key' });
RolePermission.belongsTo(Permission, { foreignKey: 'permissionKey', targetKey: 'key' });


// One-to-One: Workspace → WorkspaceSetting
Workspace.hasOne(WorkspaceSetting, { foreignKey: 'workspaceId', onDelete: 'CASCADE' });
WorkspaceSetting.belongsTo(Workspace, { foreignKey: 'workspaceId' });

// One-to-One: Workspace → CampaignSetting
Workspace.hasOne(CampaignSetting, { foreignKey: 'workspaceId', onDelete: 'CASCADE' });
CampaignSetting.belongsTo(Workspace, { foreignKey: 'workspaceId' });

// Workspace → LinkedAccount
Workspace.hasMany(LinkedAccount, { foreignKey: 'workspaceId', onDelete: 'CASCADE' });
LinkedAccount.belongsTo(Workspace, { foreignKey: 'workspaceId' });

// User → LinkedAccount (linked_by)
User.hasMany(LinkedAccount, { foreignKey: 'linkedBy', onDelete: 'CASCADE' });
LinkedAccount.belongsTo(User, { foreignKey: 'linkedBy' });

City.belongsTo(State, { foreignKey: 'state_id' });
State.hasMany(City, { foreignKey: 'state_id' });


// Export all models
module.exports = {
  User,
  AdDetail,
  AdDraft,
  PaymentDetail,
  BillingDetail,
  Profile,
  Workspace,
  WorkspaceMember,
  RolePermission,
  Permission,
  WorkspaceSetting,
  LinkedAccount,
  CampaignSetting,
  State,
  City,
  sequelize,
};
