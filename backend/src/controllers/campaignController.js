const path = require("path");
const { AdDraft, Workspace } = require("../models");
const  CampaignSetting  = require("../models/campaignSetting");
const AdDetail = require("../models/addetail");
const { Op } = require("sequelize");
const axios = require("axios");

const ACCESS_TOKEN = process.env.SYSTEM_USER_TOKEN || "";

const getCampaignIdByName = async (accessToken, adAccountId, campaignName) => {
  const url = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns?fields=name&limit=100&access_token=${accessToken}`;
  const response = await axios.get(url);
  const campaigns = response.data.data;

  const matched = campaigns.find((c) => c.name === campaignName);
  if (!matched) throw new Error("Campaign not found by name");

  return matched.id;
};

exports.saveAdDraft = async (req, res) => {
  try {
    if (!req.body.metadata || !req.file) {
      return res.status(400).json({ error: "Missing metadata or image" });
    }

    let metadata;
    try {
      metadata = JSON.parse(req.body.metadata);
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON in metadata" });
    }

    console.log("metadata:", metadata);

    // Local file system path (relative)
    const localPath = req.file.path; // e.g., 'uploads/image.jpg'
    // Public URL to serve in frontend
    const publicUrl = `${req.protocol}://${req.get("host")}/${localPath.replace(
      /\\/g,
      "/"
    )}`;

    console.log("Local path:", localPath);
    console.log("Public URL:", publicUrl);

    const draft = await AdDraft.create({
      id_users: req.user.id,
      workspaceId: req.user.currentWorkspaceId,
      metadata,
      image_path: localPath, // local file system path for backend use
      image_url: publicUrl, // public URL for frontend use (optional)
    });

    res.status(201).json({
      message: "Ad draft saved successfully",
      draftId: draft.id,
    });
  } catch (error) {
    console.error("Error saving ad draft:", error);
    res.status(500).json({ error: "Failed to save ad draft" });
  }
};




exports.fetchPaginatedInsights = async (req, res) => {
  try {
    const workspaceId = req.user.currentWorkspaceId;

    if (!workspaceId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const page = parseInt(req.body.page) || 1;       // Current page number from body
    const limit = parseInt(req.body.limit) || 10;    // Items per page from body
    const offset = (page - 1) * limit;               // Offset for DB query

    const start_date = req.body.start_date || "2025-07-01";
    const end_date = req.body.end_date || new Date().toISOString().split("T")[0];
    const fields = "impressions,clicks,spend,reach";

    // 1. Count total records for pagination
    const totalCampaigns = await AdDetail.count({
      where: { workspaceId }
    });

    // 2. Fetch paginated campaigns from DB
    const campaigns = await AdDetail.findAll({
      where: { workspaceId },
      attributes: ["adCampaignId", "campaignName", "status"],
      offset,
      limit,
      raw: true,
    });

    if (!campaigns.length) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          total: Math.ceil(totalCampaigns / limit),
          page,
          limit,
          hasNextPage: false,
          hasPrevPage: page > 1,
        }
      });
    }

    // 3. Fetch insights from Meta API for each campaign
    const result = await Promise.all(
      campaigns.map(async (c) => {
        try {
          const url = `https://graph.facebook.com/v23.0/${c.adCampaignId}/insights?access_token=${ACCESS_TOKEN}&fields=${fields}&time_range[since]=${start_date}&time_range[until]=${end_date}`;
          const response = await axios.get(url);
          const insight = response.data?.data?.[0] || {};

          return {
            campaignId: c.adCampaignId,
            campaignName: c.campaignName || "Untitled Campaign",
            status: c.status || "UNKNOWN",
            insights: insight,
          };
        } catch (err) {
          return {
            campaignId: c.adCampaignId,
            campaignName: c.campaignName || "Untitled Campaign",
            status: c.status || "UNKNOWN",
            insights: { error: "Could not fetch insights" },
          };
        }
      })
    );

    // 4. Respond with data and pagination info
    return res.status(200).json({
      success: true,
      data: result,
      pagination: {
        total: totalCampaigns,
        page,
        limit,
        hasNextPage: page * limit < totalCampaigns,
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    console.error("Error in campaign insights:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign insights",
      error: error.message,
    });
  }
};




exports.updateCampaignStatus = async (req, res) => {
  let { campaignId } = req.params;
  let { status } = req.body;
  let workspaceId = req.user.currentWorkspaceId;
  workspaceId = workspaceId.trim();
  campaignId = campaignId.trim();

  if (!campaignId || !status) {
    return res.status(400).json({
      success: false,
      message: "campaignId and status are required",
    });
  }
  console.log(campaignId);
  console.log(workspaceId);

  status = status.toUpperCase();

  // Validate status
  if (!["ACTIVE", "PAUSED"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Only 'ACTIVE' or 'PAUSED' are allowed.",
    });
  }

  try {
    // Step 1: Get current campaign record from DB
    const campaign = await AdDetail.findOne({
      where: {
        adCampaignId: campaignId,
        workspaceId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found in current workspace for this user.",
      });
    }

    // Step 2: Check if the status is already the same
    if (campaign.status === status) {
      return res.status(400).json({
        success: false,
        message: `Campaign is already ${status}. No action required.`,
      });
    }

    // Step 3: Update Meta campaign status
    const metaResponse = await axios.post(
      `https://graph.facebook.com/v23.0/${campaignId}`,
      {
        status,
        access_token: ACCESS_TOKEN,
      }
    );

    // Step 4: Update status in your DB
    campaign.status = status;
    await campaign.save();

    return res.status(200).json({
      success: true,
      message: `Campaign status updated to '${status}' successfully.`,
      meta: metaResponse.data,
    });
  } catch (error) {
    console.error(
      "Meta Campaign Update Error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to update campaign status.",
      error: error.response?.data || error.message,
    });
  }
};




exports.fetchLeads = async (req, res) => {
  const workspaceId = req.user.currentWorkspaceId;

  try {
    // 1. Get unique leadFormIds for the workspace
    const leadForms = await AdDetail.findAll({
      where: {
        workspaceId,
        leadFormId: { [Op.ne]: null }, // not null
      },
      attributes: ["leadFormId"],
      group: ["leadFormId"],
      raw: true,
    });

    if (leadForms.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No lead forms found." });
    }

    // 2. Fetch leads for each leadFormId
    const allLeads = [];

    for (const { leadFormId } of leadForms) {
      try {
        const url = `https://graph.facebook.com/v23.0/${leadFormId}/leads`;
        const response = await axios.get(url, {
          params: { access_token: ACCESS_TOKEN },
        });

        allLeads.push({
          leadFormId,
          leads: response.data.data,
        });
      } catch (err) {
        console.error(
          `Error fetching leads for form ${leadFormId}:`,
          err.response?.data || err.message
        );
        // Optionally continue or stop here depending on your needs
        allLeads.push({
          leadFormId,
          leads: [],
          error: `Failed to fetch leads for this form`,
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: allLeads,
    });
  } catch (error) {
    console.error("Lead fetch error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching leads.",
      error: error.message,
    });
  }
};



exports.campaignSetting = async (req, res) => {
  try {
    let { gender, targetAreas } = req.body;
    const workspaceId = req.user.currentWorkspaceId;

    if (!Array.isArray(targetAreas)) targetAreas = [];
    gender = gender?.trim();
    console.log({targetAreas});
    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required from session or token.",
      });
    }

    const existing = await CampaignSetting.findOne({ where: { workspaceId } });
    if (existing) {
      console.log("Existing Campaign Setting 2:", existing);
      const updatedFields = {
        workspaceId,
        gender: gender,
        targetAreas: targetAreas
      };
      await existing.update(updatedFields);

      return res.status(200).json({
        success: true,
        message: "Campaign setting updated successfully.",
      });
    } else {
      await CampaignSetting.create({
        workspaceId,
        gender: gender ?? "All",
        targetAreas: targetAreas ?? [],
      });
      return res.status(201).json({
        success: true,
        message: "Campaign setting created successfully.",
      });
    }
  } catch (error) {
    console.error("Error saving campaign setting:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while saving campaign setting.",
      error: error.message,
    });
  }
};


