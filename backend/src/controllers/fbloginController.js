const axios = require("axios");
const LinkedAccount = require("../models/linkedAccounts");

// Facebook API settings
const {
  APP_ID,
  APP_SECRET,
  REDIRECT_URI,
  BUSINESS_ID,
  AD_ACCOUNT_ID,
  SYSTEM_USER_TOKEN,
} = process.env;

// Step 1: Facebook Login (Redirect to Facebook for authentication)
const facebookLogin = (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: "Missing JWT token" });
  }

  const facebookLoginUrl = `https://www.facebook.com/v23.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=public_profile,email,pages_manage_ads,pages_read_engagement,ads_management,business_management&response_type=code&state=${token}`;
  res.redirect(facebookLoginUrl);
};

// Step 2: Callback endpoint to handle the Facebook login response
const facebookCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code not received!");
  }

  try {
    // Step 1: Exchange code for short-lived token
    const shortTokenRes = await axios.get(
      `https://graph.facebook.com/v23.0/oauth/access_token`,
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    );
    const shortLivedToken = shortTokenRes.data.access_token;
    if (!shortLivedToken) throw new Error("Failed to get short-lived token");

    // Step 2: Exchange short-lived for long-lived token
    const longTokenRes = await axios.get(
      `https://graph.facebook.com/v23.0/oauth/access_token`,
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: APP_ID,
          client_secret: APP_SECRET,
          fb_exchange_token: shortLivedToken,
        },
      }
    );
    const longLivedToken = longTokenRes.data.access_token;
    if (!longLivedToken) throw new Error("Failed to get long-lived token");

    // Step 3: Fetch user pages
    const pagesRes = await axios.get(
      `https://graph.facebook.com/v23.0/me/accounts`,
      {
        params: {
          access_token: longLivedToken,
        },
      }
    );
    const pages = pagesRes.data.data || [];
    console.log("Fetched pages:", pages);

    // Step 4: Validate user
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    // Step 5: Save and assign to BM & Ad Account
    if (pages.length > 0 && longLivedToken) {
      for (const page of pages) {
        let pageProfilePic = null;
        try {
          const pageDetails = await axios.get(
            `https://graph.facebook.com/v23.0/${page.id}`,
            {
              params: {
                fields: "id,name,picture",
                access_token: page.access_token,
              },
            }
          );
          pageProfilePic = pageDetails.data.picture?.data?.url || null;
          console.log(`Fetched profile pic for ${page.name}:`, pageProfilePic);
        } catch (err) {
          console.error(
            `Failed to fetch profile picture for ${page.name}:`,
            err.response?.data || err.message
          );
        }
        // Save to DB
        await LinkedAccount.upsert({
          workspaceId: user.currentWorkspaceId,
          linkedBy: user.id,
          accountId: null,
          pageId: page.id,
          name: page.name,
          accessToken: page.access_token,
          pageStatus: true,
          pageProfilepic: pageProfilePic,
        });

        // ===============================
        // NEW CODE START
        // Step 5.1: Assign Page to Business Manager
        try {
          const clientPages = await axios.post(
            `https://graph.facebook.com/v23.0/${BUSINESS_ID}/client_pages`,
            {
              page_id: page.id,
              permitted_tasks: ['ADVERTISE', 'ANALYZE']
            },
            { params: { access_token: SYSTEM_USER_TOKEN } }
          );
          console.log(`Page ${page.name} assigned to BM:`, clientPages.data);
        } catch (err) {
          console.error(`Failed to assign Page ${page.name} to BM:`, err.response?.data || err.message);
        }

        // Step 5.2: Link Page to Ad Account
        // try {
        //   const linkPageRes = await axios.post(
        //     `https://graph.facebook.com/v23.0/act_${AD_ACCOUNT_ID}/assigned_pages`,
        //     { page_id: page.id },
        //     { params: { access_token: SYSTEM_USER_TOKEN } }
        //   );
        //   console.log(`Page ${page.name} linked to Ad Account:`, linkPageRes.data);
        // } catch (err) {
        //   console.error(`Failed to link Page ${page.name} to Ad Account:`, err.response?.data || err.message);
        // }
        // NEW CODE END
        // ===============================
      }
    }

    const connectedPageNames = pages.map((p) => p.name).join(", ");
    const encodedMessage = encodeURIComponent(
      `Pages connected: ${connectedPageNames}`
    );

    return res.redirect(
      `https://ads.alendei.com/home?message=${encodedMessage}`
    );
  } catch (error) {
    console.error(
      "Error during Facebook OAuth:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .send("An error occurred during Facebook authentication.");
  }
};

const disconnectPage = async (req, res) => {
  const userId = req.user.id;
  const workspaceId = req.user.currentWorkspaceId;
  const pageId = req.params.pageId;

  try {
    // Step 1: Check if the linked page exists
    const account = await LinkedAccount.findOne({
      where: {
        workspaceId,
        pageId,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Page not linked or already disconnected.",
      });
    }

    const pageAccessToken = account.accessToken;

    // Step 2: Try to revoke app access from the page
    try {
      const revokeRes = await axios.delete(
        `https://graph.facebook.com/v23.0/${pageId}/subscribed_apps`,
        {
          params: {
            access_token: pageAccessToken,
          },
        }
      );

      console.log("Revoke FB permission response:", revokeRes.data);
    } catch (fbError) {
      console.warn(
        "Failed to revoke FB app permission:",
        fbError.response?.data || fbError.message
      );
      // Not fatal — we continue to delete the DB record anyway
    }

    // Step 3: Remove the page from your DB
    await LinkedAccount.destroy({
      where: {
        workspaceId,
        pageId,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Page (${pageId}) disconnected successfully.`,
    });
  } catch (err) {
    console.error("Error disconnecting page:", err);
    return res.status(500).json({
      success: false,
      message: "Internal error while disconnecting page.",
      error: err.message,
    });
  }
};

module.exports = { facebookLogin, facebookCallback, disconnectPage };
