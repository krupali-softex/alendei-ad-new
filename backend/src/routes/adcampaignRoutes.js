const express = require("express");
const router = express.Router();
const createUploader  = require('../utils/fileUpload');
const { authenticateToken } = require("../middlewares/authMiddleware");
const { createCampaignAndAdSet, metaAI, generateResponse } = require("../controllers/adcampaignController");
const { testMetaAI } = require("../controllers/aiController"); 
const{ createAdController, saveAdDraft, fetchPaginatedInsights, updateCampaignStatus, fetchLeads, campaignSetting  } = require("../controllers/campaignController");


const adImage = createUploader("uploads/adImage");



// Apply authentication middleware to all routes
router.use(authenticateToken);

//router.post("/post-ad", createCampaignAndAdSet);
router.post("/save-ad",adImage.single('image'), saveAdDraft);
router.post("/generate-test", testMetaAI);
router.post("/generate", metaAI);
router.post("/insights", fetchPaginatedInsights);
router.post("/:campaignId/status", updateCampaignStatus);
router.post("/leads", fetchLeads );
router.post("/campaign-setting", campaignSetting);



//router.post("/generateresponse", generateResponse);

module.exports = router;

