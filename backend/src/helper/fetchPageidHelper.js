const LinkedAccount = require("../models/linkedAccounts");

const getPageIdAndAccessToken = async (userId, workspaceId) => {
  const account = await LinkedAccount.findOne({
    where: { linkedBy: userId, workspaceId },
    attributes: ["pageId", "accessToken"], // adjust field names if different
    raw: true
  });

  if (!account) {
    throw new Error("No linked Meta account found for this user/workspace.");
  }

  return {
    PAGE_ID: account.pageId,
    ACCESS_TOKEN: account.accessToken
  };
};

module.exports = getPageIdAndAccessToken;
