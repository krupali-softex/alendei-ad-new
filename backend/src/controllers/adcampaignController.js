const axios = require("axios");
const { getAIResponse, validateUserInput } = require("../utils/openAI");


const userSessions = require("../utils/userSessionStore");
const adAccountId = process.env.META_AD_ACCOUNT_ID;
const accessToken = process.env.META_ACCESS_TOKEN || "";
const pageID = process.env.PAGE_ID;


// Constants reused across requests
const QUESTIONS = [
  "May I know your business name?",
  "May I know the category of your product? (e.g., Clothing, Gym, Food, Travel, etc.)",
  "May I know the objective of your Ad? Options: Awareness, Traffic, Engagement, App Promotion, Sales or Lead",
  "May I know when you want to start and end the ad? Please give date in format like dd/mm/yyyy-dd/mm/yyyy",
  "May I know your budget to spend on the ad?",
  "May I know where you want to run the ad? Options: Facebook, Instagram, or both.",
  "May I know in which city or area you want to show your ad?",
  "May I know which age group you want to target? Please answer in format like 15-45, 25-40, 45-60",
  "May I know which gender you want to target? Options: Male, Female, or Both.",
];

const FIELD_KEYS = [
  "company_name",
  "category",
  "ad_objective",
  "ad_duration",
  "budget",
  "platform",
  "target_location",
  "age_group",
  "gender",
];

exports.createCampaignAndAdSet = async (req, res) => {
  try {
    // Extract and Validate Input
    const {
      campaignName,
      objective,
      daily_budget,
      bid_amount,
      billing_event,
      optimization_goal,
      promoted_object,
      targeting,
      status,
    } = req.body;

    if (
      !campaignName ||
      !objective ||
      !daily_budget ||
      !bid_amount ||
      !billing_event ||
      !optimization_goal ||
      !promoted_object ||
      !targeting ||
      !status
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Step 1: Create Campaign
    const campaignPayload = {
      name: campaignName,
      objective,
      status: "PAUSED",
      special_ad_categories: [],
    };

    const campaignApiUrl = `https://graph.facebook.com/v21.0/${adAccountId}/campaigns`;
    const campaignResponse = await axios.post(campaignApiUrl, campaignPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const campaignId = campaignResponse.data?.id;
    if (!campaignId) throw new Error("Failed to create campaign.");
    console.log("Campaign created successfully with ID:", campaignId);

    // Step 2: Create Ad Set
    const adSetPayload = {
      name: `${campaignName}_AdSet`,
      daily_budget,
      bid_amount,
      billing_event,
      optimization_goal,
      campaign_id: campaignId,
      promoted_object,
      targeting,
      status,
    };

    const adSetApiUrl = `https://graph.facebook.com/v21.0/${adAccountId}/adsets`;
    const adSetResponse = await axios.post(adSetApiUrl, adSetPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const adSetId = adSetResponse.data?.id;
    if (!adSetId) throw new Error("Failed to create ad set.");
    console.log("Ad Set created successfully with ID:", adSetId);

    let leadFormId = null; // Initialize as null, will be updated if created

    // Step 3: Create Lead Form (Only if objective is "OUTCOME_LEADS")
    if (objective === "OUTCOME_LEADS") {
      const leadFormPayload = {
        name: "Form_test7",
        questions: [
          { type: "FULL_NAME", key: "question1" },
          { type: "EMAIL", key: "question2" },
          { type: "PHONE", key: "question3" },
        ],
        privacy_policy: { url: "https://alendei.com/privacy-policy/" },
        follow_up_action_url: "https://www.example.com/thank-you",
      };

      const leadFormUrl = `https://graph.facebook.com/v21.0/${pageID}/leadgen_forms`;
      const leadFormResponse = await axios.post(leadFormUrl, leadFormPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      leadFormId = leadFormResponse.data?.id;
      if (!leadFormId) throw new Error("Failed to create lead form.");
      console.log("Lead Form created successfully with ID:", leadFormId);
    }

    // Step 4: Upload Image for Ad Creative
    const imagePayload = {
      url: "https://staticimg.amarujala.com/assets/images/myjyotish.com/2021/07/06/hanuman-ji_1625557492.jpeg",
    };

    const imageUrl = `https://graph.facebook.com/v21.0/${adAccountId}/adimages`;
    const imageResponse = await axios.post(imageUrl, imagePayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const imageId = imageResponse.data?.id;
    if (!imageId) throw new Error("Failed to upload image.");
    console.log("Image uploaded successfully with ID:", imageId);

    // Step 5: Create Ad Creative
    const adCreativePayload = {
      name: `${campaignName}_AdCreative`,
      object_story_spec: {
        page_id: pageID,
        link_data: {
          image_hash: imageId,
          link: "https://www.example.com",
          message: "Check out this amazing offer!",
          call_to_action: {
            type: "LEARN_MORE",
            value: { link: "https://www.example.com" },
          },
        },
      },
    };

    const adCreativeUrl = `https://graph.facebook.com/v21.0/${adAccountId}/adcreatives`;
    const adCreativeResponse = await axios.post(
      adCreativeUrl,
      adCreativePayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const adCreativeId = adCreativeResponse.data?.id;
    if (!adCreativeId) throw new Error("Failed to create ad creative.");
    console.log("Ad Creative created successfully with ID:", adCreativeId);

    // Step 6: Create the Ad
    const adPayload = {
      name: `${campaignName}_Ad`,
      adset_id: adSetId,
      creative: { creative_id: adCreativeId },
      status: "PAUSED", // Change to "ACTIVE" when ready to run
    };

    const adUrl = `https://graph.facebook.com/v21.0/${adAccountId}/ads`;
    const adResponse = await axios.post(adUrl, adPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const adId = adResponse.data?.id;
    if (!adId) throw new Error("Failed to create ad.");
    console.log("Ad created successfully with ID:", adId);

    // Return Success Response
    return res.status(201).json({
      message: "Campaign, Ad Set, and Ad created successfully.",
      campaignId,
      adSetId,
      leadFormId: leadFormId || "Not Created (Not OUTCOME_LEADS)",
      imageId,
      adCreativeId,
      adId,
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.error?.message || "Failed to create ad.",
    });
  }
};


exports.metaAI = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const workspaceId = req.user.currentWorkspaceId;
    const sessionKey = `${userId}-${workspaceId}`;
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // Initialize user session if not exists
    const session = userSessions[sessionKey] ||= {
      step: 0,
      adData: {},
      greeted: false,
      completed: false,
      lastSuggested: null,
    };

     // Greet the user only once using AI response
    if (!session.greeted) {
      const userName = req.user?.username || "there";
      const capName = userName.charAt(0).toUpperCase() + userName.slice(1);
      const aiResponse = await getAIResponse(prompt, capName);
      session.greeted = true;
        return res.json({
        response: `${String(aiResponse || "").replace(/"/g, '\\"')} ${
          QUESTIONS[0]
        }`,adData:{}
      });
    }
    
    if (session.completed) {
      delete userSessions[sessionKey];
      return res.json({
      response: "Your ad setup is already complete. Let me proceed with further steps.",
      });
    }

    // Validate current input
    const validation = await validateUserInput(prompt, session.step, session.lastSuggested);
    if (!validation.valid) {
      session.lastSuggested = validation.suggested || null;
      console.log(session.lastSuggested);
      return res.json({ response: validation.message,
        adData: session.adData
       });
    }
    

    // Store valid user input
    const key = FIELD_KEYS[session.step];
    const finalValue = validation.corrected || prompt.trim();
    session.adData[key] = finalValue;
    session.step++;
    session.lastSuggested = null;

    // Final response after all questions
    if (session.step >= QUESTIONS.length) {
      session.completed = true;
      return res.json({
        success:true,
        setupComplete:true,
        response: "Thank you! Your ad setup is complete.",
        adData: session.adData,
      });
    }

    // Ask next question
    return res.json({
      response: QUESTIONS[session.step],
      adData: session.adData, // sending current user responses
    });
    

  } catch (error) {
    console.error("metaAI Error:", error);
    return res.status(500).json({
      error: "Internal server error.",
      details: error.message,
    });
  }
};
